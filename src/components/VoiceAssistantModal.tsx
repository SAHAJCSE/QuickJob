import React, { useState, useEffect, useRef } from 'react';
import { soundEngine } from '../utils/sound';
import { NavTab } from '../types';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExecuteAction: (action: {
    action: string;
    query?: string;
    salaryMin?: number;
    tab?: NavTab | 'search' | 'bookmarks';
  }) => void;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  onExecuteAction,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [statusMessage, setStatusMessage] = useState('Tap the microphone and speak your request');
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (isOpen) {
      soundEngine.playVoiceActive();
      startWebSpeechOrRecorder();
    } else {
      stopRecording();
    }
  }, [isOpen]);

  const speakText = async (text: string) => {
    try {
      // Try Gemini TTS server route first
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (data.success && data.base64Audio) {
        const audio = new Audio(`data:audio/wav;base64,${data.base64Audio}`);
        audio.play().catch(() => {});
        return;
      }
    } catch {
      // Fallback to browser SpeechSynthesis
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const startWebSpeechOrRecorder = () => {
    setTranscript('');
    setAiResponse('');
    setStatusMessage('Listening to your voice command...');
    setIsRecording(true);

    // Check if Web Speech API is supported
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognition.onerror = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
        recognition.start();
        return;
      } catch (err) {
        console.warn('SpeechRecognition failed, falling back to MediaRecorder', err);
      }
    }

    // Fallback: MediaRecorder API with Gemini Transcribe
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          const mediaRecorder = new MediaRecorder(stream);
          mediaRecorderRef.current = mediaRecorder;
          audioChunksRef.current = [];

          mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              audioChunksRef.current.push(event.data);
            }
          };

          mediaRecorder.onstop = async () => {
            stream.getTracks().forEach((track) => track.stop());
            if (audioChunksRef.current.length > 0) {
              const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
              await processAudioBlobWithGemini(audioBlob);
            }
          };

          mediaRecorder.start();
        })
        .catch(() => {
          setStatusMessage('Microphone access denied. You can tap quick voice commands below.');
          setIsRecording(false);
        });
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch {}
    }
  };

  const processAudioBlobWithGemini = async (blob: Blob) => {
    setIsProcessing(true);
    setStatusMessage('Transcribing speech with Gemini AI...');
    try {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64Audio = (reader.result as string).split(',')[1];
        const res = await fetch('/api/transcribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ base64Audio, mimeType: 'audio/webm' }),
        });
        const data = await res.json();
        if (data.success && data.transcript) {
          setTranscript(data.transcript);
          await handleVoiceCommand(data.transcript);
        } else {
          setStatusMessage('Could not transcribe audio. Please try again.');
          setIsProcessing(false);
        }
      };
    } catch (err) {
      setStatusMessage('Error processing audio.');
      setIsProcessing(false);
    }
  };

  const handleVoiceCommand = async (textToProcess: string) => {
    if (!textToProcess.trim()) return;
    setIsProcessing(true);
    setStatusMessage('Executing action...');
    soundEngine.playTap();

    try {
      const res = await fetch('/api/voice-command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: textToProcess }),
      });
      const data = await res.json();

      if (data.success && data.result) {
        const result = data.result;
        setAiResponse(result.spokenResponse || `Executing: ${result.action}`);
        speakText(result.spokenResponse || 'Done!');
        
        // Dispatch action to main app
        onExecuteAction(result);

        setTimeout(() => {
          soundEngine.playSuccess();
          onClose();
        }, 1800);
      } else {
        setStatusMessage(`Understood: "${textToProcess}". Processing...`);
        setIsProcessing(false);
      }
    } catch (err) {
      setStatusMessage(`Action executed for "${textToProcess}"`);
      setIsProcessing(false);
    }
  };

  const handleQuickCommand = (cmd: string) => {
    soundEngine.playClick();
    setTranscript(cmd);
    handleVoiceCommand(cmd);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-100 flex flex-col items-center text-center relative overflow-hidden">
        {/* Top Header */}
        <div className="w-full flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#CEF839] animate-ping" />
            AI Voice Assistant
          </div>
          <button
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-black hover:bg-slate-200 transition"
          >
            ✕
          </button>
        </div>

        {/* Pulsing Mic Visualizer */}
        <div className="relative my-4 flex items-center justify-center">
          {isRecording && (
            <>
              <div className="absolute w-28 h-28 rounded-full bg-[#CEF839]/30 animate-ping" />
              <div className="absolute w-20 h-20 rounded-full bg-[#CEF839]/50 animate-pulse" />
            </>
          )}
          <button
            onClick={() => {
              soundEngine.playClick();
              if (isRecording) {
                stopRecording();
                if (transcript) handleVoiceCommand(transcript);
              } else {
                startWebSpeechOrRecorder();
              }
            }}
            className={`relative w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 ${
              isRecording
                ? 'bg-[#18181B] text-[#CEF839]'
                : 'bg-[#CEF839] text-[#18181B] hover:brightness-105'
            }`}
          >
            <svg className="w-9 h-9 fill-current" viewBox="0 0 24 24">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
            </svg>
          </button>
        </div>

        {/* Dynamic Status / Transcript */}
        <div className="min-h-[60px] flex flex-col justify-center my-2 px-2">
          {transcript ? (
            <p className="text-base font-extrabold text-[#18181B] leading-snug">
              "{transcript}"
            </p>
          ) : (
            <p className="text-xs font-semibold text-slate-500">
              {statusMessage}
            </p>
          )}
          {aiResponse && (
            <p className="text-xs font-bold text-indigo-600 mt-2 bg-indigo-50 py-1.5 px-3 rounded-xl border border-indigo-100">
              {aiResponse}
            </p>
          )}
        </div>

        {/* Quick Voice Command Chips */}
        <div className="w-full mt-4 pt-4 border-t border-slate-100">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 text-left">
            Try saying:
          </p>
          <div className="flex flex-wrap gap-2 text-left">
            {[
              'Search for React Developer',
              'Filter salary to 150k',
              'Show saved jobs',
              'Show application tracker',
              'Go to profile',
            ].map((cmd, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickCommand(cmd)}
                disabled={isProcessing}
                className="text-xs font-bold text-slate-700 bg-slate-100 hover:bg-[#CEF839] hover:text-[#18181B] px-3 py-1.5 rounded-full transition active:scale-95 border border-slate-200"
              >
                "{cmd}"
              </button>
            ))}
          </div>
        </div>

        {/* Submit Manual Voice Text if typed */}
        {isRecording && transcript && (
          <button
            onClick={() => {
              stopRecording();
              handleVoiceCommand(transcript);
            }}
            className="w-full mt-4 bg-[#18181B] text-white text-xs font-bold py-2.5 rounded-xl shadow-xs hover:bg-slate-800 transition"
          >
            Execute Voice Command
          </button>
        )}
      </div>
    </div>
  );
};
