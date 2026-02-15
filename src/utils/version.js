const VERSION_KEY = 'lifeflow-version';
const CURRENT_VERSION = '1.0.0';

export function checkVersion() {
    // Only tracks the UI/App version in localStorage for metadata.
    // Does NOT clear or modify the persistent IndexedDB database.
    const storedVersion = localStorage.getItem(VERSION_KEY);

    if (storedVersion !== CURRENT_VERSION) {
        localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
        return true;
    }

    return false;
}

export function getCurrentVersion() {
    return CURRENT_VERSION;
}
