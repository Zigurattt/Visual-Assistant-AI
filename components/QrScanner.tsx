import React, { useEffect } from 'react';
import { CloseIcon } from './icons';
import { useLanguage } from '../hooks/useLanguage';

declare global {
  interface Window {
    Html5Qrcode: any;
  }
}

interface QrScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (decodedText: string) => void;
}

const QrScanner: React.FC<QrScannerProps> = ({ isOpen, onClose, onScanSuccess }) => {
  const { t } = useLanguage();
  const readerId = "qr-code-reader-region";

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    // Check if element is in the DOM before initializing
    if (!document.getElementById(readerId)) {
        return;
    }

    const html5QrCode = new window.Html5Qrcode(readerId);
    let isScanning = true;

    const qrCodeSuccessCallback = (decodedText: string) => {
      if (isScanning) {
        isScanning = false;
        onScanSuccess(decodedText);
      }
    };
    
    const config = { fps: 10, qrbox: { width: 250, height: 250 }, supportedScanTypes: [] };

    html5QrCode.start({ facingMode: "environment" }, config, qrCodeSuccessCallback, undefined)
      .catch(err => {
        console.error("Unable to start scanning.", err);
        onClose(); // Close if camera fails to start
      });

    return () => {
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().catch(err => {
          console.error("Failed to stop the QR scanner.", err);
        });
      }
    };
  }, [isOpen, onScanSuccess, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-[60] p-4 transition-opacity duration-300 ease-in-out" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md p-6 relative transition-all duration-300 ease-in-out" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{t.qrScannerTitle}</h2>
          <button onClick={onClose} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        <div id={readerId} className="w-full"></div>
      </div>
    </div>
  );
};

export default QrScanner;
