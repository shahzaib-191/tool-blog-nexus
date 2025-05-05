
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { Download, Upload, ImageIcon } from 'lucide-react';
import ToolHeader from './ToolHeader';
import { Badge } from '@/components/ui/badge';

const ImageCompressorTool: React.FC = () => {
  const { toast } = useToast();
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [compressedImage, setCompressedImage] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [compressionLevel, setCompressionLevel] = useState<number>(80);
  const [isCompressing, setIsCompressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileType, setFileType] = useState<string>('image/jpeg');
  const [fileName, setFileName] = useState<string>('');

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

    setFileName(file.name);
    setFileType(file.type);
    setOriginalSize(file.size);
    setCompressedImage(null);
    setCompressedSize(0);

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setOriginalImage(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const compressImage = () => {
    if (!originalImage) return;
    
    setIsCompressing(true);
    setProgress(0);
    
    // Simulate compression with progress updates
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 100);
    
    // Simulate image compression (in a real app, you'd use an actual compression library)
    setTimeout(() => {
      try {
        const img = document.createElement('img');
        
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) return;
          
          // Use original dimensions
          canvas.width = img.width;
          canvas.height = img.height;
          
          // Draw image on canvas
          ctx.drawImage(img, 0, 0);
          
          // Convert to compressed data URL
          const quality = compressionLevel / 100;
          const compressedDataUrl = canvas.toDataURL(fileType, quality);
          
          // Calculate approximate compressed size
          // In a real app, you would get the actual size after compression
          const estimatedSizeReduction = 1 - (compressionLevel / 100) * 0.9;
          const estimatedCompressedSize = Math.max(
            originalSize * (1 - estimatedSizeReduction),
            originalSize * 0.1 // Ensure at least 10% of original size
          );
          
          setCompressedImage(compressedDataUrl);
          setCompressedSize(Math.floor(estimatedCompressedSize));
          setProgress(100);
          setIsCompressing(false);
          
          toast({
            title: "Success",
            description: "Image compressed successfully!",
            variant: "default",
          });
        };
        
        img.src = originalImage;
      } catch (error) {
        console.error("Error compressing image:", error);
        setIsCompressing(false);
        setProgress(0);
        toast({
          title: "Error",
          description: "Failed to compress image",
          variant: "destructive",
        });
      }
    }, 1500);
  };

  const downloadImage = () => {
    if (!compressedImage) return;
    
    const fileExtension = fileType.split('/')[1] || 'jpg';
    const baseFileName = fileName.split('.')[0] || 'compressed-image';
    
    const link = document.createElement('a');
    link.href = compressedImage;
    link.download = `${baseFileName}-compressed.${fileExtension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const compressionRatio = originalSize > 0 && compressedSize > 0 
    ? ((1 - (compressedSize / originalSize)) * 100).toFixed(1)
    : '0';

  return (
    <>
      <ToolHeader 
        title="Image Compressor" 
        description="Compress your images to reduce file size while maintaining quality."
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
                  {/* Compression Settings */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label>Compression Level: {compressionLevel}%</Label>
                      <span className="text-sm text-gray-500">
                        Quality: {100 - compressionLevel}%
                      </span>
                    </div>
                    <Slider 
                      value={[compressionLevel]} 
                      min={0} 
                      max={95} 
                      step={5}
                      onValueChange={(value) => setCompressionLevel(value[0])} 
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Higher compression</span>
                      <span>Better quality</span>
                    </div>
                  </div>
                
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Original Image */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-sm font-medium">Original Image</p>
                        <Badge variant="outline">
                          {formatFileSize(originalSize)}
                        </Badge>
                      </div>
                      <div className="bg-gray-100 rounded-lg overflow-hidden aspect-square flex items-center justify-center">
                        <img 
                          src={originalImage} 
                          alt="Original" 
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    </div>
                    
                    {/* Compressed Image */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-sm font-medium">Compressed Image</p>
                        {compressedImage && (
                          <Badge variant="default">
                            {formatFileSize(compressedSize)} ({compressionRatio}% smaller)
                          </Badge>
                        )}
                      </div>
                      <div className="bg-gray-100 rounded-lg overflow-hidden aspect-square flex items-center justify-center">
                        {isCompressing ? (
                          <div className="w-full px-8 text-center">
                            <p className="mb-2 text-sm">Compressing image...</p>
                            <Progress value={progress} className="mb-1" />
                            <p className="text-xs text-gray-500">{progress}% complete</p>
                          </div>
                        ) : compressedImage ? (
                          <img 
                            src={compressedImage} 
                            alt="Compressed" 
                            className="max-w-full max-h-full object-contain"
                          />
                        ) : (
                          <div className="text-center text-gray-400">
                            <ImageIcon className="h-12 w-12 mx-auto mb-2" />
                            <p>Click "Compress Image" to process</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      onClick={compressImage}
                      disabled={isCompressing || !originalImage}
                      className="flex-1"
                    >
                      {isCompressing ? "Compressing..." : "Compress Image"}
                    </Button>
                    
                    {compressedImage && (
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

export default ImageCompressorTool;
