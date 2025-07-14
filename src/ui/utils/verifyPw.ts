import { decryptRSAKey } from "../../common/crypto/rsa/utils/utils.ts";
import { Account } from "../../common/db/squemas.ts";

export async function verifyPw(account: Account, password: string): Promise<{ decryptedKey: any, pem: string} | null> {
    const test = account.efirma.privateKey.pem
    const result = await decryptRSAKey(test, password)
    return result
}