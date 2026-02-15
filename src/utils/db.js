import { openDB } from 'idb';

const DB_NAME = 'lifeflow-db';
const DB_VERSION = 1;

export const STORES = {
    TASKS: 'tasks',
    NOTES: 'notes',
    HABITS: 'habits',
    EVENTS: 'events',
    LISTS: 'lists',
    POMODOROS: 'pomodoros'
};

let dbInstance = null;

export async function initDB() {
    if (dbInstance) return dbInstance;

    // This initialization is non-destructive. 
    // It only creates stores if they don't exist and preserves all existing data between deployments.
    dbInstance = await openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORES.TASKS)) {
                const taskStore = db.createObjectStore(STORES.TASKS, { keyPath: 'id' });
                taskStore.createIndex('project', 'project');
                taskStore.createIndex('completed', 'completed');
                taskStore.createIndex('dueDate', 'dueDate');
            }

            if (!db.objectStoreNames.contains(STORES.NOTES)) {
                const noteStore = db.createObjectStore(STORES.NOTES, { keyPath: 'id' });
                noteStore.createIndex('tags', 'tags', { multiEntry: true });
            }

            if (!db.objectStoreNames.contains(STORES.HABITS)) {
                db.createObjectStore(STORES.HABITS, { keyPath: 'id' });
            }

            if (!db.objectStoreNames.contains(STORES.EVENTS)) {
                const eventStore = db.createObjectStore(STORES.EVENTS, { keyPath: 'id' });
                eventStore.createIndex('date', 'date');
            }

            if (!db.objectStoreNames.contains(STORES.LISTS)) {
                db.createObjectStore(STORES.LISTS, { keyPath: 'id' });
            }

            if (!db.objectStoreNames.contains(STORES.POMODOROS)) {
                const pomodoroStore = db.createObjectStore(STORES.POMODOROS, { keyPath: 'id' });
                pomodoroStore.createIndex('date', 'date');
            }
        },
    });

    return dbInstance;
}

export async function getAll(storeName) {
    const db = await initDB();
    return await db.getAll(storeName);
}

export async function getById(storeName, id) {
    const db = await initDB();
    return await db.get(storeName, id);
}

export async function add(storeName, value) {
    const db = await initDB();
    await db.add(storeName, value);
}

export async function update(storeName, value) {
    const db = await initDB();
    await db.put(storeName, value);
}

export async function remove(storeName, id) {
    const db = await initDB();
    await db.delete(storeName, id);
}
