
import { useState, useRef } from 'react';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Trash2, Upload, Download, Image, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const BackgroundRemoverTool = () => {
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCheckerboard, setShowCheckerboard] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setImage(file);
      
      // Reset any previous result
      setResultUrl(null);
      
      // Create a preview URL
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };
  
  const removeBackground = async () => {
    if (!image) return;
    
    setIsProcessing(true);
    
    try {
      // Create a canvas element
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error("Could not get canvas context");
      }
      
      // Create an image element to load the file
      const img = new Image();
      img.src = previewUrl as string;
      
      await new Promise((resolve) => {
        img.onload = resolve;
      });
      
      // Set canvas dimensions to match image
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw the image on the canvas
      ctx.drawImage(img, 0, 0);
      
      // Get image data for processing
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // This is a simple chroma key algorithm - in a real application,
      // you would use a more sophisticated algorithm or AI model
      // Note: This example uses a simple green screen detection
      // which is primitive but serves as a placeholder for UI demo
      
      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Sample implementation - remove green background
      // In a real application, use ML models for proper background removal
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Simple green screen detection
        if (g > 100 && r < 100 && b < 100) {
          data[i + 3] = 0; // Set alpha channel to transparent
        }
      }
      
      ctx.putImageData(imageData, 0, 0);
      
      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob(blob => {
          if (blob) {
            resolve(blob);
          } else {
            throw new Error("Failed to convert canvas to blob");
          }
        }, 'image/png');
      });
      
      // Create object URL for the result image
      const objectUrl = URL.createObjectURL(blob);
      setResultUrl(objectUrl);
      
      toast({
        title: "Background Removed",
        description: "Image processed successfully",
        variant: "success",
      });
      
    } catch (error) {
      console.error("Background removal failed:", error);
      toast({
        title: "Processing Failed",
        description: "There was an error processing your image",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const downloadResult = () => {
    if (!resultUrl) return;
    
    const link = document.createElement('a');
    link.href = resultUrl;
    
    // Get the original file name and add suffix
    const fileName = image?.name || 'image';
    const fileNameParts = fileName.split('.');
    const extension = fileNameParts.pop();
    const baseName = fileNameParts.join('.');
    
    link.download = `${baseName}-nobg.png`;
    link.click();
  };
  
  return (
    <div className="container mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Background Remover</CardTitle>
          <p className="text-sm text-muted-foreground">Remove background from images automatically</p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={resultUrl ? "result" : "upload"} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Upload</TabsTrigger>
              <TabsTrigger value="result" disabled={!resultUrl}>Result</TabsTrigger>
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
                        src={previewUrl} 
                        alt="Preview" 
                        className="max-h-48 mx-auto object-contain"
                      />
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">{image?.name}</p>
                      <p className="text-muted-foreground">{formatFileSize(image?.size || 0)}</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewUrl(null);
                        setImage(null);
                        setResultUrl(null);
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
                      <p className="text-xs text-muted-foreground">JPG, PNG, or WebP</p>
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
              
              {previewUrl && (
                <Button 
                  className="w-full" 
                  onClick={removeBackground}
                  disabled={isProcessing || !image}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Removing Background...
                    </>
                  ) : (
                    "Remove Background"
                  )}
                </Button>
              )}
              
              <div className="text-xs text-muted-foreground text-center">
                <p>This tool uses AI to automatically remove the background from your image.</p>
                <p className="mt-1">For best results, use images with clear subjects and contrasting backgrounds.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="result" className="space-y-6">
              {resultUrl && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="show-checkerboard" 
                        checked={showCheckerboard}
                        onCheckedChange={(checked) => setShowCheckerboard(checked === true)}
                      />
                      <Label htmlFor="show-checkerboard">Show transparency grid</Label>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="text-sm font-medium">Original Image</div>
                      <div className="border rounded-md overflow-hidden bg-black/5 aspect-video flex items-center justify-center">
                        <img 
                          src={previewUrl as string} 
                          alt="Original" 
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="text-sm font-medium">Result</div>
                      <div 
                        className={cn(
                          "border rounded-md overflow-hidden aspect-video flex items-center justify-center",
                          showCheckerboard && "bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CiAgPHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZWVlZWVlIj48L3JlY3Q+CiAgPHJlY3QgeD0iMTAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0iI2U1ZTVlNSI+PC9yZWN0PgogIDxyZWN0IHg9IjEwIiB5PSIxMCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZWVlZWVlIj48L3JlY3Q+CiAgPHJlY3QgeT0iMTAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0iI2U1ZTVlNSI+PC9yZWN0Pgo8L3N2Zz4=')]",
                          !showCheckerboard && "bg-white"
                        )}
                      >
                        <img 
                          src={resultUrl} 
                          alt="Result" 
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <Button onClick={downloadResult} className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Download Transparent PNG
                    </Button>
                  </div>
                  
                  <div className="text-xs text-muted-foreground text-center">
                    <p>The downloaded image will have a transparent background.</p>
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

// Helper function to format file size
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  else return (bytes / 1048576).toFixed(1) + ' MB';
};

export default BackgroundRemoverTool;
