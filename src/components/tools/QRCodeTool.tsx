
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const QRCodeTool = () => {
  const [url, setUrl] = useState('');
  const [qrGenerated, setQrGenerated] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url) {
      setQrGenerated(true);
      toast({
        title: "QR Code generated",
        description: "Your QR code has been created successfully!",
      });
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
            <Button size="sm" onClick={() => {
              toast({
                title: "QR Code downloaded",
                description: "In a real implementation, the QR code would download now.",
              });
            }}>
              Download QR Code
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRCodeTool;
