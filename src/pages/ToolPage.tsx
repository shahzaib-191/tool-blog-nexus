
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import MainLayout from '@/components/Layout/MainLayout';
import { getToolById, Tool } from '@/services/toolsService';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

const PDFToWordTool = () => {
  const [file, setFile] = useState<File | null>(null);
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
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
      alert("Conversion complete! In a real implementation, the file would download now.");
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
              <LucideIcons.Upload size={32} />
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

const QRCodeTool = () => {
  const [url, setUrl] = useState('');
  const [qrGenerated, setQrGenerated] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url) {
      setQrGenerated(true);
    }
  };
  
  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="url" className="block text-sm font-medium mb-2">
            Website URL or Text
          </label>
          <input
            type="text"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={!url}
        >
          Generate QR Code
        </Button>
      </form>
      
      {qrGenerated && (
        <div className="mt-6 text-center">
          <div className="bg-white p-4 inline-block border rounded-md">
            <div className="w-64 h-64 mx-auto border bg-blue-50 flex items-center justify-center text-gray-500">
              QR Code would display here
            </div>
          </div>
          <div className="mt-4">
            <Button size="sm">Download QR Code</Button>
          </div>
        </div>
      )}
    </div>
  );
};

const WordCounterTool = () => {
  const [text, setText] = useState('');
  const wordCount = text ? text.trim().split(/\s+/).filter(Boolean).length : 0;
  const charCount = text.length;
  const sentenceCount = text ? text.split(/[.!?]+/).filter(Boolean).length : 0;
  const paragraphCount = text ? text.split(/\n+/).filter(Boolean).length : 0;
  
  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="text" className="block text-sm font-medium mb-2">
          Enter your text
        </label>
        <textarea
          id="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste your text here..."
          className="w-full p-3 border border-gray-300 rounded-md min-h-[200px]"
        />
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-tool-blue">{wordCount}</div>
            <div className="text-sm text-gray-500">Words</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-tool-blue">{charCount}</div>
            <div className="text-sm text-gray-500">Characters</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-tool-blue">{sentenceCount}</div>
            <div className="text-sm text-gray-500">Sentences</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-tool-blue">{paragraphCount}</div>
            <div className="text-sm text-gray-500">Paragraphs</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Map tool IDs to their component implementations
const toolComponents: Record<string, React.FC> = {
  'pdf-to-word': PDFToWordTool,
  'word-to-pdf': PDFToWordTool, // Reusing the same component
  'qr-generator': QRCodeTool,
  'word-counter': WordCounterTool
  // Add more tool implementations as needed
};

const ToolPage = () => {
  const { toolId } = useParams<{ toolId: string }>();
  const [tool, setTool] = useState<Tool | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTool = async () => {
      if (!toolId) return;
      
      try {
        setLoading(true);
        const toolData = await getToolById(toolId);
        if (toolData) {
          setTool(toolData);
        }
      } catch (error) {
        console.error('Error fetching tool:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTool();
  }, [toolId]);

  // Get the component for this tool
  const ToolComponent = toolId && toolComponents[toolId] 
    ? toolComponents[toolId] 
    : () => <div className="text-center py-8">Tool interface not implemented yet</div>;

  const IconComponent = tool?.icon 
    ? (LucideIcons as any)[tool.icon] || LucideIcons.Tool 
    : LucideIcons.Tool;

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/" className="text-gray-500 hover:text-gray-700 flex items-center gap-1">
            <ArrowLeft size={16} /> Back to Tools
          </Link>
        </div>

        {loading ? (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-14 w-14 rounded-full" />
              <div>
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-64 mt-2" />
              </div>
            </div>
            <Skeleton className="h-[300px] w-full rounded-md" />
          </div>
        ) : tool ? (
          <>
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-blue-50 text-tool-blue rounded-full">
                <IconComponent size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{tool.name}</h1>
                <p className="text-gray-600">{tool.description}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <ToolComponent />
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Tool Not Found</h2>
            <p className="text-gray-600 mb-6">
              Sorry, the tool you're looking for doesn't exist or may have been removed.
            </p>
            <Link to="/">
              <Button>Browse All Tools</Button>
            </Link>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ToolPage;
