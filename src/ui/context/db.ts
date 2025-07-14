import { createContext } from "preact";
import { IndexedDB } from "../../common/db/IndexDB.dao.ts";

export const dbContext = createContext({
    userDB: new IndexedDB({
        dbName: "UserData",
        storeName: "account",
        keyPath: "id"
    }),
    keysDB: new IndexedDB({
        dbName: "Keys",
        storeName: "secrets",
        keyPath: "id",
    })
})

