import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from './useAuth';

export interface CollectionItem {
  id: string;
  name: string;
  image: string; // base64
  timestamp: number;
  location?: {
    latitude: number;
    longitude: number;
  };
}

interface CollectionContextType {
  collection: CollectionItem[];
  toggleCollection: (item: any) => void;
  removeFromCollection: (id: string) => void;
  isItemInCollection: (item: { name: string; image: string; }) => boolean;
}

const CollectionContext = createContext<CollectionContextType | undefined>(undefined);

const COLLECTION_DB_KEY = 'visual_assistant_collection_db';

export const CollectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [collection, setCollection] = useState<CollectionItem[]>([]);

  // Load collection from localStorage when user logs in
  useEffect(() => {
    if (user?.email) {
      try {
        const allCollectionsJSON = localStorage.getItem(COLLECTION_DB_KEY);
        const allCollections = allCollectionsJSON ? JSON.parse(allCollectionsJSON) : {};
        const usercollection = allCollections[user.email] || [];
        setCollection(usercollection);
      } catch (error) {
        console.error("Failed to load collection from localStorage", error);
        setCollection([]);
      }
    } else {
      // Clear collection when user logs out
      setCollection([]);
    }
  }, [user]);
  
  const saveCollection = useCallback((newCollection: CollectionItem[]) => {
      if (user?.email) {
          try {
            const allCollectionsJSON = localStorage.getItem(COLLECTION_DB_KEY);
            const allCollections = allCollectionsJSON ? JSON.parse(allCollectionsJSON) : {};
            allCollections[user.email] = newCollection;
            localStorage.setItem(COLLECTION_DB_KEY, JSON.stringify(allCollections));
          } catch(error) {
              console.error("Failed to save collection to localStorage", error);
          }
      }
  }, [user]);

  const addToCollection = useCallback((item: any) => {
    setCollection(prevCollection => {
        if (prevCollection.some(ci => ci.image === item.image)) {
            return prevCollection;
        }
        const newItem: CollectionItem = {
            ...item,
            id: `${Date.now()}`,
            timestamp: Date.now(),
        };
        const newCollection = [...prevCollection, newItem];
        saveCollection(newCollection);
        return newCollection;
    });
  }, [saveCollection]);

  const removeFromCollection = useCallback((id: string) => {
    setCollection(prevCollection => {
        const newCollection = prevCollection.filter(item => item.id !== id);
        saveCollection(newCollection);
        return newCollection;
    });
  }, [saveCollection]);
  
  const toggleCollection = useCallback((item: any) => {
    const existingItem = collection.find(ci => ci.image === item.image);
    if (existingItem) {
        removeFromCollection(existingItem.id);
    } else {
        addToCollection(item);
    }
  }, [collection, addToCollection, removeFromCollection]);

  const isItemInCollection = useCallback((item: { name: string; image: string; }): boolean => {
    if (!item) return false;
    return collection.some(collectionItem => collectionItem.image === item.image);
  }, [collection]);
  
  const value = useMemo(() => ({
    collection,
    toggleCollection,
    removeFromCollection,
    isItemInCollection,
  }), [collection, toggleCollection, removeFromCollection, isItemInCollection]);

  return <CollectionContext.Provider value={value}>{children}</CollectionContext.Provider>;
};

export const useCollection = (): CollectionContextType => {
  const context = useContext(CollectionContext);
  if (context === undefined) {
    throw new Error('useCollection must be used within a CollectionProvider');
  }
  return context;
};