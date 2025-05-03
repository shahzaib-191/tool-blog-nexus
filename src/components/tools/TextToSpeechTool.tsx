
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Save, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const TextToSpeechTool = () => {
  const [text, setText] = useState('');
  const [voice, setVoice] = useState('en-US-1');
  const [rate, setRate] = useState([1]);
  const [pitch, setPitch] = useState([1]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const voices = [
    { id: 'en-US-1', name: 'English (US) - Female' },
    { id: 'en-US-2', name: 'English (US) - Male' },
    { id: 'en-GB-1', name: 'English (UK) - Female' },
    { id: 'en-GB-2', name: 'English (UK) - Male' },
    { id: 'es-ES-1', name: 'Spanish - Female' },
    { id: 'fr-FR-1', name: 'French - Female' },
    { id: 'de-DE-1', name: 'German - Female' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text) {
      toast({
        title: "Error",
        description: "Please enter some text to convert",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      setAudioUrl('demo-audio-url');
      toast({
        title: "Success",
        description: "Text has been converted to speech successfully",
      });
    }, 2000);
  };

  const togglePlayback = () => {
    if (audioUrl) {
      setIsPlaying(!isPlaying);
      
      // In a real implementation, this would control the audio playback
      toast({
        title: isPlaying ? "Paused" : "Playing",
        description: isPlaying ? "Audio playback paused" : "Audio playback started",
      });
    }
  };

  const handleDownload = () => {
    if (audioUrl) {
      toast({
        title: "Downloading",
        description: "Your audio file is being downloaded",
      });
      // In a real implementation, this would trigger the download
    }
  };

  const handleReset = () => {
    setText('');
    setVoice('en-US-1');
    setRate([1]);
    setPitch([1]);
    setIsPlaying(false);
    setAudioUrl(null);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4 mb-6">
          <div>
            <label htmlFor="text" className="block text-sm font-medium mb-2">Enter your text</label>
            <Textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type or paste text here to convert to speech..."
              className="min-h-[150px]"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="voice" className="block text-sm font-medium mb-2">Voice</label>
              <Select value={voice} onValueChange={setVoice}>
                <SelectTrigger id="voice">
                  <SelectValue placeholder="Select a voice" />
                </SelectTrigger>
                <SelectContent>
                  {voices.map(voice => (
                    <SelectItem key={voice.id} value={voice.id}>
                      {voice.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <label htmlFor="rate" className="block text-sm font-medium">Speech Rate</label>
                  <span className="text-sm text-gray-500">{rate[0]}x</span>
                </div>
                <Slider
                  id="rate"
                  min={0.5}
                  max={2}
                  step={0.1}
                  value={rate}
                  onValueChange={setRate}
                />
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <label htmlFor="pitch" className="block text-sm font-medium">Pitch</label>
                  <span className="text-sm text-gray-500">{pitch[0]}x</span>
                </div>
                <Slider
                  id="pitch"
                  min={0.5}
                  max={2}
                  step={0.1}
                  value={pitch}
                  onValueChange={setPitch}
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between">
          <Button 
            type="submit" 
            disabled={isProcessing || !text}
          >
            {isProcessing ? 'Converting...' : 'Convert to Speech'}
          </Button>
          
          <Button 
            type="button"
            variant="outline"
            onClick={handleReset}
          >
            <RefreshCw size={16} className="mr-2" />
            Reset
          </Button>
        </div>
      </form>
      
      {audioUrl && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-medium mb-4">Your Speech</h3>
          
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <div className="flex justify-center space-x-4">
              <Button 
                onClick={togglePlayback}
                variant="outline"
                size="icon"
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </Button>
              
              <Button 
                onClick={handleDownload}
                variant="outline"
                className="flex items-center"
              >
                <Save size={16} className="mr-2" />
                Download MP3
              </Button>
            </div>
            
            <div className="mt-4 h-8 bg-blue-100 rounded relative">
              <div 
                className="absolute h-full bg-blue-500 rounded" 
                style={{ width: isPlaying ? '65%' : '0%', transition: 'width 0.1s linear' }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TextToSpeechTool;
