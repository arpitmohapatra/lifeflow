const VERSION_KEY = 'lifeflow-version';
const CURRENT_VERSION = '1.0.0';

export function checkVersion() {
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
