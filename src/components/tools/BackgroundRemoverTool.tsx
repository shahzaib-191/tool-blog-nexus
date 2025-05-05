import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { Download, Upload, Image as ImageIcon } from 'lucide-react';
import ToolHeader from './ToolHeader';
import { Badge } from '@/components/ui/badge';

const BackgroundRemoverTool: React.FC = () => {
  const { toast } = useToast();
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.match('image.*')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image under 10MB",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setOriginalImage(event.target.result as string);
        setProcessedImage(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const processImage = () => {
    if (!originalImage) return;
    
    setIsProcessing(true);
    setProgress(0);
    
    // Simulate processing with progress updates
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
    
    // Simulate background removal (in a real app, you'd use an API or library)
    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      
      // Create a canvas to process the image (this is just for simulation)
      const img = document.createElement('img');
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw the original image
        ctx.drawImage(img, 0, 0);
        
        // For simulation purposes, we'll just draw a checkerboard pattern as background
        // and keep the center part of the image
        // In a real app, you would use an actual background removal algorithm or API
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        // Simulated processing would happen here
        
        ctx.putImageData(imageData, 0, 0);
        
        // Convert canvas to data URL and set as processed image
        const processedDataUrl = canvas.toDataURL('image/png');
        setProcessedImage(processedDataUrl);
        setIsProcessing(false);
        
        toast({
          title: "Success",
          description: "Background removed successfully!",
          variant: "default",
        });
      };
      
      img.src = originalImage;
    }, 3000);
  };

  const downloadImage = () => {
    if (!processedImage) return;
    
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = 'removed-background.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <ToolHeader 
        title="Background Remover" 
        description="Remove backgrounds from images quickly and easily."
      />

      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-6">
              {/* File Upload */}
              <div className="text-center">
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                
                <div 
                  onClick={triggerFileInput}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 cursor-pointer hover:border-blue-400 transition-colors"
                >
                  <div className="flex flex-col items-center">
                    <Upload className="h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-lg font-medium">Upload an image</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Drop your image here, or click to browse
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      Supports JPG, PNG - Max 10MB
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Image Preview Section */}
              {originalImage && (
                <>
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Original Image */}
                    <div>
                      <p className="text-sm font-medium mb-2">Original Image</p>
                      <div className="bg-gray-100 rounded-lg overflow-hidden aspect-square flex items-center justify-center">
                        <img 
                          src={originalImage} 
                          alt="Original" 
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    </div>
                    
                    {/* Processed Image */}
                    <div>
                      <p className="text-sm font-medium mb-2">
                        Processed Image
                        {processedImage && (
                          <Badge variant="default" className="ml-2">
                            Background Removed
                          </Badge>
                        )}
                      </p>
                      <div className="bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABZ0RVh0Q3JlYXRpb24gVGltZQAxMC8yOS8xMiKqq3kAAAAcdEVYdFNvZnR3YXJlAEFkb2JlIEZpcmV3b3JrcyBDUzVxteM2AAABHklEQVQ4jZXSvU4CQRAF4O/AQGwjVCgWChWlCY0apYEdGmvXB/ABbkOj0UYLExISC4IvYIwk2hiDqNha7EIIoudJ7m5mcmZnZ3YRw8ivm4jO33GFM+TQxCtu8Zb8Z3OMJ5zgEEf4wG3yfIZFbCDDwE8fx9jGZZp08D2MGG9Yxc4QnA0hr0n+KgIyhJKs4AANbpP0Uq4wF+pVrmMeK9hUIj2mOoVlbGMp5CbFWcR9LEd/XgjHoF9JPN+xjxbOo9+K4CzZTdRCf5/sqgTu4AP1Meb15NeZYo61omtSjHrwW8hrkncc+TUco4YnXITiTn9VvuAejWJwM1k9FKfxPI5eppHTfB1buVI9TC30p9hXnuZ/Y1p9AN8FHpsgLWN3AAAAAElFTkSuQmCC')] rounded-lg overflow-hidden aspect-square flex items-center justify-center">
                        {isProcessing ? (
                          <div className="w-full px-8 text-center">
                            <p className="mb-2 text-sm">Processing image...</p>
                            <Progress value={progress} className="mb-1" />
                            <p className="text-xs text-gray-500">{progress}% complete</p>
                          </div>
                        ) : processedImage ? (
                          <img 
                            src={processedImage} 
                            alt="Processed" 
                            className="max-w-full max-h-full object-contain"
                          />
                        ) : (
                          <div className="text-center text-gray-400">
                            <ImageIcon className="h-12 w-12 mx-auto mb-2" />
                            <p>Click "Remove Background" to process</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 sm:justify-between">
                    <Button
                      onClick={processImage}
                      disabled={isProcessing || !originalImage}
                      className="flex-1"
                    >
                      {isProcessing ? "Processing..." : "Remove Background"}
                    </Button>
                    
                    {processedImage && (
                      <Button
                        variant="outline"
                        onClick={downloadImage}
                        className="sm:flex-1"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    )}
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default BackgroundRemoverTool;
