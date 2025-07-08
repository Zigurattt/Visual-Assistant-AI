import React from 'react';
import { usePdfCollection } from '../hooks/usePdfCollection';
import { useLanguage } from '../hooks/useLanguage';
import { BookOpenIcon, CloseIcon, TrashIcon, FileTextIcon } from './icons';

interface PdfCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PdfCollectionModal: React.FC<PdfCollectionModalProps> = ({ isOpen, onClose }) => {
  const { pdfCollection, removePdf } = usePdfCollection();
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl h-[90vh] flex flex-col p-6 relative transition-all duration-300 ease-in-out" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
             <BookOpenIcon className="w-7 h-7 text-cyan-500" />
             <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{t.pdfCollectionTitle}</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto pr-2">
          {pdfCollection.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 dark:text-slate-400">
              <BookOpenIcon className="w-16 h-16 mb-4 opacity-50" />
              <p className="text-xl font-semibold">{t.pdfCollectionEmpty}</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {pdfCollection.sort((a, b) => b.timestamp - a.timestamp).map(item => (
                <li key={item.id} className="group flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-700/50 rounded-lg transition-colors hover:bg-slate-200 dark:hover:bg-slate-700">
                  <div className="flex items-center gap-4 truncate">
                    <FileTextIcon className="w-6 h-6 text-cyan-500 flex-shrink-0" />
                    <div className="truncate">
                      <p className="font-semibold text-slate-800 dark:text-slate-200 truncate" title={item.name}>{item.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {new Date(item.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={item.dataUri}
                      download={`${item.name}.pdf`}
                      aria-label={`${t.downloadPdfLabel}: ${item.name}`}
                      className="px-3 py-1 bg-cyan-500 text-white rounded-md text-sm font-medium hover:bg-cyan-600 transition-colors"
                    >
                      {t.downloadPdfLabel}
                    </a>
                    <button 
                      onClick={() => removePdf(item.id)}
                      aria-label={`${t.deletePdfLabel}: ${item.name}`}
                      className="w-8 h-8 bg-slate-200 text-slate-600 rounded-md flex items-center justify-center hover:bg-red-500 hover:text-white transition-all duration-200 dark:bg-slate-600 dark:text-slate-300 dark:hover:bg-red-500"
                    >
                        <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default PdfCollectionModal;
