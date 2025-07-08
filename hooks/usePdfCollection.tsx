import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from './useAuth';

export interface PdfItem {
  id: string;
  name: string;
  dataUri: string; // base64 data URI of the PDF
  timestamp: number;
}

interface PdfCollectionContextType {
  pdfCollection: PdfItem[];
  addPdf: (item: { name: string; dataUri: string; }) => void;
  removePdf: (id: string) => void;
}

const PdfCollectionContext = createContext<PdfCollectionContextType | undefined>(undefined);

const PDF_COLLECTION_DB_KEY = 'visual_assistant_pdf_collection_db';

export const PdfCollectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [pdfCollection, setPdfCollection] = useState<PdfItem[]>([]);

  // Load PDF collection from localStorage when user logs in
  useEffect(() => {
    if (user?.email) {
      try {
        const allCollectionsJSON = localStorage.getItem(PDF_COLLECTION_DB_KEY);
        const allCollections = allCollectionsJSON ? JSON.parse(allCollectionsJSON) : {};
        const userPdfCollection = allCollections[user.email] || [];
        setPdfCollection(userPdfCollection);
      } catch (error) {
        console.error("Failed to load PDF collection from localStorage", error);
        setPdfCollection([]);
      }
    } else {
      // Clear collection when user logs out
      setPdfCollection([]);
    }
  }, [user]);
  
  const savePdfCollection = useCallback((newCollection: PdfItem[]) => {
      if (user?.email) {
          try {
            const allCollectionsJSON = localStorage.getItem(PDF_COLLECTION_DB_KEY);
            const allCollections = allCollectionsJSON ? JSON.parse(allCollectionsJSON) : {};
            allCollections[user.email] = newCollection;
            localStorage.setItem(PDF_COLLECTION_DB_KEY, JSON.stringify(allCollections));
          } catch(error) {
              console.error("Failed to save PDF collection to localStorage", error);
          }
      }
  }, [user]);

  const addPdf = useCallback((item: { name: string; dataUri: string; }) => {
    setPdfCollection(prevCollection => {
        const newItem: PdfItem = {
            ...item,
            id: `${Date.now()}`,
            timestamp: Date.now(),
        };
        const newCollection = [newItem, ...prevCollection];
        savePdfCollection(newCollection);
        return newCollection;
    });
  }, [savePdfCollection]);

  const removePdf = useCallback((id: string) => {
    setPdfCollection(prevCollection => {
        const newCollection = prevCollection.filter(item => item.id !== id);
        savePdfCollection(newCollection);
        return newCollection;
    });
  }, [savePdfCollection]);
  
  const value = useMemo(() => ({
    pdfCollection,
    addPdf,
    removePdf,
  }), [pdfCollection, addPdf, removePdf]);

  return <PdfCollectionContext.Provider value={value}>{children}</PdfCollectionContext.Provider>;
};

export const usePdfCollection = (): PdfCollectionContextType => {
  const context = useContext(PdfCollectionContext);
  if (context === undefined) {
    throw new Error('usePdfCollection must be used within a PdfCollectionProvider');
  }
  return context;
};