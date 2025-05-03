
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Image, Upload } from 'lucide-react';

const ImageToPdfTool = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
      setError(null);
    }
  };
  
  const removeFile = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) {
      setError("Please select at least one image");
      return;
    }
    
    setConverting(true);
    
    // Simulate conversion
    setTimeout(() => {
      setConverting(false);
      alert("Conversion complete! In a real implementation, the PDF would download now.");
    }, 2000);
  };
  
  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-md hover:border-gray-400 transition-colors">
          <input 
            type="file" 
            onChange={handleFileChange}
            className="hidden" 
            id="file-upload" 
            accept="image/*"
            multiple
          />
          <label htmlFor="file-upload" className="cursor-pointer text-center">
            <div className="mb-4 p-4 bg-blue-50 text-tool-blue rounded-full mx-auto">
              <Upload size={32} />
            </div>
            <p className="text-lg font-medium">Drop your images here</p>
            <p className="text-sm text-gray-500 mb-2">or click to browse</p>
          </label>
        </div>
        
        {/* File list */}
        {files.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="font-medium">Selected images: {files.length}</p>
            <div className="max-h-48 overflow-y-auto">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md mb-2">
                  <div className="flex items-center">
                    <Image size={20} className="mr-2" />
                    <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                  </div>
                  <Button 
                    type="button"
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeFile(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={files.length === 0 || converting}
        >
          {converting ? "Converting..." : "Convert to PDF"}
        </Button>
      </form>
    </div>
  );
};

export default ImageToPdfTool;
