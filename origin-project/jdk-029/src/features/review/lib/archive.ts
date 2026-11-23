import type { Take } from '../../../shared/document'

const name = 'night-session'
const table = 'takes'

function connect() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(name, 1)
    request.onupgradeneeded = () => request.result.createObjectStore(table, { keyPath: 'id' })
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

async function transact<T>(mode: IDBTransactionMode, operation: (store: IDBObjectStore) => IDBRequest<T>) {
  const db = await connect()
  try {
    return await new Promise<T>((resolve, reject) => {
      const transaction = db.transaction(table, mode)
      const request = operation(transaction.objectStore(table))
      transaction.oncomplete = () => resolve(request.result)
      transaction.onabort = () => reject(transaction.error)
    })
  } finally {
    db.close()
  }
}

export const readTakes = () => transact<Take[]>('readonly', store => store.getAll())
export const writeTake = (take: Take) => transact('readwrite', store => store.put(take))
