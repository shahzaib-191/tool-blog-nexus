
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Mic, MicOff, Trash } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ToolHeader from './ToolHeader';

const SpeechToTextTool: React.FC = () => {
  const { toast } = useToast();
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [language, setLanguage] = useState('en-US');
  const [timeElapsed, setTimeElapsed] = useState(0);
  const timerRef = useRef<number | null>(null);
  const timerStartRef = useRef<number | null>(null);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const toggleListening = () => {
    if (!isListening) {
      // Start simulated listening
      startListening();
    } else {
      // Stop simulated listening
      stopListening();
    }
  };

  const startListening = () => {
    setIsListening(true);
    
    // Simulate speech recognition
    const startTime = Date.now();
    timerStartRef.current = startTime;
    
    // Start timer
    timerRef.current = window.setInterval(() => {
      if (timerStartRef.current) {
        const elapsed = Math.floor((Date.now() - timerStartRef.current) / 1000);
        setTimeElapsed(elapsed);
      }
    }, 1000);
    
    // Simulate recognition results after a delay
    setTimeout(() => {
      // Only add text if still listening
      if (isListening) {
        appendTranscriptText("Hello, this is a test of speech recognition. ");
      }
    }, 2000);
    
    setTimeout(() => {
      // Only add text if still listening
      if (isListening) {
        appendTranscriptText("I'm demonstrating how the speech to text feature would work in a real application. ");
      }
    }, 5000);
  };
  
  const appendTranscriptText = (text: string) => {
    setTranscript(prev => prev + text);
  };

  const stopListening = () => {
    setIsListening(false);
    
    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    toast({
      title: "Recording stopped",
      description: `Transcription complete. Duration: ${formatTime(timeElapsed)}`,
    });
  };

  const clearTranscript = () => {
    setTranscript('');
    setTimeElapsed(0);
    toast({
      title: "Cleared",
      description: "Transcript has been cleared",
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(transcript);
    toast({
      title: "Copied!",
      description: "Text copied to clipboard",
    });
  };

  const languages = [
    { value: 'en-US', label: 'English (US)' },
    { value: 'en-GB', label: 'English (UK)' },
    { value: 'es-ES', label: 'Spanish' },
    { value: 'fr-FR', label: 'French' },
    { value: 'de-DE', label: 'German' },
    { value: 'it-IT', label: 'Italian' },
    { value: 'ja-JP', label: 'Japanese' },
    { value: 'ko-KR', label: 'Korean' },
    { value: 'pt-BR', label: 'Portuguese (Brazil)' },
    { value: 'ru-RU', label: 'Russian' },
    { value: 'zh-CN', label: 'Chinese (Simplified)' }
  ];

  return (
    <>
      <ToolHeader 
        title="Speech to Text" 
        description="Convert spoken words into written text. Perfect for dictation and transcriptions."
      />

      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Language</label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map(lang => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Recording Time</label>
                  <div className="relative">
                    <div className="text-2xl font-mono text-center p-2 bg-gray-100 rounded-md">
                      {formatTime(timeElapsed)}
                    </div>
                    {isListening && (
                      <div className="absolute top-1/2 right-3 transform -translate-y-1/2">
                        <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium">Transcript</label>
                  
                  {transcript && (
                    <Badge variant="default">
                      {transcript.split(/\s+/).filter(Boolean).length} words
                    </Badge>
                  )}
                </div>
                
                <Textarea 
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  className="min-h-[200px] mb-4"
                  placeholder="Your speech transcript will appear here..."
                />
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={toggleListening} 
                    variant={isListening ? "destructive" : "default"}
                    className="sm:flex-1"
                  >
                    {isListening ? (
                      <>
                        <MicOff className="h-4 w-4 mr-2" />
                        Stop Listening
                      </>
                    ) : (
                      <>
                        <Mic className="h-4 w-4 mr-2" />
                        Start Listening
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={copyToClipboard} 
                    disabled={!transcript} 
                    className="sm:flex-1"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Text
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={clearTranscript} 
                    disabled={!transcript} 
                    className="sm:flex-1"
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                </div>
              </div>
              
              <div className="text-sm text-gray-600 bg-blue-50 p-4 rounded-md">
                <p className="font-medium mb-2">Tips for better transcription:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Speak clearly and at a moderate pace</li>
                  <li>Use a good microphone in a quiet environment</li>
                  <li>Speak closer to your microphone</li>
                  <li>Avoid background noise and interruptions</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default SpeechToTextTool;
