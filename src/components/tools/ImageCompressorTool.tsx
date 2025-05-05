
import { useState, useRef } from 'react';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Image, Upload, Download, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type CompressionResult = {
  originalSize: number;
  compressedSize: number;
  originalUrl: string;
  compressedUrl: string;
  name: string;
  compressionRatio: number;
};

// Function to format file size
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  else return (bytes / 1048576).toFixed(1) + ' MB';
};

const ImageCompressorTool = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState<CompressionResult[]>([]);
  const [quality, setQuality] = useState(80);
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files).filter(file => 
        file.type === 'image/jpeg' || 
        file.type === 'image/png' || 
        file.type === 'image/webp'
      );
      
      if (selectedFiles.length !== e.target.files.length) {
        toast({
          title: "Unsupported Files",
          description: "Only JPEG, PNG and WebP images are supported",
          variant: "destructive",
        });
      }
      
      setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
      
      // Clear input value so the same file can be selected again
      e.target.value = '';
    }
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files).filter(file => 
        file.type === 'image/jpeg' || 
        file.type === 'image/png' || 
        file.type === 'image/webp'
      );
      
      if (droppedFiles.length !== e.dataTransfer.files.length) {
        toast({
          title: "Unsupported Files",
          description: "Only JPEG, PNG and WebP images are supported",
          variant: "destructive",
        });
      }
      
      setFiles(prevFiles => [...prevFiles, ...droppedFiles]);
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  
  const removeFile = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };
  
  const compressImage = async (file: File, quality: number): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          
          const ctx = canvas.getContext('2d');
          if (!ctx) return reject(new Error('Could not get canvas context'));
          
          ctx.drawImage(img, 0, 0);
          
          // Get file extension
          const fileType = file.type;
          
          canvas.toBlob(
            (blob) => {
              if (!blob) return reject(new Error('Compression failed'));
              resolve(blob);
            },
            fileType,
            quality / 100
          );
        };
        
        img.onerror = () => {
          reject(new Error('Failed to load image'));
        };
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
    });
  };
  
  const handleCompression = async () => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select at least one image to compress",
        variant: "destructive",
      });
      return;
    }
    
    setIsCompressing(true);
    
    try {
      const newResults: CompressionResult[] = [];
      
      for (const file of files) {
        try {
          // Compress the image
          const compressedBlob = await compressImage(file, quality);
          
          // Create object URLs
          const originalUrl = URL.createObjectURL(file);
          const compressedUrl = URL.createObjectURL(compressedBlob);
          
          // Calculate compression ratio
          const originalSize = file.size;
          const compressedSize = compressedBlob.size;
          const compressionRatio = ((originalSize - compressedSize) / originalSize) * 100;
          
          newResults.push({
            originalSize,
            compressedSize,
            originalUrl,
            compressedUrl,
            name: file.name,
            compressionRatio,
          });
        } catch (err) {
          console.error(`Failed to compress ${file.name}:`, err);
          toast({
            title: `Failed to compress ${file.name}`,
            description: "Please try again or use a different image",
            variant: "destructive",
          });
        }
      }
      
      setResults(newResults);
      
      if (newResults.length > 0) {
        toast({
          title: "Compression Complete",
          description: `Successfully compressed ${newResults.length} ${newResults.length === 1 ? 'image' : 'images'}`,
          variant: "success",
        });
      }
    } catch (error) {
      console.error('Compression failed:', error);
      toast({
        title: "Compression Failed",
        description: "An error occurred while compressing the images",
        variant: "destructive",
      });
    } finally {
      setIsCompressing(false);
    }
  };
  
  const downloadCompressedImage = (result: CompressionResult) => {
    const link = document.createElement('a');
    link.href = result.compressedUrl;
    
    // Get file extension
    const extension = result.name.split('.').pop();
    const baseName = result.name.substring(0, result.name.lastIndexOf('.'));
    
    link.download = `${baseName}-compressed.${extension}`;
    link.click();
  };
  
  const downloadAllCompressedImages = () => {
    results.forEach(downloadCompressedImage);
  };
  
  return (
    <div className="container mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Image Compressor</CardTitle>
          <p className="text-sm text-muted-foreground">Compress images without losing quality</p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upload" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Upload & Settings</TabsTrigger>
              <TabsTrigger value="results" disabled={results.length === 0}>Results</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload" className="space-y-6">
              {/* File upload area */}
              <div 
                className={cn(
                  "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer",
                  "transition-all hover:border-primary/50",
                  files.length > 0 ? "border-primary/40 bg-primary/5" : "border-muted-foreground/30"
                )}
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="rounded-full bg-primary/10 p-4">
                    <Upload className="h-8 w-8 text-primary/80" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Drag images here or click to browse</p>
                    <p className="text-xs text-muted-foreground">Supports: JPG, PNG, WebP</p>
                  </div>
                </div>
                <Input 
                  ref={fileInputRef}
                  type="file" 
                  accept="image/jpeg,image/png,image/webp" 
                  multiple 
                  onChange={handleFileChange}
                  className="hidden" 
                />
              </div>
              
              {/* File list */}
              {files.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">Selected Images ({files.length})</h3>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setFiles([])}
                    >
                      Clear All
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {files.map((file, index) => (
                      <div 
                        key={`${file.name}-${index}`}
                        className="flex items-center justify-between rounded-md border p-2 text-sm"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="rounded bg-muted p-1">
                            <Image className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div className="flex flex-col">
                            <span className="truncate max-w-[200px] font-medium">{file.name}</span>
                            <span className="text-xs text-muted-foreground">{formatFileSize(file.size)}</span>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 w-7 p-0"
                          onClick={() => removeFile(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Compression settings */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Quality ({quality}%)</Label>
                    <span className="text-xs text-muted-foreground">
                      {quality < 50 ? 'Low' : quality < 75 ? 'Medium' : 'High'} Quality
                    </span>
                  </div>
                  <Slider 
                    value={[quality]} 
                    min={10} 
                    max={100} 
                    step={1}
                    onValueChange={(values) => setQuality(values[0])} 
                  />
                </div>
                
                <Button 
                  className="w-full" 
                  onClick={handleCompression}
                  disabled={files.length === 0 || isCompressing}
                >
                  {isCompressing ? "Compressing..." : "Compress Images"}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="results" className="space-y-6">
              {results.length > 0 && (
                <>
                  <div className="flex justify-end">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-2"
                      onClick={downloadAllCompressedImages}
                    >
                      <Download className="h-4 w-4" />
                      Download All
                    </Button>
                  </div>
                  
                  <div className="space-y-6">
                    {results.map((result, index) => (
                      <div key={index} className="rounded-lg border overflow-hidden">
                        <div className="p-4 bg-muted/20">
                          <div className="flex justify-between items-center">
                            <h3 className="font-medium truncate">{result.name}</h3>
                            <Badge variant="success">
                              {result.compressionRatio.toFixed(1)}% Reduced
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                          <div className="space-y-2">
                            <p className="text-xs font-medium">Original</p>
                            <div className="relative aspect-video bg-black/10 rounded-md overflow-hidden flex items-center justify-center">
                              <img 
                                src={result.originalUrl} 
                                alt="Original" 
                                className="max-w-full max-h-full object-contain"
                              />
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Size: {formatFileSize(result.originalSize)}
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <p className="text-xs font-medium">Compressed</p>
                            <div className="relative aspect-video bg-black/10 rounded-md overflow-hidden flex items-center justify-center">
                              <img 
                                src={result.compressedUrl} 
                                alt="Compressed" 
                                className="max-w-full max-h-full object-contain"
                              />
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Size: {formatFileSize(result.compressedSize)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 flex justify-end border-t">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex items-center gap-2"
                            onClick={() => downloadCompressedImage(result)}
                          >
                            <Download className="h-4 w-4" />
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImageCompressorTool;
