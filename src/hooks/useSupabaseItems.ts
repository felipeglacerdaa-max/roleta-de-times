import { useState, useEffect } from 'react';
import type { Participant } from '../types';
import { fetchItems, addItems, removeItem, clearAllItems, type TableName } from '../services/db';

export function useSupabaseItems(tableName: TableName) {
    const [items, setItems] = useState<Participant[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Initial load from Supabase
    useEffect(() => {
        let mounted = true;
        
        async function load() {
            setIsLoading(true);
            const data = await fetchItems(tableName);
            if (mounted) {
                setItems(data);
                setIsLoading(false);
            }
        }
        
        load();
        
        return () => { mounted = false; };
    }, [tableName]);

    // This handles the generic onChange from InputList
    const handleChange = async (newItems: Participant[]) => {
        // Find if we are adding, removing, or clearing
        if (newItems.length === 0) {
            // Clear all
            setItems([]);
            await clearAllItems(tableName);
            return;
        }

        if (newItems.length < items.length) {
            // Item removed
            const removedItems = items.filter(oldItem => !newItems.some(newItem => newItem.id === oldItem.id));
            setItems(newItems); // Optimistic UI update
            
            for (const removed of removedItems) {
                await removeItem(tableName, removed.id);
            }
            return;
        }

        if (newItems.length > items.length) {
            // Item(s) added
            const addedItems = newItems.filter(newItem => !items.some(oldItem => oldItem.id === newItem.id));
            setItems(newItems); // Optimistic UI update
            
            // Insert to Supabase using the locally generated UUIDs so we can delete them later properly
            setItems(newItems); // Optimistic UI update
            await addItems(tableName, addedItems);
        }
    };

    return { items, setItems: handleChange, isLoading };
}
