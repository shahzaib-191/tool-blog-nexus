
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const PDFToWordTool = () => {
  const [file, setFile] = useState<File | null>(null);
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file");
      return;
    }
    
    setConverting(true);
    
    // Simulate conversion
    setTimeout(() => {
      setConverting(false);
      toast({
        title: "Conversion complete!",
        description: "Your document has been generated and is ready to download.",
      });
      
      // In a real implementation, the file would be converted and downloaded
      const dummyLink = document.createElement('a');
      dummyLink.href = "#";
      dummyLink.download = "converted-document.docx";
      dummyLink.click();
      
      // Clear file after successful conversion
      setFile(null);
    }, 2000);
  };
  
  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-md hover:border-gray-400 transition-colors">
          <input 
            type="file" 
            onChange={handleFileChange}
            className="hidden" 
            id="file-upload" 
            accept=".pdf"
          />
          <label htmlFor="file-upload" className="cursor-pointer text-center">
            <div className="mb-4 p-4 bg-blue-50 text-tool-blue rounded-full mx-auto">
              <Upload size={32} />
            </div>
            <p className="text-lg font-medium">Drop your PDF file here</p>
            <p className="text-sm text-gray-500 mb-2">or click to browse</p>
            {file && <p className="text-sm font-medium text-blue-600">{file.name}</p>}
          </label>
        </div>
        
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={!file || converting}
        >
          {converting ? "Converting..." : "Convert to Word"}
        </Button>
      </form>
    </div>
  );
};

export default PDFToWordTool;
