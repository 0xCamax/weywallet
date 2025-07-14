import { createContext } from "preact";
import { localStorage } from "../../common/dao/storage.js";

export const LocalStorage = createContext(localStorage);