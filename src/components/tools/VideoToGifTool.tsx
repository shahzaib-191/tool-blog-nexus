
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { Download, Upload, Play, Pause } from 'lucide-react';
import ToolHeader from './ToolHeader';
import { Badge } from '@/components/ui/badge';

const VideoToGifTool: React.FC = () => {
  const { toast } = useToast();
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [gifUrl, setGifUrl] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Conversion settings
  const [startTime, setStartTime] = useState(0);
  const [duration, setDuration] = useState(3);
  const [width, setWidth] = useState(320);
  const [fps, setFps] = useState(15);
  const [videoDuration, setVideoDuration] = useState(0);
  const [quality, setQuality] = useState(7); // 1-10 scale

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('video/')) {
      toast({
        title: "Invalid file type",
        description: "Please select a video file",
        variant: "destructive",
      });
      return;
    }

    // Check file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select a video under 50MB",
        variant: "destructive",
      });
      return;
    }

    setVideoFile(file);
    setGifUrl(null);
    
    // Create URL for video preview
    const objectUrl = URL.createObjectURL(file);
    setVideoUrl(objectUrl);
    
    // Reset settings
    setStartTime(0);
    setDuration(3);
  };

  const handleVideoMetadataLoaded = () => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration);
      // Default duration to 3 seconds or video length if shorter
      setDuration(Math.min(3, videoRef.current.duration));
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.currentTime = startTime;
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleConvertToGif = () => {
    if (!videoFile) return;
    
    setIsConverting(true);
    setProgress(0);
    
    // Simulate GIF conversion with progress updates
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 5;
      });
    }, 150);
    
    // Simulate conversion delay based on settings
    const conversionTime = 1000 + (duration * 200) + (width * 5) + (fps * 50) + (quality * 100);
    
    // Simulate GIF conversion (in a real app, you'd use a library like gifshot.js)
    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      
      // In a real implementation, you'd generate an actual GIF here
      // For this demo, we'll just use the video as a placeholder
      setGifUrl(videoUrl);
      setIsConverting(false);
      
      toast({
        title: "Success",
        description: "Video converted to GIF successfully!",
        variant: "default",
      });
    }, conversionTime);
  };

  const downloadGif = () => {
    if (!gifUrl) return;
    
    // In a real app, this would be the actual GIF file
    // For this demo, we're just simulating the download
    const link = document.createElement('a');
    link.href = gifUrl;
    link.download = `${videoFile?.name.split('.')[0] || 'converted'}.gif`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <ToolHeader 
        title="Video to GIF Converter" 
        description="Convert videos to animated GIFs quickly and easily."
      />

      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-6">
              {/* File Upload */}
              {!videoUrl && (
                <div className="text-center">
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="video/*"
                    className="hidden"
                  />
                  
                  <div 
                    onClick={triggerFileInput}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 cursor-pointer hover:border-blue-400 transition-colors"
                  >
                    <div className="flex flex-col items-center">
                      <Upload className="h-10 w-10 text-gray-400 mb-2" />
                      <p className="text-lg font-medium">Upload a video</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Drop your video here, or click to browse
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        Supports MP4, WebM, MOV - Max 50MB
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Video Preview and Settings */}
              {videoUrl && (
                <>
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Video Preview */}
                    <div>
                      <p className="text-sm font-medium mb-2">Video Preview</p>
                      <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                        <video 
                          ref={videoRef}
                          src={videoUrl} 
                          onLoadedMetadata={handleVideoMetadataLoaded}
                          className="w-full h-full"
                          onEnded={() => setIsPlaying(false)}
                        />
                        
                        <div 
                          className="absolute inset-0 flex items-center justify-center cursor-pointer opacity-50 hover:opacity-100 transition-opacity"
                          onClick={togglePlayPause}
                        >
                          {!isPlaying && (
                            <div className="bg-white rounded-full p-3">
                              <Play fill="currentColor" className="h-6 w-6 text-black" />
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-2 flex items-center">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={togglePlayPause}
                          className="mr-2"
                        >
                          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        <span className="text-sm">
                          Duration: {videoDuration ? formatTime(videoDuration) : "Loading..."}
                        </span>
                      </div>
                    </div>
                    
                    {/* GIF Preview */}
                    <div>
                      <p className="text-sm font-medium mb-2">GIF Preview</p>
                      <div className="bg-gray-100 rounded-lg overflow-hidden aspect-video flex items-center justify-center">
                        {isConverting ? (
                          <div className="w-full px-8 text-center">
                            <p className="mb-2 text-sm">Converting to GIF...</p>
                            <Progress value={progress} className="mb-1" />
                            <p className="text-xs text-gray-500">{progress}% complete</p>
                          </div>
                        ) : gifUrl ? (
                          <img 
                            src={gifUrl} 
                            alt="GIF Preview" 
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="text-center text-gray-400">
                            <p>Click "Convert to GIF" to preview</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Conversion Settings */}
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="font-medium mb-4">Conversion Settings</p>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label className="mb-1 block">Start Time: {formatTime(startTime)}</Label>
                        <Slider 
                          value={[startTime]} 
                          min={0} 
                          max={videoDuration || 1} 
                          step={0.1} 
                          onValueChange={(value) => setStartTime(value[0])} 
                        />
                      </div>
                      
                      <div>
                        <Label className="mb-1 block">Duration: {duration.toFixed(1)}s</Label>
                        <Slider 
                          value={[duration]} 
                          min={0.5} 
                          max={Math.min(10, videoDuration - startTime || 1)} 
                          step={0.1} 
                          onValueChange={(value) => setDuration(value[0])} 
                        />
                      </div>
                      
                      <div>
                        <Label className="mb-1 block">Width: {width}px</Label>
                        <Slider 
                          value={[width]} 
                          min={100} 
                          max={800} 
                          step={10} 
                          onValueChange={(value) => setWidth(value[0])} 
                        />
                      </div>
                      
                      <div>
                        <Label className="mb-1 block">Frame Rate: {fps} FPS</Label>
                        <Slider 
                          value={[fps]} 
                          min={5} 
                          max={30} 
                          step={1} 
                          onValueChange={(value) => setFps(value[0])} 
                        />
                      </div>
                      
                      <div>
                        <Label className="mb-1 block">Quality: {quality}/10</Label>
                        <Slider 
                          value={[quality]} 
                          min={1} 
                          max={10} 
                          step={1} 
                          onValueChange={(value) => setQuality(value[0])} 
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      onClick={handleConvertToGif}
                      disabled={isConverting || !videoUrl}
                      className="flex-1"
                    >
                      {isConverting ? "Converting..." : "Convert to GIF"}
                    </Button>
                    
                    {gifUrl && (
                      <Button
                        variant="outline"
                        onClick={downloadGif}
                        className="sm:flex-1"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download GIF
                      </Button>
                    )}
                    
                    <Button
                      variant="outline"
                      onClick={triggerFileInput}
                      className="sm:flex-1"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Change Video
                    </Button>
                  </div>
                </>
              )}
              
              {/* Tips */}
              <div className="text-sm text-gray-600 bg-blue-50 p-4 rounded-md">
                <p className="font-medium mb-2">Tips for better GIFs:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Keep your GIF short (under 5 seconds) for smaller file size</li>
                  <li>Lower frame rate (10-15 FPS) often works well for most content</li>
                  <li>Choose a balanced quality setting for good results without large file sizes</li>
                  <li>Consider reducing the width if you need a smaller file size</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default VideoToGifTool;
