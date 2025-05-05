
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { Download, Upload, Lock, Unlock, ImageIcon } from 'lucide-react';
import ToolHeader from './ToolHeader';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ImageResizerTool: React.FC = () => {
  const { toast } = useToast();
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [resizedImage, setResizedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>('');
  const [fileType, setFileType] = useState<string>('image/jpeg');
  
  // Image dimensions
  const [originalWidth, setOriginalWidth] = useState(0);
  const [originalHeight, setOriginalHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [aspectLocked, setAspectLocked] = useState(true);
  const [resizeMethod, setResizeMethod] = useState<string>('dimensions');
  const [resizePercentage, setResizePercentage] = useState<number>(50);
  const [presetSize, setPresetSize] = useState<string>('custom');

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

    setFileName(file.name);
    setFileType(file.type);
    setResizedImage(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const img = document.createElement('img');
        img.onload = () => {
          setOriginalWidth(img.width);
          setOriginalHeight(img.height);
          setWidth(img.width);
          setHeight(img.height);
        };
        img.src = event.target.result as string;
        setOriginalImage(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const updateDimensions = (newWidth: number, newHeight: number, updateSource: 'width' | 'height' | 'both') => {
    if (updateSource === 'width') {
      setWidth(newWidth);
      if (aspectLocked && originalWidth > 0) {
        const ratio = originalHeight / originalWidth;
        setHeight(Math.round(newWidth * ratio));
      }
    } else if (updateSource === 'height') {
      setHeight(newHeight);
      if (aspectLocked && originalHeight > 0) {
        const ratio = originalWidth / originalHeight;
        setWidth(Math.round(newHeight * ratio));
      }
    } else {
      setWidth(newWidth);
      setHeight(newHeight);
    }
  };

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = parseInt(e.target.value) || 0;
    updateDimensions(newWidth, height, 'width');
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = parseInt(e.target.value) || 0;
    updateDimensions(width, newHeight, 'height');
  };

  const handlePercentageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const percentage = parseInt(e.target.value) || 0;
    setResizePercentage(percentage);
    
    // Update dimensions based on percentage
    if (originalWidth > 0 && originalHeight > 0) {
      const newWidth = Math.round(originalWidth * (percentage / 100));
      const newHeight = Math.round(originalHeight * (percentage / 100));
      updateDimensions(newWidth, newHeight, 'both');
    }
  };

  const handlePresetChange = (value: string) => {
    setPresetSize(value);
    
    if (value === 'custom') return;
    
    const [presetWidth, presetHeight] = value.split('x').map(Number);
    updateDimensions(presetWidth, presetHeight, 'both');
  };

  const toggleAspectLock = () => {
    setAspectLocked(!aspectLocked);
  };

  const resizeImage = () => {
    if (!originalImage) return;
    
    setIsProcessing(true);
    setProgress(0);
    
    // Simulate resizing with progress updates
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 15;
      });
    }, 200);
    
    // Simulate image resizing (in a real app, you'd use an actual resizing library)
    setTimeout(() => {
      try {
        const img = document.createElement('img');
        
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) return;
          
          // Set canvas dimensions to target size
          canvas.width = width;
          canvas.height = height;
          
          // Draw image on canvas with new dimensions
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to data URL
          const resizedDataUrl = canvas.toDataURL(fileType);
          
          setResizedImage(resizedDataUrl);
          setProgress(100);
          setIsProcessing(false);
          
          toast({
            title: "Success",
            description: "Image resized successfully!",
            variant: "default",
          });
        };
        
        img.src = originalImage;
      } catch (error) {
        console.error("Error resizing image:", error);
        setIsProcessing(false);
        setProgress(0);
        toast({
          title: "Error",
          description: "Failed to resize image",
          variant: "destructive",
        });
      }
    }, 1000);
  };

  const downloadImage = () => {
    if (!resizedImage) return;
    
    const fileExtension = fileType.split('/')[1] || 'jpg';
    const baseFileName = fileName.split('.')[0] || 'resized-image';
    
    const link = document.createElement('a');
    link.href = resizedImage;
    link.download = `${baseFileName}-resized.${fileExtension}`;
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
        title="Image Resizer" 
        description="Resize your images to exact dimensions while maintaining quality."
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
              
              {/* Resize Options */}
              {originalImage && (
                <>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="mb-2">
                      <p className="text-sm font-medium">Original dimensions: {originalWidth} × {originalHeight} px</p>
                    </div>
                    
                    <Tabs value={resizeMethod} onValueChange={setResizeMethod} className="mt-4">
                      <TabsList className="mb-4">
                        <TabsTrigger value="dimensions">Custom Dimensions</TabsTrigger>
                        <TabsTrigger value="percentage">Percentage</TabsTrigger>
                        <TabsTrigger value="presets">Presets</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="dimensions">
                        <div className="grid grid-cols-2 gap-4 items-center">
                          <div>
                            <Label htmlFor="width">Width (px)</Label>
                            <Input
                              id="width"
                              type="number"
                              min="1"
                              value={width || ''}
                              onChange={handleWidthChange}
                              className="mt-1"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="height">Height (px)</Label>
                            <Input
                              id="height"
                              type="number"
                              min="1"
                              value={height || ''}
                              onChange={handleHeightChange}
                              className="mt-1"
                            />
                          </div>
                        </div>
                        
                        <div className="flex justify-center mt-4">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={toggleAspectLock}
                            className="flex items-center gap-1 text-xs"
                          >
                            {aspectLocked ? (
                              <>
                                <Lock className="h-3 w-3" />
                                Aspect Ratio Locked
                              </>
                            ) : (
                              <>
                                <Unlock className="h-3 w-3" />
                                Aspect Ratio Unlocked
                              </>
                            )}
                          </Button>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="percentage">
                        <div>
                          <Label htmlFor="percentage">Resize to {resizePercentage}% of original</Label>
                          <Input
                            id="percentage"
                            type="range"
                            min="1"
                            max="200"
                            value={resizePercentage}
                            onChange={handlePercentageChange}
                            className="mt-1"
                          />
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>1%</span>
                            <span>100%</span>
                            <span>200%</span>
                          </div>
                          
                          <p className="mt-4 text-sm">
                            New dimensions: {width} × {height} px
                          </p>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="presets">
                        <div>
                          <Label htmlFor="preset-size">Select a preset size</Label>
                          <Select value={presetSize} onValueChange={handlePresetChange}>
                            <SelectTrigger className="w-full mt-1">
                              <SelectValue placeholder="Select a preset size" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="custom">Custom</SelectItem>
                              <SelectItem value="1920x1080">Full HD (1920×1080)</SelectItem>
                              <SelectItem value="1280x720">HD (1280×720)</SelectItem>
                              <SelectItem value="800x600">Standard (800×600)</SelectItem>
                              <SelectItem value="1200x628">Facebook Cover (1200×628)</SelectItem>
                              <SelectItem value="1080x1080">Instagram Post (1080×1080)</SelectItem>
                              <SelectItem value="1080x1920">Instagram Story (1080×1920)</SelectItem>
                              <SelectItem value="400x400">Profile Picture (400×400)</SelectItem>
                            </SelectContent>
                          </Select>
                          
                          <p className="mt-4 text-sm">
                            New dimensions: {width} × {height} px
                          </p>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Original Image */}
                    <div>
                      <p className="text-sm font-medium mb-2">Original Image</p>
                      <div className="bg-gray-100 rounded-lg overflow-hidden aspect-video flex items-center justify-center">
                        <img 
                          src={originalImage} 
                          alt="Original" 
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    </div>
                    
                    {/* Resized Image */}
                    <div>
                      <p className="text-sm font-medium mb-2">
                        Resized Preview
                        {resizedImage && (
                          <Badge variant="default" className="ml-2">
                            {width}×{height}px
                          </Badge>
                        )}
                      </p>
                      <div className="bg-gray-100 rounded-lg overflow-hidden aspect-video flex items-center justify-center">
                        {isProcessing ? (
                          <div className="w-full px-8 text-center">
                            <p className="mb-2 text-sm">Resizing image...</p>
                            <Progress value={progress} className="mb-1" />
                            <p className="text-xs text-gray-500">{progress}% complete</p>
                          </div>
                        ) : resizedImage ? (
                          <img 
                            src={resizedImage} 
                            alt="Resized" 
                            className="max-w-full max-h-full object-contain"
                          />
                        ) : (
                          <div className="text-center text-gray-400">
                            <ImageIcon className="h-12 w-12 mx-auto mb-2" />
                            <p>Click "Resize Image" to process</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      onClick={resizeImage}
                      disabled={isProcessing || !originalImage || width <= 0 || height <= 0}
                      className="flex-1"
                    >
                      {isProcessing ? "Resizing..." : "Resize Image"}
                    </Button>
                    
                    {resizedImage && (
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

export default ImageResizerTool;
