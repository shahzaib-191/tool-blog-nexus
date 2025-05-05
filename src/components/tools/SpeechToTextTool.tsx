
import { useState, useRef } from 'react';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Mic, MicOff, Loader2 } from 'lucide-react';

const SpeechToTextTool = () => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [text, setText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
  // For browser Speech Recognition API simulation
  const recognitionRef = useRef<any>(null);
  
  const startRecording = () => {
    // Check for browser support
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: "Not supported",
        description: "Speech recognition is not supported in this browser",
        variant: "destructive",
      });
      return;
    }
    
    setIsRecording(true);
    setIsProcessing(true);
    
    // Simulate speech recognition processing
    setTimeout(() => {
      setIsProcessing(false);
      
      toast({
        title: "Recording",
        description: "Speak now, your speech is being transcribed",
      });
    }, 1000);
    
    // In a real implementation, we would use the Web Speech API
    // const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    // recognitionRef.current = new SpeechRecognition();
    // recognitionRef.current.continuous = true;
    // recognitionRef.current.interimResults = true;
    // recognitionRef.current.onresult = (event) => {
    //   const transcript = Array.from(event.results)
    //     .map(result => result[0])
    //     .map(result => result.transcript)
    //     .join('');
    //   setText(transcript);
    // };
    // recognitionRef.current.start();
  };
  
  const stopRecording = () => {
    setIsRecording(false);
    setIsProcessing(true);
    
    // Simulate processing delay
    setTimeout(() => {
      // Generate sample text as if it was transcribed
      const sampleTexts = [
        "Thank you for using this speech to text converter. This is a demo of what the functionality would look like in a real application.",
        "Voice recognition technology has come a long way. In a real implementation, this would be your actual transcribed speech.",
        "The Web Speech API allows web applications to provide speech recognition and synthesis functionality. This is just a demonstration of how it would work.",
        "With speech to text technology, you can easily convert spoken language into written text. This makes it much easier to take notes or write documents."
      ];
      
      const randomText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
      setText(randomText);
      setIsProcessing(false);
      
      toast({
        title: "Transcription complete",
        description: "Your speech has been converted to text",
        variant: "success",
      });
    }, 2000);
    
    // In a real implementation, we would stop the Web Speech API
    // if (recognitionRef.current) {
    //   recognitionRef.current.stop();
    // }
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Text copied to clipboard",
    });
  };

  return (
    <div className="container max-w-3xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Mic className="h-5 w-5" />
            Speech to Text Converter
          </CardTitle>
          <p className="text-sm text-muted-foreground">Convert your speech into text in real-time</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <Button 
              size="lg"
              variant={isRecording ? "destructive" : "default"}
              className={`h-20 w-20 rounded-full ${isRecording ? 'animate-pulse' : ''}`}
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <Loader2 className="h-8 w-8 animate-spin" />
              ) : isRecording ? (
                <MicOff className="h-8 w-8" />
              ) : (
                <Mic className="h-8 w-8" />
              )}
            </Button>
          </div>
          
          <div className="text-center text-sm">
            {isProcessing ? (
              <p>Processing your speech...</p>
            ) : isRecording ? (
              <p className="text-red-500">Recording... Click the button to stop</p>
            ) : (
              <p>Click the microphone button to start recording</p>
            )}
          </div>
          
          <div className={`border rounded-lg p-4 min-h-[200px] relative ${text ? 'bg-slate-50 dark:bg-slate-900' : ''}`}>
            {text ? (
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute top-2 right-2" 
                  onClick={copyToClipboard}
                >
                  <Copy className="h-4 w-4 mr-1" /> Copy
                </Button>
                <p className="pt-8 whitespace-pre-wrap">{text}</p>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Your transcribed text will appear here
              </div>
            )}
          </div>
          
          <div className="text-xs text-muted-foreground text-center">
            Note: This is a simulation. In a real app, this would use the Web Speech API for actual speech recognition.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SpeechToTextTool;
