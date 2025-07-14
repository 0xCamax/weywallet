interface IDBOptions<T> {
	dbName: string;
	storeName: string;
	version?: number;
	keyPath: string;
}

export class IndexedDB<T extends Record<string, any>> {
	private db: IDBDatabase | null = null;

	constructor(private options: IDBOptions<T>) {}

	private log(...msgs: any[]) {
		console.log(
			`[db-${this.options.dbName}/${this.options.storeName}]`,
			...msgs
		);
	}

	private async connect(): Promise<IDBDatabase> {
		if (this.db) {
			this.log('Using cached connection');
			return this.db;
		}

		return new Promise((resolve, reject) => {
			this.log('Opening database...');
			const request = indexedDB.open(
				this.options.dbName,
				this.options.version || 1
			);

			request.onupgradeneeded = (event) => {
				this.log('Upgrading database...');
				const db = (event.target as IDBOpenDBRequest).result;
				if (!db.objectStoreNames.contains(this.options.storeName)) {
					db.createObjectStore(this.options.storeName, {
						keyPath: this.options.keyPath,
					});
					this.log(`Object store "${this.options.storeName}" created`);
				}
			};

			request.onsuccess = () => {
				this.db = request.result;
				resolve(this.db);
			};

			request.onerror = () => {
				this.log('Error opening database:', request.error);
				reject(request.error);
			};
		});
	}

	private async getStore(mode: IDBTransactionMode): Promise<IDBObjectStore> {
		const db = await this.connect();
		const tx = db.transaction(this.options.storeName, mode);
		return tx.objectStore(this.options.storeName);
	}

	async put(record: T): Promise<void> {
		this.log('Saving record:', record);
		const store = await this.getStore('readwrite');
		return new Promise((resolve, reject) => {
			const request = store.put(record);
			request.onsuccess = () => {
				this.log('Record saved');
				resolve();
			};
			request.onerror = () => {
				this.log('Error saving record:', request.error);
				reject(request.error);
			};
		});
	}

	async get(key: IDBValidKey): Promise<T | undefined> {
		this.log('Fetching record by key:', key);
		const store = await this.getStore('readonly');
		return new Promise((resolve, reject) => {
			const request = store.get(key);
			request.onsuccess = () => {
				this.log('Record fetched');
				resolve(request.result);
			};
			request.onerror = () => {
				this.log('Error fetching record:', request.error);
				reject(request.error);
			};
		});
	}

	async getAll(): Promise<T[]> {
		this.log('Fetching all records');
		const store = await this.getStore('readonly');
		return new Promise((resolve, reject) => {
			const request = store.getAll();
			request.onsuccess = () => {
				this.log(`Fetched records`);
				resolve(request.result);
			};
			request.onerror = () => {
				this.log('Error fetching all records:', request.error);
				reject(request.error);
			};
		});
	}

	async delete(key: IDBValidKey): Promise<void> {
		this.log('Deleting record with key:', key);
		const store = await this.getStore('readwrite');
		return new Promise((resolve, reject) => {
			const request = store.delete(key);
			request.onsuccess = () => {
				this.log('Record deleted');
				resolve();
			};
			request.onerror = () => {
				this.log('Error deleting record:', request.error);
				reject(request.error);
			};
		});
	}

	async clear(): Promise<void> {
		this.log('Clearing object store...');
		const store = await this.getStore('readwrite');
		return new Promise((resolve, reject) => {
			const request = store.clear();
			request.onsuccess = () => {
				this.log('All records cleared');
				resolve();
			};
			request.onerror = () => {
				this.log('Error clearing records:', request.error);
				reject(request.error);
			};
		});
	}

	async update(key: IDBValidKey, updates: Partial<T>): Promise<void> {
		this.log('Updating record:', key, updates);
		const store = await this.getStore('readwrite');

		return new Promise((resolve, reject) => {
			const getRequest = store.get(key);
			getRequest.onsuccess = () => {
				const existing = getRequest.result;
				if (!existing) {
					this.log('No record found to update');
					reject(new Error(`Record with key "${String(key)}" not found`));
					return;
				}

				const updated = { ...existing, ...updates };
				const putRequest = store.put(updated);

				putRequest.onsuccess = () => {
					this.log('Record updated');
					resolve();
				};
				putRequest.onerror = () => {
					this.log('Error updating record:', putRequest.error);
					reject(putRequest.error);
				};
			};
			getRequest.onerror = () => {
				this.log('Error fetching record for update:', getRequest.error);
				reject(getRequest.error);
			};
		});
	}
}
