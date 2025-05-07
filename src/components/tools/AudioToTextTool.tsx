
import { useState, useRef } from 'react';
import ToolHeader from './ToolHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mic, MicOff, Upload, Trash, Play, Pause } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const AudioToTextTool = () => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [language, setLanguage] = useState('en-US');
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<number | null>(null);
  
  // Languages supported
  const languages = [
    { value: 'en-US', label: 'English (US)' },
    { value: 'en-GB', label: 'English (UK)' },
    { value: 'es-ES', label: 'Spanish (Spain)' },
    { value: 'fr-FR', label: 'French' },
    { value: 'de-DE', label: 'German' },
    { value: 'it-IT', label: 'Italian' },
    { value: 'ja-JP', label: 'Japanese' },
  ];

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      
      if (audioRef.current) {
        audioRef.current.src = URL.createObjectURL(e.target.files[0]);
      }

      toast({
        title: "File selected",
        description: `Selected file: ${e.target.files[0].name}`,
      });
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    
    // Start timer
    timerRef.current = window.setInterval(() => {
      setRecordingTime((prevTime) => prevTime + 1);
    }, 1000);
    
    toast({
      title: "Recording started",
      description: "Speak clearly into your microphone.",
    });
  };

  const stopRecording = () => {
    setIsRecording(false);
    
    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    toast({
      title: "Recording stopped",
      description: `Recorded for ${formatTime(recordingTime)}`,
    });
    
    // Simulate transcription after recording
    simulateTranscription();
  };

  const handleTranscribe = () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please upload an audio file or record audio first.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate transcription process
    simulateTranscription();
  };

  const simulateTranscription = () => {
    const processingTime = Math.random() * 2000 + 1000; // Between 1-3 seconds
    
    setTimeout(() => {
      setIsProcessing(false);
      
      const transcriptionResults = [
        "This is a sample transcription of the audio file. The speech recognition system has converted the audio to this text.",
        "Welcome to the audio transcription tool. This tool helps you convert speech to text quickly and accurately.",
        "The audio file has been successfully transcribed. This technology can help you create subtitles, notes, and documentation from audio recordings.",
        "Thank you for using our audio to text converter. The transcription quality depends on the audio quality and clarity of speech."
      ];
      
      // Pick a random result
      setTranscript(transcriptionResults[Math.floor(Math.random() * transcriptionResults.length)]);
      
      toast({
        title: "Transcription complete",
        description: "Your audio has been successfully transcribed to text.",
      });
    }, processingTime);
  };

  const clearTranscription = () => {
    setTranscript('');
    setFile(null);
    
    if (audioRef.current) {
      audioRef.current.src = '';
    }
    
    toast({
      title: "Cleared",
      description: "Transcription and audio file have been cleared.",
    });
  };

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    
    setIsPlaying(!isPlaying);
  };

  const copyToClipboard = () => {
    if (!transcript) return;
    
    navigator.clipboard.writeText(transcript);
    
    toast({
      title: "Copied to clipboard",
      description: "Transcription text has been copied to your clipboard.",
    });
  };

  return (
    <>
      <ToolHeader
        title="Audio to Text Converter"
        description="Convert audio files or recorded speech into text using advanced speech recognition."
      />
      
      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardContent className="pt-6 space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="font-semibold text-lg mb-4">Input</h3>
                
                <div className="space-y-4">
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
                  
                  <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-md hover:border-gray-400 transition-colors">
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      id="audio-file-upload"
                      accept="audio/*"
                    />
                    <label htmlFor="audio-file-upload" className="cursor-pointer text-center">
                      <div className="mb-4 p-4 bg-blue-50 text-blue-600 rounded-full mx-auto">
                        <Upload size={32} />
                      </div>
                      <p className="text-lg font-medium">Upload audio file</p>
                      <p className="text-sm text-gray-500 mb-2">or click to browse</p>
                      {file && (
                        <p className="text-sm font-medium text-blue-600">{file.name}</p>
                      )}
                    </label>
                  </div>
                  
                  {file && (
                    <div className="mt-4">
                      <audio ref={audioRef} controls className="w-full"></audio>
                    </div>
                  )}
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-2">- OR -</p>
                  </div>
                  
                  <div>
                    <div className="flex flex-col space-y-4">
                      <label className="block text-sm font-medium">Record Audio</label>
                      <div className="flex justify-between items-center p-4 bg-gray-50 rounded-md">
                        <div className="text-lg font-mono">{formatTime(recordingTime)}</div>
                        <Button
                          onClick={toggleRecording}
                          variant={isRecording ? "destructive" : "default"}
                          className="flex items-center gap-2"
                        >
                          {isRecording ? (
                            <>
                              <MicOff size={18} />
                              Stop Recording
                            </>
                          ) : (
                            <>
                              <Mic size={18} />
                              Start Recording
                            </>
                          )}
                        </Button>
                      </div>
                      
                      {isRecording && (
                        <div className="flex justify-center">
                          <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse"></div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-center mt-4">
                    <Button 
                      onClick={handleTranscribe} 
                      disabled={!file && !isRecording && recordingTime === 0}
                      className="w-full md:w-auto"
                    >
                      {isProcessing ? "Processing..." : "Transcribe Audio"}
                    </Button>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-lg">Transcription</h3>
                  {transcript && (
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={copyToClipboard}>
                        Copy
                      </Button>
                      <Button variant="outline" size="sm" onClick={clearTranscription}>
                        <Trash size={16} className="mr-1" />
                        Clear
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="min-h-[300px] bg-gray-50 p-4 rounded-md border border-gray-200">
                  {transcript ? (
                    <p className="whitespace-pre-line">{transcript}</p>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 text-center">
                      <p>Your transcribed text will appear here</p>
                      <p className="text-sm mt-2">Upload an audio file or record audio</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-md">
              <h4 className="font-medium text-blue-800 mb-2">Tips for better transcription results:</h4>
              <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                <li>Use a good quality microphone or audio recording</li>
                <li>Minimize background noise in your recording environment</li>
                <li>Speak clearly and at a moderate pace</li>
                <li>Choose the correct language for your audio</li>
                <li>Shorter audio files (under 10 minutes) give more accurate results</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AudioToTextTool;
