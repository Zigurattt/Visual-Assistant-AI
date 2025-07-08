import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { AppState } from '../types';
import { analyzeImageAndText, AiResponse } from '../services/geminiService';
import { useSpeech } from '../hooks/useSpeech';
import { useTypewriter } from '../hooks/useTypewriter';
import Loader from './Loader';
import { SparklesIcon, StopIcon, SunIcon, MoonIcon, SettingsIcon, MicrophoneIcon, SendIcon, BookmarkIcon, ArchiveBoxIcon, ShoppingCartIcon, QrCodeIcon, CloseIcon, FileTextIcon, BookOpenIcon, YouTubeIcon, ThermometerIcon, MapIcon, BrainCircuitIcon, EyeIcon } from './icons';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import SettingsModal from './SettingsModal';
import CollectionModal from './CollectionModal';
import PdfCollectionModal from './PdfCollectionModal';
import QrScanner from './QrScanner';
import MapModal from './MapModal';
import InsightChatModal from './InsightChatModal';
import { useLanguage } from '../hooks/useLanguage';
import { useCollection } from '../hooks/useCollection';
import { usePdfCollection } from '../hooks/usePdfCollection';
import { useGeolocation } from '../hooks/useGeolocation';
import { translations, Language, languageMap } from '../translations';

type CurrentItem = AiResponse & { 
  image: string; 
  name: string;
  location?: {
    latitude: number;
    longitude: number;
  }
};

// TypeScript declaration for jspdf from CDN
declare global {
  interface Window {
    jspdf: any;
  }
}

const ScanningOverlay = () => (
    <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        <div className="w-64 h-64 relative">
            <div className="absolute inset-0 border-2 border-cyan-400/50 rounded-full animate-ping"></div>
            <div className="absolute inset-4 border-2 border-cyan-400/30 rounded-full animate-ping delay-100"></div>
            <div className="absolute inset-8 border-t-2 border-cyan-400 rounded-full animate-spin"></div>
        </div>
    </div>
);


