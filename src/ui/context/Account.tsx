import { useState } from 'preact/hooks';
import { createContext, JSX } from 'preact';
import { hexToUint8Array, randomPrivateKey } from '../../common/deps.ts';
import { useAccountManager, useDb, useLocalStorage, useMailbox } from './hooks/index.tsx';
import { Account as AccountSquema, Key } from '../../common/db/squemas.ts';
import type { Account as Manager } from '../../common/evm/Account.ts';
import { encrypt } from '../../common/crypto/utils/encdec.ts';
import { createGuestAccount } from '../utils/createGuest.ts';
import { uint8ArrayToHex } from '../../common/evm/abi/utils/codec.ts';
import { parseEfirma } from '../utils/parseEfirma.ts';
import { createJWT, verifyJWT } from '../utils/jwt.ts';
import { decryptRSAKey } from '../../common/crypto/rsa/utils/utils.ts';
import { verifyPw } from '../utils/verifyPw.ts';
import { EVENTS } from "../../common/constants/events.ts";

export const AccountsContext = createContext({
	create: async (_password: string, _tag?: string) => {},
	remove: (_index: number, _pw: string) => {},
	select: (_address: string) => {},
	login: (_id: string, _pw: string) => {},
	logout: () => {},
	register: (
		_userName: string,
		_certFile: File,
		_keyFile: File,
		_password: string
	) => {},
	importAccount: (_key: string, _password: string, _tag?: string) => {},
	getSession: async () => false,
	account: {} as AccountSquema,
	manager: {} as Manager,
});

