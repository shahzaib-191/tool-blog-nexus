
import { useState, useRef } from 'react';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Video, Upload, Download, Play, Pause, RotateCcw, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// Function to format file size
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  else return (bytes / 1048576).toFixed(1) + ' MB';
};

const VideoToGifTool = () => {
  const [video, setVideo] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const [quality, setQuality] = useState(75);
  const [fps, setFps] = useState(12);
  const [startTime, setStartTime] = useState(0);
  const [duration, setDuration] = useState(5);
  const [scale, setScale] = useState(100);
  const [loop, setLoop] = useState(true);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const handleVideoTime = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const video = e.currentTarget;
    if (video.currentTime >= startTime + duration) {
      video.currentTime = startTime;
      if (!loop) {
        setIsPlaying(false);
        video.pause();
      }
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Check if the file is a video
      if (!file.type.startsWith('video/')) {
        toast({
          title: "Invalid file type",
          description: "Please select a video file",
          variant: "destructive",
        });
        return;
      }
      
      // Set the selected file
      setVideo(file);
      
      // Reset any previous result
      setResultUrl(null);
      
      // Create a preview URL
      const objectUrl = URL.createObjectURL(file);
      setVideoUrl(objectUrl);
      
      // Reset video settings
      setStartTime(0);
      setIsPlaying(false);
      
      // Update duration based on video length when loaded
      const videoElement = videoRef.current;
      if (videoElement) {
        videoElement.onloadedmetadata = () => {
          const maxDuration = Math.min(10, videoElement.duration);
          setDuration(maxDuration);
        };
      }
    }
  };
  
  const togglePlayPause = () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    if (isPlaying) {
      videoElement.pause();
      setIsPlaying(false);
    } else {
      // Set current time to start time
      videoElement.currentTime = startTime;
      videoElement.play();
      setIsPlaying(true);
    }
  };
  
  const resetPreview = () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    videoElement.currentTime = startTime;
    if (!isPlaying) {
      setIsPlaying(true);
      videoElement.play();
    }
  };
  
  const handleStartTimeChange = (value: number[]) => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    setStartTime(value[0]);
    videoElement.currentTime = value[0];
  };
  
  const convertToGif = async () => {
    if (!video || !videoUrl) {
      toast({
        title: "No video selected",
        description: "Please select a video to convert",
        variant: "destructive",
      });
      return;
    }
    
    setIsConverting(true);
    
    try {
      // In a real implementation, this would use a library like ffmpeg.wasm
      // to convert the video to GIF in the browser
      // For demonstration purposes, we'll simulate the process
      
      // Wait for 3 seconds to simulate processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // For demonstration, we'll create a mock GIF (just using the video thumbnail)
      const videoElement = document.createElement('video');
      videoElement.src = videoUrl;
      
      await new Promise(resolve => {
        videoElement.onloadeddata = resolve;
        videoElement.currentTime = startTime;
      });
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) throw new Error("Could not get canvas context");
      
      // Scale the canvas based on the original video and scale setting
      canvas.width = videoElement.videoWidth * (scale / 100);
      canvas.height = videoElement.videoHeight * (scale / 100);
      
      ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
      
      // In a real implementation, we would combine multiple frames
      // For this demo, we'll just use a single frame as a "GIF"
      const gifBlob = await new Promise<Blob>(resolve => {
        canvas.toBlob(blob => {
          if (blob) resolve(blob);
          else throw new Error("Failed to create blob");
        }, 'image/png');
      });
      
      const gifUrl = URL.createObjectURL(gifBlob);
      setResultUrl(gifUrl);
      
      toast({
        title: "Conversion Complete",
        description: "Video has been converted to GIF successfully",
        variant: "success",
      });
    } catch (error) {
      console.error("Conversion failed:", error);
      toast({
        title: "Conversion Failed",
        description: "There was an error converting your video",
        variant: "destructive",
      });
    } finally {
      setIsConverting(false);
    }
  };
  
  const downloadGif = () => {
    if (!resultUrl) return;
    
    const link = document.createElement('a');
    link.href = resultUrl;
    
    // Get the original file name and add suffix
    const fileName = video?.name || 'video';
    const baseName = fileName.substring(0, fileName.lastIndexOf('.'));
    
    link.download = `${baseName}.gif`;
    link.click();
  };
  
  return (
    <div className="container mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Video className="h-5 w-5" />
            Video to GIF Converter
          </CardTitle>
          <p className="text-sm text-muted-foreground">Convert videos to animated GIFs</p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={resultUrl ? "result" : "upload"} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Upload & Convert</TabsTrigger>
              <TabsTrigger value="result" disabled={!resultUrl}>Result</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload" className="space-y-6">
              {/* Video Upload Area */}
              {!videoUrl ? (
                <div 
                  className={cn(
                    "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer",
                    "transition-all hover:border-primary/50",
                    "border-muted-foreground/30"
                  )}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="rounded-full bg-primary/10 p-4">
                      <Upload className="h-8 w-8 text-primary/80" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Click to upload a video</p>
                      <p className="text-xs text-muted-foreground">MP4, WebM, MOV, or AVI (max 20MB)</p>
                    </div>
                  </div>
                  
                  <Input 
                    ref={fileInputRef}
                    type="file" 
                    accept="video/*" 
                    onChange={handleFileChange}
                    className="hidden" 
                  />
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="relative rounded-md overflow-hidden bg-black aspect-video">
                    <video 
                      ref={videoRef}
                      src={videoUrl}
                      className="w-full h-full" 
                      onTimeUpdate={handleVideoTime}
                      onClick={togglePlayPause}
                    />
                    
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      <Button 
                        size="icon" 
                        variant="secondary" 
                        className="h-8 w-8 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70"
                        onClick={togglePlayPause}
                      >
                        {isPlaying ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                      
                      <Button 
                        size="icon" 
                        variant="secondary" 
                        className="h-8 w-8 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70"
                        onClick={resetPreview}
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setVideoUrl(null);
                        setVideo(null);
                        setResultUrl(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                    >
                      Change Video
                    </Button>
                    
                    <div className="text-sm text-muted-foreground">
                      {video && formatFileSize(video.size)}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Start time (seconds)</Label>
                        <span className="text-sm text-muted-foreground">{startTime.toFixed(1)}s</span>
                      </div>
                      <Slider
                        value={[startTime]}
                        min={0}
                        max={videoRef.current?.duration || 30}
                        step={0.1}
                        onValueChange={handleStartTimeChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Duration (seconds)</Label>
                        <span className="text-sm text-muted-foreground">{duration.toFixed(1)}s</span>
                      </div>
                      <Slider
                        value={[duration]}
                        min={1}
                        max={10}
                        step={0.1}
                        onValueChange={(values) => setDuration(values[0])}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Frame rate (FPS)</Label>
                        <span className="text-sm text-muted-foreground">{fps} fps</span>
                      </div>
                      <Slider
                        value={[fps]}
                        min={5}
                        max={24}
                        step={1}
                        onValueChange={(values) => setFps(values[0])}
                      />
                      <p className="text-xs text-muted-foreground">Higher FPS produces smoother GIFs but larger file sizes</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Quality</Label>
                        <span className="text-sm text-muted-foreground">{quality}%</span>
                      </div>
                      <Slider
                        value={[quality]}
                        min={10}
                        max={100}
                        step={5}
                        onValueChange={(values) => setQuality(values[0])}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Size</Label>
                        <span className="text-sm text-muted-foreground">{scale}%</span>
                      </div>
                      <Slider
                        value={[scale]}
                        min={10}
                        max={100}
                        step={5}
                        onValueChange={(values) => setScale(values[0])}
                      />
                      <p className="text-xs text-muted-foreground">Smaller sizes produce smaller file sizes</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="loop" 
                        checked={loop}
                        onCheckedChange={(checked) => setLoop(checked === true)}
                      />
                      <Label htmlFor="loop">Loop GIF</Label>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    onClick={convertToGif}
                    disabled={isConverting || !video}
                  >
                    {isConverting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Converting...
                      </>
                    ) : (
                      "Convert to GIF"
                    )}
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="result" className="space-y-6">
              {resultUrl && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="text-sm font-medium">Original Video</div>
                      <div className="border rounded-md overflow-hidden bg-black aspect-video flex items-center justify-center">
                        <video 
                          src={videoUrl as string}
                          controls
                          className="max-w-full max-h-full"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="text-sm font-medium">Generated GIF</div>
                      <div className="border rounded-md overflow-hidden bg-black/5 aspect-video flex items-center justify-center">
                        <img 
                          src={resultUrl} 
                          alt="GIF Result" 
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground text-center">
                        Note: In a production app, this would be an actual animated GIF
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <Button onClick={downloadGif} className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Download GIF
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default VideoToGifTool;
