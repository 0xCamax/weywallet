import { localStorage } from "../../common/dao/storage.js";
import { Account } from '../../common/db/squemas.ts';
import { parseJWT } from '../../common/utils/codec.ts';
import { userDB } from '../init.ts';

export async function getUserData(): Promise<Account | null> {
	const store = await localStorage.read('session');
	if (store) {
		const { payload } = await parseJWT(store.session);
		return (await userDB.get(payload.sub)) as Account;
	}
	return null;
}
