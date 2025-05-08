import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Search, Copy, ExternalLink } from 'lucide-react';
import ToolHeader from './ToolHeader';

const BacklinkCheckerTool: React.FC = () => {
  const { toast } = useToast();
  const [url, setUrl] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url) {
      toast({
        title: "URL Required",
        description: "Please enter a valid URL to check backlinks",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // In a real implementation, this would call an API to get backlink data
      // For demo purposes, we'll simulate a response after a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock data for demonstration
      const mockResults = [
        {
          sourceUrl: 'https://example.com/blog/post-1',
          targetUrl: url,
          anchorText: 'Learn more about this topic',
          pageAuthority: 45,
          domainAuthority: 58,
          firstDiscovered: '2023-01-15',
          lastSeen: '2023-06-22',
        },
        {
          sourceUrl: 'https://anotherdomain.org/resources',
          targetUrl: url,
          anchorText: 'Useful tool',
          pageAuthority: 38,
          domainAuthority: 62,
          firstDiscovered: '2023-02-28',
          lastSeen: '2023-06-20',
        },
        {
          sourceUrl: 'https://techblog.com/reviews/top-tools',
          targetUrl: url,
          anchorText: 'Check out this service',
          pageAuthority: 52,
          domainAuthority: 75,
          firstDiscovered: '2022-11-10',
          lastSeen: '2023-06-18',
        },
      ];
      
      setResults(mockResults);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch backlink data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Link copied",
      description: "The URL has been copied to your clipboard",
      variant: "default",
    });
  };

  return (
    <>
      <ToolHeader 
        title="Backlink Checker" 
        description="Analyze backlinks pointing to your website or a competitor's site."
      />

      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="url">Enter URL to check backlinks</Label>
                <div className="flex gap-2">
                  <Input
                    id="url"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={loading}>
                    {loading ? "Checking..." : "Check Backlinks"}
                    {!loading && <Search className="ml-2 h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </form>

            {loading && (
              <div className="my-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                <p className="mt-2 text-gray-600">Analyzing backlinks...</p>
              </div>
            )}

            {results.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Backlink Results</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Source URL</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Anchor Text</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Page Authority</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Domain Authority</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Last Seen</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((result, index) => (
                        <tr key={index} className="border-b border-gray-200">
                          <td className="px-4 py-3 text-sm">
                            <div className="truncate max-w-[200px]">{result.sourceUrl}</div>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <div className="truncate max-w-[150px]">{result.anchorText}</div>
                          </td>
                          <td className="px-4 py-3 text-sm">{result.pageAuthority}</td>
                          <td className="px-4 py-3 text-sm">{result.domainAuthority}</td>
                          <td className="px-4 py-3 text-sm">{result.lastSeen}</td>
                          <td className="px-4 py-3 text-sm">
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => copyToClipboard(result.sourceUrl)}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => window.open(result.sourceUrl, '_blank')}
                              >
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-6 text-sm text-gray-500">
                  <p>Note: This is a demonstration with simulated data. In a production environment, this would connect to a backlink analysis API.</p>
                </div>
              </div>
            )}
            
            {!loading && results.length === 0 && url && (
              <div className="my-8 text-center p-8 bg-gray-50 rounded-lg">
                <p className="text-gray-600">No backlink data available for the provided URL.</p>
                <p className="text-sm text-gray-500 mt-2">Try checking another URL or verify that the URL is correct.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default BacklinkCheckerTool;
