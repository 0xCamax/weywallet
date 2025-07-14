export const StorageDAO = (namespace = 'local') => {
  const storage = chrome.storage[namespace];

  const callbackWrapper = (resolve, reject) => (result) => {
    if (chrome.runtime.lastError) {
      console.error(`[${capitalize(namespace)}Storage] Error:`, chrome.runtime.lastError);
      reject(chrome.runtime.lastError);
    } else {
      resolve(result);
    }
  };

  const isObject = (val) =>
    val && typeof val === "object" && !Array.isArray(val);

  return {
    create: (key, value) =>
      new Promise((resolve, reject) => {
        storage.set({ [key]: value }, callbackWrapper(() => {
          console.log(`[${capitalize(namespace)}Storage] Namespace ${key} created`);
          resolve();
        }, reject));
      }),

    read: (key) =>
      new Promise((resolve, reject) => {
        storage.get([key], callbackWrapper(resolve, reject));
      }),

    update: (key, value) =>
      new Promise((resolve, reject) => {
        storage.get([key], callbackWrapper((res) => {
          const current = res[key];
          let updated;

          if (isObject(current) && isObject(value)) {
            updated = { ...current, ...value };
          } else if (value === undefined || value === null) {
            updated = current;
          } else {
            updated = value;
          }

          storage.set({ [key]: updated }, callbackWrapper(() => {
            console.log(`[${capitalize(namespace)}Storage] Namespace ${key} updated`);
            resolve();
          }, reject));
        }, reject));
      }),

    delete: (keys) =>
      new Promise((resolve, reject) => {
        if (!Array.isArray(keys)) keys = [keys];
        storage.remove(keys, callbackWrapper(resolve, reject));
      }),

    clear: () =>
      new Promise((resolve, reject) => {
        storage.clear(callbackWrapper(resolve, reject));
      }),
  };
};

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const localStorage = StorageDAO("local")
export const sessionStorage = StorageDAO("session")