export function Account({ children }: { children: JSX.Element }) {
	const localStorage = useLocalStorage();
	const { userDB, keysDB } = useDb();
	const accountManager = useAccountManager();
	const [account, setAccount] = useState<AccountSquema>();
	const { notify } = useMailbox()

	const saveKey = async (
		pubkey: string,
		secret: string,
		pw: string
	): Promise<void> => {
		try {
			const { iv, salt, ciphertext } = await encrypt({ secret }, pw);

			const encrypted = {
				iv: Array.from(iv),
				salt: Array.from(salt),
				ciphertext: Array.from(ciphertext),
			};

			await keysDB.put({
				id: pubkey,
				secret: encrypted,
			});
		} catch (err) {
			console.error('Error al guardar clave cifrada:', err);
			throw err;
		}
	};

	const login = async (id: string, password: string) => {
		try {
			const account = (await userDB.get(id)) as AccountSquema;
			if (!account) {
				throw new Error('Cuenta no encontrada');
			}
			const decrypted = await verifyPw(account, password);
			if (!decrypted) {
				throw new Error('Contraseña incorrecta');
			}
			const jwt = await createJWT(
				{
					sub: account.efirma.certificate.subject.RFC,
					publicKey: account.efirma.certificate.publicKey.pem,
					iss: globalThis.location.host,
					iat: Math.floor(Date.now() / 1000),
					exp: Math.floor(Date.now() / 1000) + 86400,
					accountType: account.type,
				},
				decrypted.decryptedKey
			);
			await localStorage.create('session', jwt);
			setAccount(account);
		} catch (err) {
			console.error('Login failed:', err);
			throw err;
		}
	};

	const logout = () => {
		localStorage.delete('session');
	};

	const register = async (
		userName: string,
		certFile: File,
		keyFile: File,
		password: string
	) => {
		try {
			const key = randomPrivateKey();
			const address = accountManager.getAddress(key);

			const { certInfo, privateKey } = await parseEfirma(certFile, keyFile);
			const decrypted = await decryptRSAKey(privateKey.pem, password);
			if (!decrypted)
				throw new Error(
					'Contraseña incorrecta. Debe ser la contraseña de la efirma'
				);

			const exists = await userDB.get(certInfo.subject.RFC);
			if (exists) throw new Error('Efirma ya registrada');

			const newKey: Key = {
				type: 'ECDSA-secp256k1',
				tag: `Key 1`,
				public: address,
				ensName: '',
				signatureHistory: [],
				pendingSignatures: [],
			};

			const newAccount: AccountSquema = {
				efirma: {
					certificate: certInfo,
					privateKey,
					pendingSignatures: [],
					signatureHistory: [],
				},
				keys: [newKey],
				userName,
				type: 'free',
				activeAccount: newKey,
			};

			await userDB.put({ id: certInfo.subject.RFC, ...newAccount });
			await saveKey(address, decrypted.pem, password);
			await login(certInfo.subject.RFC, password);
		} catch (err) {
			console.error('Register failed:', err);
			throw err;
		}
	};

	const getSession = async () => {
		try {
			const { session } = await localStorage.read('session');
			if (!session) {
				console.error('[Session]', 'No active session');
				return false;
			}

			const payload = await verifyJWT(session);
			if (!payload) {
				console.error('[Session]', 'Invalid session');
				return false;
			}

			const user = await userDB.get(payload.sub);
			if (!user) {
				console.error('[Session]', 'Usuario no encontrado en base de datos');
				return false;
			}
			setAccount(user as AccountSquema);
			return true;
		} catch (err) {
			console.error('Error loading session:', err);
			return false;
		}
	};

	const create = async (password: string, tag?: string) => {
		if (!account) return;

		const decrypted = await verifyPw(account, password);
		if (!decrypted) {
			throw new Error('Contraseña incorrecta');
		}

		const key = randomPrivateKey();
		const address = accountManager.getAddress(key);

		const newKey = {
			type: 'ECDSA-secp256k1',
			tag: tag ?? `Key ${account.keys.length + 1}`,
			public: address,
			ensName: '',
			pendingSignatures: [],
			signatureHistory: [],
		} as Key;

		const updatedAccount: AccountSquema = {
			...account,
			activeAccount: newKey,
			keys: [...account.keys, newKey],
		};

		saveKey(address, uint8ArrayToHex(key), password);
		setAccount(updatedAccount);
		await userDB.update(account.efirma.certificate.subject.RFC, {
			keys: [...account.keys, newKey],
		});
		userDB.put({
			id: account.efirma.certificate.subject.RFC,
			...updatedAccount,
		});
	};

	const importAccount = async (key: string, password: string, tag?: string) => {
		if (!account) return;

		const privkey = hexToUint8Array(key);
		const address = accountManager.getAddress(privkey);

		const decrypted = await verifyPw(account, password);
		if (!decrypted) {
			throw new Error('Contraseña incorrecta');
		}

		const newKey: Key = {
			type: 'ECDSA-secp256k1',
			tag: tag ?? `Key ${account.keys.length}`,
			public: address,
			ensName: '',
			signatureHistory: [],
			pendingSignatures: [],
		};

		const updatedAccount: AccountSquema = {
			...account,
			keys: [...account.keys, newKey],
		};

		saveKey(address, decrypted.pem, password);
		setAccount(updatedAccount);
		userDB.put({
			id: account.efirma.certificate.subject.RFC,
			...updatedAccount,
		});
	};

	const remove = async (index: number, password: string) => {
		if (!account) return;
		const decrypted = await decryptRSAKey(
			(account as AccountSquema).efirma.privateKey.pem,
			password
		);
		if (!decrypted) {
			throw new Error('Wrong Password');
		}
		const updatedKeys = account.keys.filter((_, i) => i !== index);
		setAccount({ ...account, keys: updatedKeys });
		userDB.put({
			id: account.efirma.certificate.subject.RFC,
			...{ ...account, keys: updatedKeys },
		});
	};

	const select = (address: string) => {
		if (!account) return;
		const activeAccount = account.keys.find(
			(acc) => acc.type === 'ECDSA-secp256k1' && acc.public === address
		);
		if (activeAccount) {
			const updatedAccount: AccountSquema = {
				...account,
				activeAccount,
			};

			setAccount(updatedAccount);
			userDB.put({
				id: account.efirma.certificate.subject.RFC,
				...updatedAccount,
			});
			notify(EVENTS.ACCOUNT_CHANGED, [updatedAccount.activeAccount.public])
		}
	};

	return (
		<AccountsContext.Provider
			value={{
				login,
				logout,
				register,
				create,
				remove,
				select,
				importAccount,
				getSession,
				account: account ?? createGuestAccount(),
				manager: accountManager,
			}}
		>
			{children}
		</AccountsContext.Provider>
	);
}
