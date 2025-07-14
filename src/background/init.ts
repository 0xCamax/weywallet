import { CHAINS } from '../common/constants/chains.ts';
import { IndexedDB } from '../common/db/IndexDB.dao.ts';
import { Account } from "../common/evm/Account.ts";
import { Provider } from '../common/evm/Provider.ts';
import { Mailbox } from "../common/mailbox/Mailbox.ts";



export const evm = new Provider(CHAINS);
export const mailbox = new Mailbox("BACKGROUND");
export const userDB = new IndexedDB({
	dbName: 'UserData',
	storeName: 'account',
	keyPath: 'id',
});

export const keysDB = new IndexedDB({
	dbName: 'Keys',
	storeName: 'secrets',
	keyPath: 'id',
});

export const bank = new Account(CHAINS)








