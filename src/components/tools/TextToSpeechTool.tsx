
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Volume2, Play, Pause, Download } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const TextToSpeechTool = () => {
  const [text, setText] = useState<string>('');
  const [voice, setVoice] = useState<string>('en-US-female');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [audioGenerated, setAudioGenerated] = useState<boolean>(false);
  const { toast } = useToast();
  
  const voices = [
    { id: 'en-US-female', name: 'English (US) - Female' },
    { id: 'en-US-male', name: 'English (US) - Male' },
    { id: 'en-GB-female', name: 'English (UK) - Female' },
    { id: 'en-GB-male', name: 'English (UK) - Male' },
    { id: 'es-ES-female', name: 'Spanish - Female' },
    { id: 'fr-FR-female', name: 'French - Female' },
    { id: 'de-DE-female', name: 'German - Female' },
  ];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      toast({
        variant: "destructive",
        title: "Text is required",
        description: "Please enter some text to convert to speech"
      });
      return;
    }
    
    setIsGenerating(true);
    
    // Simulate audio generation
    setTimeout(() => {
      setIsGenerating(false);
      setAudioGenerated(true);
      toast({
        title: "Text-to-Speech completed",
        description: "Your audio has been generated successfully!"
      });
    }, 2000);
  };
  
  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
    
    // In a real implementation, this would play/pause the audio
    toast({
      title: isPlaying ? "Audio paused" : "Audio playing",
      description: "In a real implementation, this would control the audio playback"
    });
  };
  
  const downloadAudio = () => {
    toast({
      title: "Download started",
      description: "Your audio file would download now in a real implementation"
    });
  };
  
  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="text">Enter your text</Label>
          <Textarea
            id="text"
            placeholder="Type or paste text here that you want to convert to speech..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[200px]"
          />
        </div>
        
        <div>
          <Label htmlFor="voice">Select voice</Label>
          <Select
            value={voice}
            onValueChange={setVoice}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a voice" />
            </SelectTrigger>
            <SelectContent>
              {voices.map(v => (
                <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={isGenerating || !text.trim()}
        >
          {isGenerating ? (
            <span className="flex items-center">
              <span className="animate-spin mr-2">◌</span> Generating audio...
            </span>
          ) : (
            <span className="flex items-center">
              <Volume2 className="mr-2" size={18} /> Convert to Speech
            </span>
          )}
        </Button>
      </form>
      
      {audioGenerated && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <p className="text-sm mb-4 text-gray-600">Audio preview</p>
          
          <div className="flex items-center justify-between">
            <div className="flex-1 bg-gray-200 h-2 rounded-full">
              <div className="bg-blue-500 h-2 rounded-full w-1/3"></div>
            </div>
            
            <div className="flex ml-4 space-x-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="rounded-full w-10 h-10 p-0 flex items-center justify-center"
                onClick={togglePlayback}
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
              </Button>
              
              <Button 
                size="sm" 
                variant="outline" 
                className="rounded-full w-10 h-10 p-0 flex items-center justify-center"
                onClick={downloadAudio}
              >
                <Download size={18} />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TextToSpeechTool;
