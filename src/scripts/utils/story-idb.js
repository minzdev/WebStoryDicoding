import { openDB } from 'idb';

const DB_NAME = 'storyn-db';
const DB_VERSION = 1;
const STORE_NAME = 'offline-stories';

const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME, { keyPath: 'id' });
    }
  },
});

export const saveStoryToIDB = async (story) => {
  try {
    const db = await dbPromise;
    await db.put(STORE_NAME, story);
  } catch (error) {
    console.error('Gagal menyimpan ke IDB:', error);
  }
};

export const getAllOfflineStories = async () => {
  try {
    const db = await dbPromise;
    return await db.getAll(STORE_NAME);
  } catch (error) {
    console.error('Gagal mengambil data dari IDB:', error);
    return [];
  }
};

export const deleteOfflineStory = async (id) => {
  try {
    const db = await dbPromise;
    await db.delete(STORE_NAME, id);
  } catch (error) {
    console.error('Gagal menghapus cerita offline:', error);
  }
};

export const clearAllOfflineStories = async () => {
  try {
    const db = await dbPromise;
    await db.clear(STORE_NAME);
  } catch (error) {
    console.error('Gagal menghapus semua data:', error);
  }
};
