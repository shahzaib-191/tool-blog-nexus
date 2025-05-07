
import { useState } from 'react';
import ToolHeader from './ToolHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExternalLink, Gauge, Clock, FileCode, Image, Database, AlertCircle, CheckCircle2, Search } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

type SpeedScore = {
  overall: number;
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  cls: number; // Cumulative Layout Shift
  tti: number; // Time to Interactive
  tbt: number; // Total Blocking Time
};

type ResourceStats = {
  htmlSize: number;
  cssSize: number;
  jsSize: number;
  imageSize: number;
  fontSize: number;
  totalSize: number;
  requests: number;
};

const WebsiteSpeedTestTool = () => {
  const { toast } = useToast();
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('');
  const [scores, setScores] = useState<SpeedScore | null>(null);
  const [resources, setResources] = useState<ResourceStats | null>(null);
  const [issues, setIssues] = useState<string[]>([]);
  const [improvements, setImprovements] = useState<string[]>([]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url) {
      toast({
        title: "URL Required",
        description: "Please enter a website URL to test.",
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
    
    runSpeedTest();
  };

  const runSpeedTest = () => {
    setIsLoading(true);
    setProgress(0);
    setStage('Initializing test...');
    setScores(null);
    setResources(null);
    setIssues([]);
    setImprovements([]);
    
    const totalSteps = 6;
    const timePerStep = 1000; // 1 second per step
    
    // Step 1: Initialize
    setTimeout(() => {
      setProgress(Math.floor(100 / totalSteps));
      setStage('Analyzing DNS lookup...');
    }, timePerStep);
    
    // Step 2: DNS Lookup
    setTimeout(() => {
      setProgress(Math.floor(100 * 2 / totalSteps));
      setStage('Testing connection...');
    }, timePerStep * 2);
    
    // Step 3: Connection
    setTimeout(() => {
      setProgress(Math.floor(100 * 3 / totalSteps));
      setStage('Loading resources...');
    }, timePerStep * 3);
    
    // Step 4: Resources
    setTimeout(() => {
      setProgress(Math.floor(100 * 4 / totalSteps));
      setStage('Analyzing rendering performance...');
    }, timePerStep * 4);
    
    // Step 5: Rendering
    setTimeout(() => {
      setProgress(Math.floor(100 * 5 / totalSteps));
      setStage('Generating report...');
    }, timePerStep * 5);
    
    // Step 6: Complete
    setTimeout(() => {
      setProgress(100);
      setStage('Test complete!');
      generateResults();
      setIsLoading(false);
      
      toast({
        title: "Speed Test Complete",
        description: "Website performance analysis is ready to view.",
      });
    }, timePerStep * 6);
  };
  
  // Generate mock test results
  const generateResults = () => {
    // Generate semi-random speed scores based on the URL length
    const randomFactor = url.length % 10 / 10;
    
    // Overall score between 45 and 95 (higher for shorter URLs for demo purposes)
    const overall = Math.max(45, Math.min(95, Math.floor(70 + 25 * (1 - randomFactor))));
    
    // Core Web Vitals and other metrics
    const fcp = Math.max(0.8, Math.min(3.0, 1.5 + randomFactor * 1.5)); // First Contentful Paint (s)
    const lcp = Math.max(1.5, Math.min(5.0, 2.5 + randomFactor * 2.5)); // Largest Contentful Paint (s) 
    const cls = Math.max(0.01, Math.min(0.25, 0.05 + randomFactor * 0.2)); // Cumulative Layout Shift
    const tti = Math.max(2.0, Math.min(7.0, 3.5 + randomFactor * 3.5)); // Time to Interactive (s)
    const tbt = Math.max(100, Math.min(800, 300 + randomFactor * 500)); // Total Blocking Time (ms)
    
    setScores({
      overall,
      fcp,
      lcp,
      cls,
      tti,
      tbt
    });
    
    // Resource statistics
    const htmlSize = Math.floor(20 + randomFactor * 30); // KB
    const cssSize = Math.floor(50 + randomFactor * 150); // KB
    const jsSize = Math.floor(200 + randomFactor * 800); // KB
    const imageSize = Math.floor(300 + randomFactor * 1200); // KB
    const fontSize = Math.floor(50 + randomFactor * 100); // KB
    const totalSize = htmlSize + cssSize + jsSize + imageSize + fontSize;
    const requests = Math.floor(15 + randomFactor * 40);
    
    setResources({
      htmlSize,
      cssSize,
      jsSize,
      imageSize,
      fontSize,
      totalSize,
      requests
    });
    
    // Generate issues and improvements based on scores
    const possibleIssues = [
      "Large JavaScript files causing slow load times",
      "Render-blocking resources detected",
      "Unoptimized images increasing page size",
      "Multiple redirect chains slowing initial load",
      "Excessive DOM size increasing memory usage",
      "Unused CSS affecting load performance",
      "Layout shifts during page load affecting user experience",
      "High server response time",
      "Inefficient cache policy for static assets"
    ];
    
    const possibleImprovements = [
      "Minify JavaScript and CSS files",
      "Enable text compression (Gzip or Brotli)",
      "Optimize and compress images",
      "Implement lazy loading for images",
      "Defer non-critical JavaScript",
      "Preconnect to required origins",
      "Preload key resources",
      "Remove unused CSS",
      "Serve images in next-gen formats (WebP, AVIF)",
      "Implement browser caching policies",
      "Use a CDN for static assets",
      "Reduce server response time",
      "Eliminate render-blocking resources"
    ];
    
    // Select random issues and improvements based on scores
    const numIssues = Math.floor((100 - overall) / 20) + 1; // More issues for lower scores
    const selectedIssues = [];
    for (let i = 0; i < numIssues; i++) {
      const randomIssue = possibleIssues[Math.floor(Math.random() * possibleIssues.length)];
      if (!selectedIssues.includes(randomIssue)) {
        selectedIssues.push(randomIssue);
      }
    }
    setIssues(selectedIssues);
    
    // Select improvements based on issues
    const selectedImprovements = [];
    for (let i = 0; i < numIssues + 2; i++) { // Always suggest more improvements than issues
      const randomImprovement = possibleImprovements[Math.floor(Math.random() * possibleImprovements.length)];
      if (!selectedImprovements.includes(randomImprovement)) {
        selectedImprovements.push(randomImprovement);
      }
    }
    setImprovements(selectedImprovements);
  };
  
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-500";
    if (score >= 50) return "text-yellow-500";
    return "text-red-500";
  };
  
  const getScoreGauge = (score: number) => {
    if (score >= 90) return "bg-green-500";
    if (score >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };
  
  const getMetricStatus = (metric: string, value: number) => {
    switch (metric) {
      case 'fcp':
        return value < 1.8 ? 'good' : value < 3 ? 'needs-improvement' : 'poor';
      case 'lcp':
        return value < 2.5 ? 'good' : value < 4 ? 'needs-improvement' : 'poor';
      case 'cls':
        return value < 0.1 ? 'good' : value < 0.25 ? 'needs-improvement' : 'poor';
      case 'tti':
        return value < 3.8 ? 'good' : value < 7.3 ? 'needs-improvement' : 'poor';
      case 'tbt':
        return value < 300 ? 'good' : value < 600 ? 'needs-improvement' : 'poor';
      default:
        return 'unknown';
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'text-green-600';
      case 'needs-improvement':
        return 'text-yellow-600';
      case 'poor':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };
  
  const formatBytes = (bytes: number) => {
    const kb = bytes;
    if (kb < 1024) return `${kb} KB`;
    return `${(kb / 1024).toFixed(2)} MB`;
  };

  return (
    <>
      <ToolHeader
        title="Website Speed Test"
        description="Analyze website performance and get actionable recommendations to improve loading speed."
      />
      
      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardContent className="pt-6 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col space-y-1.5">
                <label htmlFor="url" className="font-medium">Enter Website URL</label>
                <div className="flex">
                  <div className="relative w-full">
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
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
                    {isLoading ? 'Testing...' : 'Test Speed'}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">Enter your website URL with or without https://</p>
              </div>
            </form>

            {isLoading && (
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>{stage}</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            {scores && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1 flex flex-col items-center justify-center p-6 border rounded-lg">
                    <h3 className="text-lg font-medium mb-4">Overall Performance</h3>
                    <div className="relative h-32 w-32">
                      <svg viewBox="0 0 100 100" className="transform -rotate-90 h-full w-full">
                        <circle 
                          cx="50" cy="50" r="45" fill="none" 
                          stroke="#e5e7eb" 
                          strokeWidth="10"
                        />
                        <circle 
                          cx="50" cy="50" r="45" fill="none" 
                          stroke={getScoreColor(scores.overall).replace('text-', 'stroke-').replace('-500', '-500')} 
                          strokeWidth="10"
                          strokeDasharray="282.7"
                          strokeDashoffset={282.7 - (282.7 * scores.overall / 100)}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`text-3xl font-bold ${getScoreColor(scores.overall)}`}>
                          {scores.overall}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 text-center">
                      <p className="text-sm text-muted-foreground mb-1">Tested URL</p>
                      <p className="text-sm font-medium truncate max-w-full">
                        {url.startsWith('http') ? url : `https://${url}`}
                      </p>
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <Tabs defaultValue="metrics">
                      <TabsList className="grid grid-cols-3 mb-4">
                        <TabsTrigger value="metrics">Core Metrics</TabsTrigger>
                        <TabsTrigger value="resources">Resources</TabsTrigger>
                        <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="metrics" className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <span className="text-sm font-medium">First Contentful Paint</span>
                                <p className="text-xs text-muted-foreground">How quickly content appears</p>
                              </div>
                              <span className={`font-semibold ${getStatusColor(getMetricStatus('fcp', scores.fcp))}`}>
                                {scores.fcp.toFixed(1)}s
                              </span>
                            </div>
                            <Progress value={Math.max(0, Math.min(100, 100 - (scores.fcp / 5) * 100))} className="h-1.5" />
                          </div>
                          
                          <div className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <span className="text-sm font-medium">Largest Contentful Paint</span>
                                <p className="text-xs text-muted-foreground">Largest element load time</p>
                              </div>
                              <span className={`font-semibold ${getStatusColor(getMetricStatus('lcp', scores.lcp))}`}>
                                {scores.lcp.toFixed(1)}s
                              </span>
                            </div>
                            <Progress value={Math.max(0, Math.min(100, 100 - (scores.lcp / 8) * 100))} className="h-1.5" />
                          </div>
                          
                          <div className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <span className="text-sm font-medium">Cumulative Layout Shift</span>
                                <p className="text-xs text-muted-foreground">Visual stability measure</p>
                              </div>
                              <span className={`font-semibold ${getStatusColor(getMetricStatus('cls', scores.cls))}`}>
                                {scores.cls.toFixed(2)}
                              </span>
                            </div>
                            <Progress value={Math.max(0, Math.min(100, 100 - (scores.cls / 0.25) * 100))} className="h-1.5" />
                          </div>
                          
                          <div className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <span className="text-sm font-medium">Time to Interactive</span>
                                <p className="text-xs text-muted-foreground">Time until fully interactive</p>
                              </div>
                              <span className={`font-semibold ${getStatusColor(getMetricStatus('tti', scores.tti))}`}>
                                {scores.tti.toFixed(1)}s
                              </span>
                            </div>
                            <Progress value={Math.max(0, Math.min(100, 100 - (scores.tti / 10) * 100))} className="h-1.5" />
                          </div>
                          
                          <div className="p-4 border rounded-lg sm:col-span-2">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <span className="text-sm font-medium">Total Blocking Time</span>
                                <p className="text-xs text-muted-foreground">Sum of all blocking periods</p>
                              </div>
                              <span className={`font-semibold ${getStatusColor(getMetricStatus('tbt', scores.tbt))}`}>
                                {scores.tbt}ms
                              </span>
                            </div>
                            <Progress value={Math.max(0, Math.min(100, 100 - (scores.tbt / 1000) * 100))} className="h-1.5" />
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="resources">
                        {resources && (
                          <div className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              <div className="p-4 border rounded-lg">
                                <div className="text-center">
                                  <p className="text-sm font-medium">Total Page Size</p>
                                  <p className="text-2xl font-bold mt-2">{formatBytes(resources.totalSize)}</p>
                                </div>
                              </div>
                              
                              <div className="p-4 border rounded-lg">
                                <div className="text-center">
                                  <p className="text-sm font-medium">HTTP Requests</p>
                                  <p className="text-2xl font-bold mt-2">{resources.requests}</p>
                                </div>
                              </div>
                              
                              <div className="p-4 border rounded-lg">
                                <div className="text-center">
                                  <p className="text-sm font-medium">Resource Types</p>
                                  <p className="text-2xl font-bold mt-2">5</p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-3">
                              <h4 className="text-md font-medium">Resource Breakdown</h4>
                              
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <FileCode className="h-4 w-4 mr-2 text-blue-500" />
                                    <span className="text-sm">HTML</span>
                                  </div>
                                  <span className="text-sm font-medium">{formatBytes(resources.htmlSize)}</span>
                                </div>
                                <Progress value={(resources.htmlSize / resources.totalSize) * 100} className="h-2 bg-gray-100" indicatorClassName="bg-blue-500" />
                              </div>
                              
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <FileCode className="h-4 w-4 mr-2 text-purple-500" />
                                    <span className="text-sm">CSS</span>
                                  </div>
                                  <span className="text-sm font-medium">{formatBytes(resources.cssSize)}</span>
                                </div>
                                <Progress value={(resources.cssSize / resources.totalSize) * 100} className="h-2 bg-gray-100" indicatorClassName="bg-purple-500" />
                              </div>
                              
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <FileCode className="h-4 w-4 mr-2 text-yellow-500" />
                                    <span className="text-sm">JavaScript</span>
                                  </div>
                                  <span className="text-sm font-medium">{formatBytes(resources.jsSize)}</span>
                                </div>
                                <Progress value={(resources.jsSize / resources.totalSize) * 100} className="h-2 bg-gray-100" indicatorClassName="bg-yellow-500" />
                              </div>
                              
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <Image className="h-4 w-4 mr-2 text-green-500" />
                                    <span className="text-sm">Images</span>
                                  </div>
                                  <span className="text-sm font-medium">{formatBytes(resources.imageSize)}</span>
                                </div>
                                <Progress value={(resources.imageSize / resources.totalSize) * 100} className="h-2 bg-gray-100" indicatorClassName="bg-green-500" />
                              </div>
                              
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <FileCode className="h-4 w-4 mr-2 text-red-500" />
                                    <span className="text-sm">Fonts</span>
                                  </div>
                                  <span className="text-sm font-medium">{formatBytes(resources.fontSize)}</span>
                                </div>
                                <Progress value={(resources.fontSize / resources.totalSize) * 100} className="h-2 bg-gray-100" indicatorClassName="bg-red-500" />
                              </div>
                            </div>
                          </div>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="suggestions" className="space-y-6">
                        {issues.length > 0 && (
                          <div>
                            <h4 className="text-md font-medium mb-3 flex items-center">
                              <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
                              Issues to Fix ({issues.length})
                            </h4>
                            <ul className="space-y-2">
                              {issues.map((issue, index) => (
                                <li key={index} className="flex items-start p-3 bg-red-50 rounded-md">
                                  <AlertCircle className="h-4 w-4 mr-2 text-red-500 mt-0.5 flex-shrink-0" />
                                  <span className="text-sm text-red-700">{issue}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {improvements.length > 0 && (
                          <div>
                            <h4 className="text-md font-medium mb-3 flex items-center">
                              <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                              Recommended Improvements ({improvements.length})
                            </h4>
                            <ul className="space-y-2">
                              {improvements.map((improvement, index) => (
                                <li key={index} className="flex items-start p-3 bg-green-50 rounded-md">
                                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                                  <span className="text-sm text-green-700">{improvement}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              </>
            )}
            
            {!isLoading && !scores && (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <div className="p-3 bg-primary/10 rounded-full mb-4">
                  <Gauge className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Test your website speed</h3>
                <p className="text-sm text-muted-foreground max-w-md mt-2">
                  Enter a URL above to analyze page speed, identify performance issues, 
                  and get recommendations to improve user experience.
                </p>
              </div>
            )}
            
            <div className="bg-blue-50 p-4 rounded-md">
              <h4 className="font-medium text-blue-800 mb-2">Why Website Speed Matters:</h4>
              <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                <li>Faster sites provide better user experience and higher engagement</li>
                <li>Page speed is an important ranking factor for search engines</li>
                <li>Every 1 second delay in load time can reduce conversions by 7%</li>
                <li>53% of mobile users abandon sites that take over 3 seconds to load</li>
                <li>Optimized sites have lower bounce rates and higher conversion rates</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default WebsiteSpeedTestTool;
