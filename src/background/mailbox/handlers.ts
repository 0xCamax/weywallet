import { REQUESTS } from '../../common/constants/requests.ts';

import { SignatureRequest, SignatureResult } from '../../common/db/squemas.ts';

import { info } from '../config/walletInfo.ts';
import { bank, evm, keysDB, mailbox, userDB } from '../init.ts';
import { RSASigner } from '../../common/crypto/rsa/Signer.ts';
import { getCurrentTab } from '../../common/mailbox/utils/utils.ts';
import { Actions, PromptAction } from '../../common/AIModels/Actions.ts';
import { getUserData } from '../utils/getUserData.ts';
import { updateBadge } from '../../ui/utils/notification.ts';
import { localStorage } from '../../common/dao/storage.js';
import { decrypt } from '../../common/crypto/utils/encdec.ts';
import { hexlifyObject } from '../../common/utils/codec.ts';
import { EthereumTx } from '../../common/evm/utils/types.ts';

let pending = 0;

export const handlers = {
	[REQUESTS.PROVIDER]: async () => {
		return { data: info };
	},

	[REQUESTS.ACCOUNTS]: async () => {
		return connectHandler();
	},

	[REQUESTS.ACCOUNTS2]: async () => {
		return connectHandler();
	},

	[REQUESTS.UPGRADE]: async () => {
		console.log('Upgrade requested');
		return { status: 'ok' };
	},

	[REQUESTS.RSA_SIGN]: async (payload: any, sender: any) => {
		updateBadge(++pending);
		const response = await signatureApproval({
			type: 'message',
			sender: sender.origin,
			payload,
			timestamp: new Date(Date.now()).toISOString(),
		});
		updateBadge(--pending);
		return response;
	},

	[REQUESTS.ECDSA_SIGN]: async (payload: any) => {
		return signatureApproval(payload);
	},

	[REQUESTS.ETH_SIGN]: async (payload: any) => {
		return console.log(payload);
	},

	[REQUESTS.PERSONAL_SIGN]: async (payload: any) => {
		return console.log(payload);
	},

	[REQUESTS.SIGN_TYPED_V1]: async (payload: any) => {
		return console.log(payload);
	},

	[REQUESTS.SIGN_TYPED_V3]: async (payload: any) => {
		return console.log(payload);
	},

	[REQUESTS.SIGN_TYPED_V4]: async (payload: any) => {
		return console.log(payload);
	},

	[REQUESTS.SEND_RAW_TX]: async (payload: any) => {
		return console.log(payload);
	},
	[REQUESTS.ACTION]: async (payload: any) => {
		return handleModelActions(payload);
	},
	[REQUESTS.ETH_SEND]: async (payload: any, sender: any) => {
		updateBadge(++pending);
		const userData = await getUserData();

		if (userData) {
			const encryptedKey = await keysDB.get(userData.activeAccount.public);
			if (encryptedKey) {
				const response = await mailbox.request(
					'APPROVAL',
					{
						type: 'ethereum-tx',
						sender: sender.origin,
						payload,
						timestamp: new Date(Date.now()).toISOString(),
					} as SignatureRequest,
					'EXTENSION'
				);
				const { iv, salt, ciphertext } = encryptedKey.secret;

				if (response.payload) {
					const result = await decrypt(
						{
							iv: new Uint8Array(iv),
							ciphertext: new Uint8Array(ciphertext),
							salt: new Uint8Array(salt),
						},
						response.payload
					);
					const key = result.secret;

					const signature = await bank.signTransaction(key, {
						...payload.params[0],
						chainId: evm.current.id,
					});
					return await evm.eth_sendRawTransaction(signature);
				} else {
					updateBadge(--pending);
					throw new Error('User rejected the request');
				}
			}
			updateBadge(--pending);
			throw new Error('Invalid account');
		}
		updateBadge(--pending);
		throw new Error('Invalid account');
	},
};

async function connectHandler() {
	const userData = await getUserData();
	if (userData) {
		return { data: [userData.activeAccount.public] };
	} else {
		return { data: [] };
	}
}

export async function signatureApproval(req: SignatureRequest): Promise<void> {
	const response = await mailbox.request('APPROVAL', req, 'EXTENSION');

	console.log({ response });
}

function handleRSASignature(data: SignatureRequest): Promise<SignatureResult> {}

function handleModelActions(payload: PromptAction): unknown {
	const { action, params } = payload;
	const handler = Actions[action];
	if (!handler) {
		console.error(`${action} not implemented`);
	}
	return handler(params);
}
