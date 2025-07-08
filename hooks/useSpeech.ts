import { useState, useEffect, useRef, useCallback } from 'react';
import { Language } from '../translations';

// Type definitions for the Web Speech API
interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onend: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  start(): void;
  stop(): void;
}

interface SpeechRecognitionStatic {
  new(): SpeechRecognition;
}

// Extend window object for SpeechSynthesis
declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionStatic;
    webkitSpeechRecognition: SpeechRecognitionStatic;
  }
}

const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
const speechSynthesisAPI = window.speechSynthesis;

export const useSpeech = (lang: Language) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [speechRecognitionSupported] = useState(!!SpeechRecognitionAPI);
  const [speechSynthesisSupported] = useState(!!speechSynthesisAPI);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // --- Speech-to-Text (Recognition) Logic ---
  useEffect(() => {
    if (!speechRecognitionSupported) return;
    
    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = lang;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
          setTranscript(prev => prev ? `${prev} ${finalTranscript}`: finalTranscript);
      }
    };
    
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => recognition.stop();
  }, [lang, speechRecognitionSupported]);
  
  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  }, [isListening]);
  
  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  // --- Text-to-Speech (Synthesis) Logic with Web Speech API ---
  const speak = useCallback(async (text: string, options?: { rate?: number; pitch?: number }) => {
    if (!speechSynthesisSupported || !text.trim()) {
        return;
    }
    
    // Interrupt any ongoing speech
    speechSynthesisAPI.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = options?.rate ?? 1;
    utterance.pitch = options?.pitch ?? 1;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (event: SpeechSynthesisErrorEvent) => {
        // The 'interrupted' error is expected when we cancel speech, so we ignore it.
        if (event.error !== 'interrupted') {
             console.error('Speech synthesis error', event.error);
        }
        setIsSpeaking(false);
    };
    
    speechSynthesisAPI.speak(utterance);
  }, [lang, speechSynthesisSupported]);
  
  const cancelSpeaking = useCallback(() => {
    if (speechSynthesisAPI) {
      speechSynthesisAPI.cancel();
    }
  }, []);

  // Cleanup effect to stop speech when the component unmounts
  useEffect(() => {
    return () => {
      if (speechSynthesisAPI) {
        speechSynthesisAPI.cancel();
      }
    };
  }, []);

  return { 
      isListening, 
      transcript, 
      startListening, 
      stopListening, 
      isSupported: speechRecognitionSupported, 
      speak, 
      isSpeaking, 
      setTranscript,
      cancelSpeaking
  };
};
