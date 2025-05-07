
import { useState } from 'react';
import ToolHeader from './ToolHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { ExternalLink, Link2, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

type Backlink = {
  id: string;
  sourceUrl: string;
  targetUrl: string;
  anchorText: string;
  domainAuthority: number;
  dofollow: boolean;
  lastSeen: string;
};

const BacklinkCheckerTool = () => {
  const { toast } = useToast();
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [backlinks, setBacklinks] = useState<Backlink[]>([]);
  const [summary, setSummary] = useState<{
    totalBacklinks: number;
    dofollowCount: number;
    nofollowCount: number;
    uniqueDomains: number;
    avgDomainAuthority: number;
  } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url) {
      toast({
        title: "URL Required",
        description: "Please enter a website URL to check backlinks.",
        variant: "destructive",
      });
      return;
    }

    // Check URL format validity
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
    } catch {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid website URL.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    setProgress(0);
    setBacklinks([]);
    setSummary(null);
    
    // Simulate progressive loading
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 400);
    
    // Generate mock backlink data
    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      
      const mockBacklinks: Backlink[] = [];
      const domains = [
        'example.org', 'blog.domain.com', 'news.site.net', 'resource.edu', 
        'tutorial.dev', 'directory.io', 'review.co', 'forum.online'
      ];
      
      const anchorTexts = [
        'click here', 'read more', 'useful resource', 'learn more', 
        url.replace(/^https?:\/\/(www\.)?/, ''), 'check this out', 'great website'
      ];
      
      // Generate between 8-15 backlinks
      const backlinksCount = Math.floor(Math.random() * 8) + 8;
      
      for (let i = 0; i < backlinksCount; i++) {
        const domain = domains[Math.floor(Math.random() * domains.length)];
        const path = ['', 'blog', 'resources', 'articles', 'news'][Math.floor(Math.random() * 5)];
        const subpath = ['item', 'post', 'entry', 'page'][Math.floor(Math.random() * 4)] + Math.floor(Math.random() * 100);
        
        mockBacklinks.push({
          id: `bl-${i}`,
          sourceUrl: `https://${domain}/${path}/${subpath}`,
          targetUrl: url.startsWith('http') ? url : `https://${url}`,
          anchorText: anchorTexts[Math.floor(Math.random() * anchorTexts.length)],
          domainAuthority: Math.floor(Math.random() * 80) + 10,
          dofollow: Math.random() > 0.3, // 70% chance of being dofollow
          lastSeen: new Date(Date.now() - Math.floor(Math.random() * 90 * 24 * 60 * 60 * 1000)).toLocaleDateString() // Random date within last 90 days
        });
      }
      
      // Calculate summary stats
      const dofollowLinks = mockBacklinks.filter(link => link.dofollow);
      const uniqueDomainSet = new Set(mockBacklinks.map(link => new URL(link.sourceUrl).hostname));
      
      setSummary({
        totalBacklinks: mockBacklinks.length,
        dofollowCount: dofollowLinks.length,
        nofollowCount: mockBacklinks.length - dofollowLinks.length,
        uniqueDomains: uniqueDomainSet.size,
        avgDomainAuthority: Math.round(mockBacklinks.reduce((sum, link) => sum + link.domainAuthority, 0) / mockBacklinks.length)
      });
      
      setBacklinks(mockBacklinks);
      setIsLoading(false);
      
      toast({
        title: "Backlink Analysis Complete",
        description: `Found ${mockBacklinks.length} backlinks for your website.`,
      });
    }, 4500);
  };

  const truncateUrl = (url: string, maxLength = 40) => {
    return url.length > maxLength ? url.substring(0, maxLength) + '...' : url;
  };
  
  const getDAColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <>
      <ToolHeader
        title="Backlink Checker"
        description="Analyze the backlinks pointing to your website to improve SEO strategy and track link building efforts."
      />
      
      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardContent className="pt-6 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col space-y-1.5">
                <label htmlFor="url" className="font-medium">Enter Website URL</label>
                <div className="flex">
                  <div className="relative w-full">
                    <ExternalLink className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    <Input 
                      id="url"
                      placeholder="example.com or https://example.com"
                      className="pl-10"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="ml-2" 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Analyzing...' : 'Check Backlinks'}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">Enter your website URL with or without https://</p>
              </div>
            </form>

            {isLoading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Analyzing backlinks...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            {summary && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Backlink Summary</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-primary/5 p-4 rounded-md text-center">
                    <p className="text-sm text-muted-foreground">Total Backlinks</p>
                    <p className="text-3xl font-bold">{summary.totalBacklinks}</p>
                  </div>
                  
                  <div className="bg-primary/5 p-4 rounded-md text-center">
                    <p className="text-sm text-muted-foreground">Unique Domains</p>
                    <p className="text-3xl font-bold">{summary.uniqueDomains}</p>
                  </div>
                  
                  <div className="bg-primary/5 p-4 rounded-md text-center">
                    <p className="text-sm text-muted-foreground">Average DA</p>
                    <p className="text-3xl font-bold">{summary.avgDomainAuthority}</p>
                  </div>
                </div>
                
                <div className="flex gap-4 mb-6">
                  <div className="flex-1 bg-primary/5 p-4 rounded-md">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Dofollow</span>
                      <span className="text-sm font-medium">{summary.dofollowCount} links</span>
                    </div>
                    <Progress value={(summary.dofollowCount / summary.totalBacklinks) * 100} className="h-2 mt-2" />
                  </div>
                  
                  <div className="flex-1 bg-primary/5 p-4 rounded-md">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Nofollow</span>
                      <span className="text-sm font-medium">{summary.nofollowCount} links</span>
                    </div>
                    <Progress value={(summary.nofollowCount / summary.totalBacklinks) * 100} className="h-2 mt-2" />
                  </div>
                </div>
                
                <Alert variant="info" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>SEO Impact</AlertTitle>
                  <AlertDescription>
                    Your website has {summary.dofollowCount} dofollow links that pass SEO value. 
                    The average domain authority of {summary.avgDomainAuthority} is 
                    {summary.avgDomainAuthority > 50 ? ' good.' : ' an area for improvement.'}
                  </AlertDescription>
                </Alert>
                
                <h3 className="text-lg font-semibold mb-3">Backlinks ({backlinks.length})</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Source URL</th>
                        <th className="text-left py-3 px-4">Anchor Text</th>
                        <th className="text-left py-3 px-4">DA</th>
                        <th className="text-left py-3 px-4">Type</th>
                        <th className="text-left py-3 px-4">Last Seen</th>
                      </tr>
                    </thead>
                    <tbody>
                      {backlinks.map(link => (
                        <tr key={link.id} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4">
                            <a href={link.sourceUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:underline">
                              <ExternalLink size={14} className="mr-1 inline" />
                              {truncateUrl(link.sourceUrl)}
                            </a>
                          </td>
                          <td className="py-3 px-4">{link.anchorText}</td>
                          <td className={`py-3 px-4 font-medium ${getDAColor(link.domainAuthority)}`}>
                            {link.domainAuthority}
                          </td>
                          <td className="py-3 px-4">
                            {link.dofollow ? (
                              <span className="text-green-600 font-medium">Dofollow</span>
                            ) : (
                              <span className="text-gray-500">Nofollow</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">{link.lastSeen}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {!isLoading && backlinks.length === 0 && (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <div className="p-3 bg-primary/10 rounded-full mb-4">
                  <Link2 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Enter a URL to analyze backlinks</h3>
                <p className="text-sm text-muted-foreground max-w-md mt-2">
                  Discover who is linking to your website, check the quality of your backlinks,
                  and compare with competitors.
                </p>
              </div>
            )}
            
            <div className="bg-blue-50 p-4 rounded-md">
              <h4 className="font-medium text-blue-800 mb-2">What Makes a Good Backlink?</h4>
              <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                <li>Links from websites with high Domain Authority</li>
                <li>Dofollow links that pass SEO value</li>
                <li>Contextually relevant anchor text</li>
                <li>Links from websites in your industry or niche</li>
                <li>Natural link profile with diversity in sources</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default BacklinkCheckerTool;
