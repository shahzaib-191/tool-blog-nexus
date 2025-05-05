
import { useState, useRef, ChangeEvent } from 'react';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Maximize, Upload, Download, Image, Info, Lock, Unlock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResizeResult {
  originalImage: string;
  resizedImage: string;
  originalWidth: number;
  originalHeight: number;
  newWidth: number;
  newHeight: number;
  originalSize: number;
  newSize: number;
  fileName: string;
}

// Helper function to format file size
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  else return (bytes / 1048576).toFixed(1) + ' MB';
};

const ImageResizerTool = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [resizeMode, setResizeMode] = useState<'dimensions' | 'percentage'>('dimensions');
  const [percentage, setPercentage] = useState(100);
  const [resizeResult, setResizeResult] = useState<ResizeResult | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Check if the file is an image
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file",
          variant: "destructive",
        });
        return;
      }
      
      // Set the selected file
      setSelectedFile(file);
      
      // Reset any previous resize result
      setResizeResult(null);
      
      // Create a preview URL
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      
      // Get the image dimensions when it loads
      const img = new Image();
      img.onload = () => {
        setOriginalDimensions({ width: img.width, height: img.height });
        setDimensions({ width: img.width, height: img.height });
      };
      img.src = objectUrl;
    }
  };
  
  const handleWidthChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newWidth = parseInt(e.target.value) || 0;
    
    if (maintainAspectRatio && originalDimensions.width > 0) {
      const aspectRatio = originalDimensions.width / originalDimensions.height;
      const newHeight = Math.round(newWidth / aspectRatio);
      setDimensions({ width: newWidth, height: newHeight });
    } else {
      setDimensions({ ...dimensions, width: newWidth });
    }
  };
  
  const handleHeightChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newHeight = parseInt(e.target.value) || 0;
    
    if (maintainAspectRatio && originalDimensions.height > 0) {
      const aspectRatio = originalDimensions.width / originalDimensions.height;
      const newWidth = Math.round(newHeight * aspectRatio);
      setDimensions({ width: newWidth, height: newHeight });
    } else {
      setDimensions({ ...dimensions, height: newHeight });
    }
  };
  
  const handlePercentageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newPercentage = parseInt(e.target.value) || 0;
    setPercentage(newPercentage);
    
    // Update dimensions based on percentage
    if (originalDimensions.width > 0 && originalDimensions.height > 0) {
      const newWidth = Math.round((originalDimensions.width * newPercentage) / 100);
      const newHeight = Math.round((originalDimensions.height * newPercentage) / 100);
      setDimensions({ width: newWidth, height: newHeight });
    }
  };
  
  const handleResize = async () => {
    if (!selectedFile || !previewUrl || dimensions.width <= 0 || dimensions.height <= 0) {
      toast({
        title: "Invalid parameters",
        description: "Please select an image and specify valid dimensions",
        variant: "destructive",
      });
      return;
    }
    
    setIsResizing(true);
    
    try {
      // Create a new image element to load the file
      const img = new Image();
      img.src = previewUrl;
      
      await new Promise((resolve) => {
        img.onload = resolve;
      });
      
      // Create a canvas with the desired dimensions
      const canvas = document.createElement('canvas');
      canvas.width = dimensions.width;
      canvas.height = dimensions.height;
      
      // Draw the image on the canvas
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error("Failed to get canvas context");
      
      ctx.drawImage(img, 0, 0, dimensions.width, dimensions.height);
      
      // Convert canvas to a Blob
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((result) => {
          if (result) {
            resolve(result);
          } else {
            reject(new Error("Failed to convert canvas to blob"));
          }
        }, selectedFile.type);
      });
      
      // Create object URL for the resized image
      const resizedImageUrl = URL.createObjectURL(blob);
      
      // Set the resize result
      setResizeResult({
        originalImage: previewUrl,
        resizedImage: resizedImageUrl,
        originalWidth: originalDimensions.width,
        originalHeight: originalDimensions.height,
        newWidth: dimensions.width,
        newHeight: dimensions.height,
        originalSize: selectedFile.size,
        newSize: blob.size,
        fileName: selectedFile.name,
      });
      
      toast({
        title: "Image Resized",
        description: `New dimensions: ${dimensions.width}x${dimensions.height} pixels`,
      });
    } catch (error) {
      console.error("Resize failed:", error);
      toast({
        title: "Resize Failed",
        description: "Failed to resize the image",
        variant: "destructive",
      });
    } finally {
      setIsResizing(false);
    }
  };
  
  const downloadResizedImage = () => {
    if (!resizeResult) return;
    
    const link = document.createElement('a');
    link.href = resizeResult.resizedImage;
    
    // Get the file extension
    const fileNameParts = resizeResult.fileName.split('.');
    const extension = fileNameParts.pop();
    const baseName = fileNameParts.join('.');
    
    link.download = `${baseName}-resized-${resizeResult.newWidth}x${resizeResult.newHeight}.${extension}`;
    link.click();
  };
  
  return (
    <div className="container mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Maximize className="h-5 w-5" />
            Image Resizer
          </CardTitle>
          <p className="text-sm text-muted-foreground">Resize images to exact dimensions</p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={resizeResult ? "result" : "upload"} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Upload & Resize</TabsTrigger>
              <TabsTrigger value="result" disabled={!resizeResult}>Result</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload" className="space-y-6">
              {/* Image Upload Area */}
              <div 
                className={cn(
                  "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer",
                  "transition-all hover:border-primary/50",
                  previewUrl ? "border-primary/40 bg-primary/5" : "border-muted-foreground/30"
                )}
                onClick={() => fileInputRef.current?.click()}
              >
                {previewUrl ? (
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="relative aspect-video w-full max-w-sm mx-auto">
                      <img 
                        ref={imgRef}
                        src={previewUrl} 
                        alt="Preview" 
                        className="max-h-48 mx-auto object-contain"
                      />
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">{selectedFile?.name}</p>
                      <p className="text-muted-foreground">
                        {originalDimensions.width} x {originalDimensions.height} px • {formatFileSize(selectedFile?.size || 0)}
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewUrl(null);
                        setSelectedFile(null);
                        setResizeResult(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                    >
                      Change Image
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="rounded-full bg-primary/10 p-4">
                      <Upload className="h-8 w-8 text-primary/80" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Click to upload an image</p>
                      <p className="text-xs text-muted-foreground">JPG, PNG, WebP, or GIF</p>
                    </div>
                  </div>
                )}
                
                <Input 
                  ref={fileInputRef}
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange}
                  className="hidden" 
                />
              </div>
              
              {/* Resize Controls */}
              {previewUrl && (
                <div className="space-y-6">
                  <RadioGroup 
                    value={resizeMode} 
                    onValueChange={(value) => setResizeMode(value as 'dimensions' | 'percentage')}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="dimensions" id="dimensions" />
                      <Label htmlFor="dimensions">Custom Dimensions</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="percentage" id="percentage" />
                      <Label htmlFor="percentage">Scale by Percentage</Label>
                    </div>
                  </RadioGroup>
                  
                  {resizeMode === 'dimensions' ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Maintain aspect ratio</Label>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setMaintainAspectRatio(!maintainAspectRatio)}
                            className="h-8 w-8"
                          >
                            {maintainAspectRatio ? (
                              <Lock className="h-4 w-4" />
                            ) : (
                              <Unlock className="h-4 w-4" />
                            )}
                          </Button>
                          <Checkbox 
                            checked={maintainAspectRatio}
                            onCheckedChange={(checked) => setMaintainAspectRatio(checked === true)}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="width">Width (px)</Label>
                          <Input 
                            id="width"
                            type="number"
                            value={dimensions.width || ''}
                            onChange={handleWidthChange}
                            min="1"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="height">Height (px)</Label>
                          <Input 
                            id="height"
                            type="number"
                            value={dimensions.height || ''}
                            onChange={handleHeightChange}
                            min="1"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Label htmlFor="percentage">Scale (%)</Label>
                      <Input 
                        id="percentage"
                        type="number"
                        value={percentage}
                        onChange={handlePercentageChange}
                        min="1"
                        max="200"
                      />
                      
                      <div className="text-sm text-muted-foreground">
                        New dimensions: {dimensions.width} x {dimensions.height} px
                      </div>
                    </div>
                  )}
                  
                  <Button 
                    className="w-full" 
                    onClick={handleResize}
                    disabled={isResizing || !selectedFile || dimensions.width <= 0 || dimensions.height <= 0}
                  >
                    {isResizing ? "Resizing..." : "Resize Image"}
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="result" className="space-y-6">
              {resizeResult && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="text-sm font-medium">Original Image</div>
                      <div className="border rounded-md overflow-hidden bg-black/5 aspect-video flex items-center justify-center">
                        <img 
                          src={resizeResult.originalImage} 
                          alt="Original" 
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {resizeResult.originalWidth} x {resizeResult.originalHeight} px • {formatFileSize(resizeResult.originalSize)}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="text-sm font-medium">Resized Image</div>
                      <div className="border rounded-md overflow-hidden bg-black/5 aspect-video flex items-center justify-center">
                        <img 
                          src={resizeResult.resizedImage} 
                          alt="Resized" 
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {resizeResult.newWidth} x {resizeResult.newHeight} px • {formatFileSize(resizeResult.newSize)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <Button onClick={downloadResizedImage} className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Download Resized Image
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

export default ImageResizerTool;
