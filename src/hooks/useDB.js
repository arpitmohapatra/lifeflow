import { useState, useEffect } from 'react';
import { getAll, add, update, remove } from '../utils/db';

export function useDB(storeName) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, [storeName]);

    async function loadData() {
        setLoading(true);
        try {
            const items = await getAll(storeName);
            setData(items);
        } catch (error) {
            console.error('Error loading data:', error);
        }
        setLoading(false);
    }

    async function addItem(item) {
        await add(storeName, item);
        await loadData();
    }

    async function updateItem(item) {
        await update(storeName, item);
        await loadData();
    }

    async function removeItem(id) {
        await remove(storeName, id);
        await loadData();
    }

    return { data, loading, addItem, updateItem, removeItem, reload: loadData };
}
