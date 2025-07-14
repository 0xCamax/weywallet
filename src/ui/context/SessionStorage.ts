import { createContext } from "preact";
import { sessionStorage } from "../../common/dao/storage.js";

export const SessionStorage = createContext(sessionStorage);