const MainApp = () => {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [appState, setAppState] = useState(AppState.IDLE);
  const [error, setError] = useState<string | null>(null);
  const [aiResponse, setAiResponse] = useState('');
  const [textInput, setTextInput] = useState('');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [currentItem, setCurrentItem] = useState<CurrentItem | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCollectionOpen, setIsCollectionOpen] = useState(false);
  const [isPdfCollectionOpen, setIsPdfCollectionOpen] = useState(false);
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isInsightChatOpen, setIsInsightChatOpen] = useState(false);
  const [qrResult, setQrResult] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState('');
  const [speechRate, setSpeechRate] = useState(1);
  const [speechPitch, setSpeechPitch] = useState(1);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hasGreeted = useRef(false);
  
  const { theme, toggleTheme, setTheme } = useTheme();
  const { toggleCollection, isItemInCollection } = useCollection();
  const { addPdf } = usePdfCollection();
  const { isListening, transcript, startListening, stopListening, isSupported: speechIsSupported, speak, isSpeaking, setTranscript, cancelSpeaking } = useSpeech(language);
  const { location: userLocation, error: locationError } = useGeolocation();
  const displayText = useTypewriter(aiResponse, 30);

  const isSaved = useMemo(() => currentItem ? isItemInCollection(currentItem) : false, [currentItem, isItemInCollection]);

  const requestCameraPermission = useCallback(async () => {
    setAppState(AppState.AWAITING_PERMISSION);
    if (!navigator.mediaDevices?.getUserMedia) {
      setError(t.cameraNotSupportedError);
      setAppState(AppState.ERROR);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => setAppState(AppState.CAM_READY);
      }
    } catch (err) {
      console.error("Camera permission denied:", err);
      setError(t.cameraPermissionError);
      setAppState(AppState.ERROR);
    }
  }, [t, setAppState, setError]);

  useEffect(() => {
    if (appState === AppState.IDLE) {
      requestCameraPermission();
    }
  }, [appState, requestCameraPermission]);
  
  useEffect(() => {
    // Greet the user only once when the camera is ready
    if (appState === AppState.CAM_READY && user && !hasGreeted.current) {
      hasGreeted.current = true; // Set flag to prevent re-greeting
      const greeting = t.initialGreeting(user.name.split(' ')[0]);
      speak(greeting, { rate: speechRate, pitch: speechPitch });
      setAiResponse(greeting);
      setAppState(AppState.READY_TO_SCAN);
    }
  }, [appState, user, speak, t, speechRate, speechPitch]);

  const handleQuestion = useCallback(async (question: string) => {
    if (!question.trim() || !capturedImage) return;

    setAppState(AppState.ANALYZING);
    setAiResponse('');
    setTranscript('');

    const base64Data = capturedImage.split(',')[1];
    const prompt = t.promptTemplate(question);

    try {
      const response = await analyzeImageAndText(base64Data, prompt);
      const responseText = typeof response === 'string' ? response : response.description;
      setAiResponse(responseText);
      speak(responseText, { rate: speechRate, pitch: speechPitch });
      setAppState(AppState.SHOWING_RESULT);
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : "An unknown error occurred.";
      setError(errorMsg);
      setAppState(AppState.ERROR);
    }
  }, [capturedImage, speak, setTranscript, t, speechRate, speechPitch, setAppState, setAiResponse, setError]);

  useEffect(() => {
    if (!isListening && transcript) {
        handleQuestion(transcript);
    }
  }, [isListening, transcript, handleQuestion]);

  useEffect(() => {
      if (locationError) {
          console.warn("Geolocation error:", locationError);
      }
  }, [locationError]);


  const captureFrameAsBase64 = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        return canvas.toDataURL('image/jpeg');
      }
    }
    setError(t.captureFrameError);
    setAppState(AppState.ERROR);
    return null;
  }, [t, setAppState, setError]);


  const handleScanStart = () => {
    if (appState === AppState.READY_TO_SCAN || appState === AppState.SHOWING_RESULT) {
        setAppState(AppState.SCANNING);
    }
  };

  const handleScanEnd = useCallback(async () => {
    if (appState !== AppState.SCANNING) return;

    setAppState(AppState.ANALYZING);
    setAiResponse('');
    setCurrentItem(null);
    
    const imageDataUrl = captureFrameAsBase64();
    if (!imageDataUrl) return;
    
    setCapturedImage(imageDataUrl);
    const base64Data = imageDataUrl.split(',')[1];
    
    const langFullName = languageMap[language];
    const prompt = t.identifyPrompt(langFullName, language);

    try {
      const response = await analyzeImageAndText(base64Data, prompt);
      if (typeof response === 'object' && response.objectName) {
        const responseText = response.translatedDescription || response.description;
        setAiResponse(responseText);
        speak(responseText, { rate: speechRate, pitch: speechPitch });
        setCurrentItem({ 
            ...response,
            name: response.objectName,
            image: imageDataUrl,
            location: userLocation ?? undefined,
        });
      } else {
        // Fallback for non-json response
        const responseText = response as string;
        setAiResponse(responseText);
        speak(responseText, { rate: speechRate, pitch: speechPitch });
      }
      setAppState(AppState.SHOWING_RESULT);
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : "An unknown error occurred during analysis.";
      setError(errorMsg);
      setAppState(AppState.ERROR);
    }
  }, [appState, captureFrameAsBase64, speak, t, language, speechRate, speechPitch, userLocation, setAiResponse, setCurrentItem, setCapturedImage, setError, setAppState]);

  const handleScanNewObject = () => {
    cancelSpeaking();
    setCapturedImage(null);
    setCurrentItem(null);
    setAiResponse('');
    setTextInput('');
    setTranscript('');
    setAppState(AppState.READY_TO_SCAN);
  };

  const handleTextSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (textInput.trim()) {
        handleQuestion(textInput);
        setTextInput('');
      }
  };
  
  const languages = useMemo(() => Object.keys(translations) as Language[], []);
  const handleLanguageChange = () => {
    cancelSpeaking();
    const currentIndex = languages.indexOf(language);
    const nextIndex = (currentIndex + 1) % languages.length;
    setLanguage(languages[nextIndex]);
  };

  const handleToggleCollection = () => {
      if (currentItem) {
          toggleCollection(currentItem);
      }
  };

  const handleFindPrice = () => {
    if (currentItem?.searchQuery) {
        const query = encodeURIComponent(currentItem.searchQuery);
        const url = `https://www.google.com/search?tbm=shop&q=${query}`;
        window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleWatchHowTo = () => {
    if (currentItem) {
        const query = encodeURIComponent(t.howToQueryTemplate(currentItem.name));
        const url = `https://www.youtube.com/results?search_query=${query}`;
        window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleQrScanSuccess = (decodedText: string) => {
    setIsQrScannerOpen(false);
    setQrResult(decodedText);
  };
  
  const handleGeneratePdf = useCallback(() => {
    if (!currentItem) return;

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.setFont("helvetica");

    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text(currentItem.name, 105, 25, { align: 'center' });

    try {
        doc.addImage(currentItem.image, 'JPEG', 15, 35, 80, 80);
    } catch(err) {
        console.error("Error adding image to PDF:", err);
    }

    let textY = 45;
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    if (currentItem.productInfo?.brand) {
        doc.text(`Brand:`, 105, textY);
        doc.setFont(undefined, 'normal');
        doc.text(currentItem.productInfo.brand, 125, textY);
        textY += 8;
    }
    if (currentItem.productInfo?.model) {
        doc.setFont(undefined, 'bold');
        doc.text(`Model:`, 105, textY);
        doc.setFont(undefined, 'normal');
        doc.text(currentItem.productInfo.model, 125, textY);
        textY += 8;
    }

    doc.setFont(undefined, 'bold');
    doc.text('Description:', 15, 128);
    doc.setFont(undefined, 'normal');
    const descriptionLines = doc.splitTextToSize(currentItem.translatedDescription, 180);
    doc.text(descriptionLines, 15, 136);

    doc.setFontSize(9);
    doc.setTextColor(150);
    const generationDate = new Date().toLocaleString(language);
    doc.text(`Generated by Visual Assistant AI on ${generationDate}`, 105, 285, { align: 'center' });

    const pdfDataUri = doc.output('datauristring');
    addPdf({
        name: currentItem.name,
        dataUri: pdfDataUri
    });

    doc.save(`${currentItem.name.replace(/\s+/g, '_')}.pdf`);
    
    setToastMessage(t.pdfGeneratedToast);
    setTimeout(() => setToastMessage(''), 3000);

  }, [currentItem, addPdf, language, t.pdfGeneratedToast, setToastMessage]);

  const isUrl = (text: string): boolean => {
    try {
        new URL(text);
        return text.startsWith('http://') || text.startsWith('https://');
    } catch (_) {
        return false;
    }
  };

  const QrResultModal = ({ result, onClose }: { result: string | null, onClose: () => void}) => {
    if (!result) return null;
    const canOpenUrl = isUrl(result);

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[70] p-4" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md p-6 relative" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{t.scannedDataTitle}</h2>
                    <button onClick={onClose} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>
                <div className="mb-6">
                    <p className="text-base text-slate-700 dark:text-slate-300 break-all bg-slate-100 dark:bg-slate-900/70 p-4 rounded-lg">{result}</p>
                </div>
                <div className="flex gap-3 justify-end">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-slate-300 text-slate-700 dark:text-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700/50">
                        {t.closeButtonLabel}
                    </button>
                    {canOpenUrl && (
                        <button 
                            onClick={() => { window.open(result, '_blank', 'noopener,noreferrer'); onClose(); }}
                            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors text-white bg-cyan-500 hover:bg-cyan-600"
                        >
                           {t.openLinkButton}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
  };


  const isLoading = appState === AppState.ANALYZING;
  const isScanning = appState === AppState.SCANNING;
  const showResultView = appState === AppState.SHOWING_RESULT && capturedImage;

  const mainButtonContent = useMemo(() => {
    if (isListening) return <StopIcon className="w-10 h-10 text-white"/>;
    if (showResultView) return <MicrophoneIcon className="w-10 h-10 text-white" />;
    return <span className="text-xl font-bold text-white tracking-wider">{t.holdToScan}</span>;
  }, [isListening, showResultView, t.holdToScan]);

  const mainButtonAction = () => {
    if (showResultView) {
      isListening ? stopListening() : startListening();
    }
  };

  const interactionDisabled = isLoading || isListening || isSpeaking;

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center font-sans relative overflow-hidden bg-slate-50 dark:bg-black">
      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        setTheme={setTheme}
        logout={logout}
        speechRate={speechRate}
        setSpeechRate={setSpeechRate}
        speechPitch={speechPitch}
        setSpeechPitch={setSpeechPitch}
      />
       <CollectionModal
        isOpen={isCollectionOpen}
        onClose={() => setIsCollectionOpen(false)}
      />
       <PdfCollectionModal
        isOpen={isPdfCollectionOpen}
        onClose={() => setIsPdfCollectionOpen(false)}
       />
      <MapModal 
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
      />
      <InsightChatModal
        isOpen={isInsightChatOpen}
        onClose={() => setIsInsightChatOpen(false)}
        currentItem={currentItem}
      />
      <QrScanner
        isOpen={isQrScannerOpen}
        onClose={() => setIsQrScannerOpen(false)}
        onScanSuccess={handleQrScanSuccess}
      />
      <QrResultModal result={qrResult} onClose={() => setQrResult(null)} />

       {toastMessage && (
        <div className="absolute top-24 z-[80] left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-2 rounded-full shadow-lg animate-fade-in-out">
          {toastMessage}
        </div>
      )}

      <div className="w-full max-w-4xl h-full flex flex-col p-4 md:p-8">
        <header className="flex items-center justify-between mb-4 relative w-full border-b border-slate-200 dark:border-slate-800 pb-4">
           <div className="flex items-center">
             <SparklesIcon className="w-8 h-8 text-cyan-400 mr-3" />
             <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">{t.title}</h1>
           </div>
           <div className="flex items-center gap-2">
              <button onClick={handleLanguageChange} className="px-3 h-10 w-12 flex items-center justify-center rounded-full bg-slate-200/50 text-slate-800 dark:bg-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-sm font-medium" aria-label={t.changeLanguageLabel}>{language.split('-')[0].toUpperCase()}</button>
              <button onClick={toggleTheme} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-200/50 text-slate-800 dark:bg-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all" aria-label="Toggle theme">{theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-6 h-6" />}</button>
              <button onClick={() => setIsMapOpen(true)} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-200/50 text-slate-800 dark:bg-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all" aria-label={t.openMapLabel}><MapIcon className="w-6 h-6" /></button>
              <button onClick={() => setIsQrScannerOpen(true)} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-200/50 text-slate-800 dark:bg-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all" aria-label={t.scanQrCodeLabel}><QrCodeIcon className="w-6 h-6" /></button>
              <button onClick={() => setIsCollectionOpen(true)} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-200/50 text-slate-800 dark:bg-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all" aria-label="Open collection"><ArchiveBoxIcon className="w-6 h-6" /></button>
              <button onClick={() => setIsPdfCollectionOpen(true)} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-200/50 text-slate-800 dark:bg-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all" aria-label={t.openPdfCollectionLabel}><BookOpenIcon className="w-6 h-6" /></button>
              <button onClick={() => setIsSettingsOpen(true)} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-200/50 text-slate-800 dark:bg-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all" aria-label="Open settings"><SettingsIcon className="w-6 h-6" /></button>
           </div>
        </header>

        <main className="flex-grow flex flex-col items-center justify-center relative">
          {error && <div className="absolute top-0 z-40 bg-red-500 text-white p-4 rounded-lg w-full max-w-lg text-center shadow-lg"><p className="font-bold">{t.errorTitle}</p><p>{error}</p><button onClick={() => window.location.reload()} className="mt-2 px-4 py-1 bg-red-700 rounded hover:bg-red-800">{t.refreshButton}</button></div>}
          
          <div className="w-full h-full max-h-[60vh] bg-slate-200 dark:bg-slate-800 rounded-2xl overflow-hidden shadow-2xl dark:shadow-cyan-500/10 border-2 border-slate-300 dark:border-slate-700/50 relative transition-all duration-300">
            {isLoading && <Loader text={t.analyzingLoader} />}
            {isScanning && <ScanningOverlay />}
            
            <video ref={videoRef} autoPlay playsInline className={`w-full h-full object-cover transition-opacity duration-500 ${capturedImage ? 'opacity-0' : 'opacity-100'}`} />
            <canvas ref={canvasRef} className="hidden" />
            {capturedImage && <img src={capturedImage} alt="Captured frame" className="absolute inset-0 w-full h-full object-cover" />}

            {showResultView && currentItem && (
                <button
                    onClick={handleToggleCollection}
                    aria-label={isSaved ? t.removeFromCollectionLabel : t.addToCollectionLabel}
                    className="absolute top-3 right-3 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/50 transition-all"
                >
                    <BookmarkIcon solid={isSaved} className="w-6 h-6" />
                </button>
            )}

             {(appState === AppState.SHOWING_RESULT || appState === AppState.READY_TO_SCAN) && (displayText || currentItem) &&
                <div className="absolute bottom-0 left-0 right-0 bg-white/80 dark:bg-black/70 backdrop-blur-md p-4 md:p-6 rounded-t-2xl max-h-[50%] overflow-y-auto">
                    {currentItem?.productInfo?.brand && (
                      <p className="text-sm font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 mb-1">
                          {currentItem.productInfo.brand} {currentItem.productInfo.model}
                      </p>
                    )}
                    {displayText && <p className="text-lg md:text-xl font-medium text-slate-800 dark:text-slate-100">{displayText}</p>}

                    {currentItem?.detectedText?.original && (
                      <div className="mt-3 pt-3 border-t border-slate-300/50 dark:border-slate-600/50">
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.textFoundLabel}</p>
                        <blockquote className="pl-2 border-l-2 border-cyan-500 mt-1">
                            <p className="text-base text-slate-700 dark:text-slate-300 italic">"{currentItem.detectedText.original}"</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                              <span className="font-semibold">{t.textTranslationLabel}:</span> "{currentItem.detectedText.translated}"
                            </p>
                        </blockquote>
                      </div>
                    )}
                    
                    {currentItem?.otherObjects && currentItem.otherObjects.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-300/50 dark:border-slate-600/50">
                            <h3 className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                                <EyeIcon className="w-4 h-4" />
                                <span>{t.alsoSeenLabel}</span>
                            </h3>
                            <ul className="space-y-2 max-h-24 overflow-y-auto pr-2">
                                {currentItem.otherObjects.map((obj, index) => (
                                    <li key={index} className="text-sm text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-900/40 p-2 rounded-md">
                                        <strong className="font-semibold text-slate-800 dark:text-slate-200">{obj.name}:</strong>
                                        <span className="ml-1">{obj.description}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
             }
             {isListening &&
                <div className="absolute bottom-0 left-0 right-0 bg-white/80 dark:bg-black/70 backdrop-blur-md p-6 rounded-t-2xl">
                    <p className="text-xl font-medium text-cyan-500">{transcript || t.listeningStatus}</p>
                </div>
             }
          </div>
          
          <div className="w-full mt-6 flex flex-col items-center flex-grow justify-start pb-4">
             {showResultView && currentItem?.ambient && (
                <div className="w-full max-w-2xl mb-4 flex justify-center items-center gap-4 text-sm text-slate-600 dark:text-slate-400 animate-fade-in">
                    <div className="flex items-center gap-2 rounded-full bg-slate-100 dark:bg-slate-800/60 px-3 py-1">
                        <SunIcon className="w-4 h-4 text-amber-500" />
                        <span>{currentItem.ambient.lighting}</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-full bg-slate-100 dark:bg-slate-800/60 px-3 py-1">
                        <ThermometerIcon className="w-4 h-4 text-rose-500" />
                        <span>{currentItem.ambient.temperature}</span>
                    </div>
                </div>
            )}

            {showResultView && (
              <div className="w-full max-w-2xl flex flex-col items-center mb-4 space-y-4 animate-fade-in">
                  <div className="flex flex-wrap justify-center gap-2">
                      {t.predefinedQuestions.map(q => <button key={q} onClick={() => handleQuestion(q)} className="px-4 py-2 bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200 rounded-full text-sm hover:bg-slate-300 dark:hover:bg-slate-600 transition-all duration-300 transform hover:-translate-y-px disabled:opacity-50" disabled={interactionDisabled}>{q}</button>)}
                  </div>
                  
                   <form onSubmit={handleTextSubmit} className="w-full max-w-lg flex items-center gap-2">
                        <input
                            type="text"
                            value={textInput}
                            onChange={(e) => setTextInput(e.target.value)}
                            placeholder={t.askPlaceholder}
                            disabled={interactionDisabled}
                            className="flex-grow px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-full text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:opacity-50"
                        />
                        <button 
                            type="submit" 
                            disabled={interactionDisabled || !textInput.trim()}
                            aria-label={t.sendButton}
                            className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-cyan-500 text-white hover:bg-cyan-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            <SendIcon className="w-5 h-5" />
                        </button>
                    </form>

                  <div className="flex items-center justify-center gap-3 flex-wrap">
                    <button onClick={handleScanNewObject} className="px-6 py-2 bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200 rounded-full text-base font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-all duration-300">{t.scanNewObjectButton}</button>
                    {currentItem?.isCommercial && (
                        <button 
                            onClick={handleFindPrice}
                            className="flex items-center justify-center gap-2 px-5 py-2 bg-green-500 text-white rounded-full text-base font-semibold hover:bg-green-600 transition-all duration-300 transform hover:scale-105"
                        >
                            <ShoppingCartIcon className="w-5 h-5" />
                            <span>{t.findPriceButton}</span>
                        </button>
                    )}
                     <button 
                        onClick={() => setIsInsightChatOpen(true)}
                        className="flex items-center justify-center gap-2 px-5 py-2 bg-purple-500 text-white rounded-full text-base font-semibold hover:bg-purple-600 transition-all duration-300 transform hover:scale-105"
                    >
                        <BrainCircuitIcon className="w-5 h-5" />
                        <span>{t.insightChatButton}</span>
                    </button>
                     <button 
                        onClick={handleWatchHowTo}
                        className="flex items-center justify-center gap-2 px-5 py-2 bg-red-600 text-white rounded-full text-base font-semibold hover:bg-red-700 transition-all duration-300 transform hover:scale-105"
                    >
                        <YouTubeIcon className="w-5 h-5" />
                        <span>{t.watchHowToButton}</span>
                    </button>
                     <button 
                        onClick={handleGeneratePdf}
                        className="flex items-center justify-center gap-2 px-5 py-2 bg-blue-500 text-white rounded-full text-base font-semibold hover:bg-blue-600 transition-all duration-300 transform hover:scale-105"
                    >
                        <FileTextIcon className="w-5 h-5" />
                        <span>{t.generatePdfButton}</span>
                    </button>
                  </div>
              </div>
            )}

            <div className="w-full max-w-lg flex justify-center items-center gap-4 mt-auto">
              <button
                onMouseDown={handleScanStart}
                onMouseUp={handleScanEnd}
                onTouchStart={handleScanStart}
                onTouchEnd={handleScanEnd}
                onClick={mainButtonAction}
                disabled={isLoading || (showResultView && isSpeaking)}
                className={`w-48 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg select-none
                  ${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-cyan-500 hover:bg-cyan-600'}
                  ${(isLoading || (showResultView && isSpeaking)) ? 'opacity-50 cursor-not-allowed' : ''}
                  ${isScanning ? 'scale-110 animate-pulse' : ''}
                  ${appState === AppState.READY_TO_SCAN && !isSpeaking ? 'animate-pulse' : ''}
                `}
              >
                {mainButtonContent}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainApp;