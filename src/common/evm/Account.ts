import { Signer as ecdsa_signer } from '../crypto/ecdsa/Signer.ts';
import { RecoveredSignature } from '../crypto/ecdsa/utils/types.ts';
import { Provider } from './Provider.ts';
import { Transaction } from './Transaction.ts';
import {
	addressSelf,
	EthereumTx,
	EthereumTxHex,
	SignedAuthorizationEntry,
} from './utils/types.ts';
import { RLP, keccak256 } from '../deps.ts';
import { hexlify, hexlifyObject } from '../utils/codec.ts';

export class Account extends ecdsa_signer {
	provider: Provider;
	transactions: Transaction = new Transaction();
	constructor(chains: { id: string; name: string; rpcUrl: string }[]) {
		super();
		this.provider = new Provider(chains);
	}

	getAddress(key: Uint8Array): string {
		const publicKey = this.publicKeyFromPrivateKey(key);
		return ('0x' + hexlify(keccak256(publicKey)).slice(-40)) as string;
	}

	async upgradeAccount(
		target: string,
		key: Uint8Array,
		chainId: string | number
	) {
		this.provider.changeChain(hexlify(chainId) as string);
		const address = this.getAddress(key);
		const nonce = await this.provider.eth_getTransactionCount(address);
		const authNonce = hexlify(parseInt(nonce, 16) + 1) as string;
		const authorizationDigest = keccak256(
			Uint8Array.from([0x05, ...RLP.encode([chainId, target, authNonce])])
		);
		const authorizationSignature = this.sign(authorizationDigest, key);
		const { s, r, recovery } = authorizationSignature;
		const authorization: SignedAuthorizationEntry = {
			chainId,
			address: target,
			nonce: authNonce,
			r,
			s,
			yParity: recovery,
			v: recovery + 27,
		};
		return authorization;
	}

	async signTransaction(
		key: Uint8Array,
		tx: EthereumTx,
		index: number = 0
	): Promise<string> {
		const address = this.getAddress(key);
		if (tx.to == addressSelf) tx.to = address;
		const populatedTx = await this.provider.populateTransaction(
			hexlifyObject(tx) as unknown as EthereumTxHex,
			address
		);
		const t = new Transaction(populatedTx);
		const hash = t.prepareForSigning()[index];
		const signature = this.sign(hash, key);
		const { r, s, recovery } = signature;
		t.set(
			{
				...populatedTx,
				r,
				s,
				yParity: recovery,
				v: recovery + 27,
			} as unknown as EthereumTx,
			index
		);
		console.log(t.transactions)
		return t.rawTransaction(index);
	}

	async signAll(
		key: Uint8Array,
		tx: Transaction
	): Promise<
		{
			chain: string;
			raw: string;
			signed: EthereumTxHex;
			signature: RecoveredSignature;
			hash: Uint8Array;
		}[]
	> {
		try {
			const address = this.getAddress(key) as string;
			for (let i = 0; i < tx.transactions.length; i++) {
				const t = tx.transactions[i];
				if (t.to == addressSelf) {
					t.to = address;
				}
				this.provider.changeChain(t.chainId);
				const populatedTx = await this.provider.populateTransaction(
					hexlifyObject(t) as unknown as EthereumTxHex,
					address
				);
				tx.set(populatedTx, i);
			}

			const hashes = tx.prepareForSigning();
			const signatures = hashes.map((hash) => {
				return this.sign(hash, key);
			});

			return signatures.map((sig, i) => {
				const { r, s, recovery } = sig;
				tx.set(
					{
						...tx.transactions[i],
						r,
						s,
						yParity: recovery,
						v: recovery + 27,
					},
					i
				);
				tx.rawTransaction(i);
				return {
					chain: tx.transactions[i].chainId,
					raw: tx.rawTransaction(i),
					signed: tx.transactions[i],
					signature: sig,
					hash: hashes[i],
				} as {
					chain: string;
					raw: string;
					signed: EthereumTxHex;
					hash: Uint8Array;
					signature: RecoveredSignature;
				};
			});
		} catch (error) {
			throw new Error(`[Signature error]: ${(error as Error).message}`);
		}
	}
}
