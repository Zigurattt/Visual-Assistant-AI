import React from 'react';
import { useCollection } from '../hooks/useCollection';
import { useLanguage } from '../hooks/useLanguage';
import { ArchiveBoxIcon, CloseIcon, TrashIcon } from './icons';

interface CollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CollectionModal: React.FC<CollectionModalProps> = ({ isOpen, onClose }) => {
  const { collection, removeFromCollection } = useCollection();
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col p-6 relative transition-all duration-300 ease-in-out" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{t.collectionTitle}</h2>
          <button onClick={onClose} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto">
          {collection.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 dark:text-slate-400">
              <ArchiveBoxIcon className="w-16 h-16 mb-4 opacity-50" />
              <p className="text-xl font-semibold">{t.collectionEmpty}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {collection.sort((a, b) => b.timestamp - a.timestamp).map(item => (
                <div key={item.id} className="group relative aspect-square bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden shadow-sm">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-white text-sm font-semibold truncate">{item.name}</p>
                  </div>
                   <button 
                    onClick={() => removeFromCollection(item.id)}
                    aria-label={`${t.removeFromCollectionLabel}: ${item.name}`}
                    className="absolute top-1.5 right-1.5 w-8 h-8 bg-black/40 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-500 transition-all duration-200"
                  >
                      <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollectionModal;