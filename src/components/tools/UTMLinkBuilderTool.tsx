
import { useState } from 'react';
import ToolHeader from './ToolHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link2, Clipboard, Plus, X, Copy, ExternalLink } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

type UTMParam = {
  id: string;
  name: string;
  value: string;
};

const UTMLinkBuilderTool = () => {
  const { toast } = useToast();
  const [url, setUrl] = useState('');
  const [campaign, setCampaign] = useState('');
  const [source, setSource] = useState('');
  const [medium, setMedium] = useState('');
  const [additionalParams, setAdditionalParams] = useState<UTMParam[]>([]);
  const [generatedUrl, setGeneratedUrl] = useState('');
  
  // Predefined options for common UTM values
  const sourceSuggestions = ['google', 'facebook', 'twitter', 'linkedin', 'instagram', 'newsletter', 'email'];
  const mediumSuggestions = ['cpc', 'social', 'email', 'banner', 'affiliate', 'referral', 'organic'];
  
  const generateUniqueId = () => {
    return `param-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  };

  const addParam = () => {
    setAdditionalParams([...additionalParams, { 
      id: generateUniqueId(),
      name: '',
      value: ''
    }]);
  };

  const removeParam = (id: string) => {
    setAdditionalParams(additionalParams.filter(param => param.id !== id));
  };

  const updateParam = (id: string, field: 'name' | 'value', value: string) => {
    setAdditionalParams(additionalParams.map(param => 
      param.id === id ? { ...param, [field]: value } : param
    ));
  };

  const generateLink = () => {
    if (!url) {
      toast({
        title: "URL Required",
        description: "Please enter a destination URL",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Try to create a URL object to validate the URL format
      const parsedUrl = new URL(url.startsWith('http') ? url : `https://${url}`);
      
      // Start building the query parameters
      const params = new URLSearchParams();
      
      // Add required UTM parameters if they exist
      if (source) params.append('utm_source', source);
      if (medium) params.append('utm_medium', medium);
      if (campaign) params.append('utm_campaign', campaign);
      
      // Add additional parameters
      additionalParams.forEach(param => {
        if (param.name && param.value) {
          params.append(param.name.startsWith('utm_') ? param.name : `utm_${param.name}`, param.value);
        }
      });
      
      // Create the final URL
      const finalUrl = `${parsedUrl.origin}${parsedUrl.pathname}${parsedUrl.search ? parsedUrl.search + '&' : '?'}${params.toString()}${parsedUrl.hash}`;
      
      setGeneratedUrl(finalUrl);
      
      toast({
        title: "UTM Link Generated",
        description: "Your tracking link has been created successfully.",
      });
    } catch (error) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL (e.g., example.com or https://example.com)",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = () => {
    if (!generatedUrl) return;
    
    navigator.clipboard.writeText(generatedUrl);
    
    toast({
      title: "Copied to Clipboard",
      description: "UTM link has been copied to your clipboard.",
    });
  };

  const clearForm = () => {
    setUrl('');
    setCampaign('');
    setSource('');
    setMedium('');
    setAdditionalParams([]);
    setGeneratedUrl('');
    
    toast({
      title: "Form Cleared",
      description: "All fields have been reset.",
    });
  };

  return (
    <>
      <ToolHeader
        title="UTM Link Builder"
        description="Create UTM tracking links for your marketing campaigns to track and analyze traffic sources."
      />
      
      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardContent className="pt-6 space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="url">Destination URL</Label>
                  <Input
                    id="url"
                    placeholder="example.com or https://example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Enter the full URL of the landing page</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="source">Campaign Source</Label>
                    <div className="relative">
                      <Select value={source} onValueChange={setSource}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select or enter source" />
                        </SelectTrigger>
                        <SelectContent>
                          {sourceSuggestions.map(suggestion => (
                            <SelectItem key={suggestion} value={suggestion}>
                              {suggestion}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        id="source"
                        placeholder="Or enter custom source"
                        value={source}
                        onChange={(e) => setSource(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Which site is sending the traffic</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="medium">Campaign Medium</Label>
                    <div className="relative">
                      <Select value={medium} onValueChange={setMedium}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select or enter medium" />
                        </SelectTrigger>
                        <SelectContent>
                          {mediumSuggestions.map(suggestion => (
                            <SelectItem key={suggestion} value={suggestion}>
                              {suggestion}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        id="medium"
                        placeholder="Or enter custom medium"
                        value={medium}
                        onChange={(e) => setMedium(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Marketing medium (e.g., cpc, social, email)</p>
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="campaign">Campaign Name</Label>
                    <Input
                      id="campaign"
                      placeholder="summer_sale"
                      value={campaign}
                      onChange={(e) => setCampaign(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">The individual campaign name, slogan, or promotion code</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label>Additional Parameters (Optional)</Label>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={addParam}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Parameter
                    </Button>
                  </div>

                  {additionalParams.length > 0 && (
                    <div className="space-y-3">
                      {additionalParams.map((param) => (
                        <div key={param.id} className="flex gap-2 items-start">
                          <div className="flex-1">
                            <Input
                              placeholder="Parameter name (e.g., content)"
                              value={param.name}
                              onChange={(e) => updateParam(param.id, 'name', e.target.value)}
                            />
                          </div>
                          <div className="flex-1">
                            <Input
                              placeholder="Parameter value"
                              value={param.value}
                              onChange={(e) => updateParam(param.id, 'value', e.target.value)}
                            />
                          </div>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon"
                            onClick={() => removeParam(param.id)}
                            className="flex-shrink-0"
                          >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Remove</span>
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="pt-4 flex gap-3">
                    <Button onClick={generateLink}>
                      <Link2 className="h-4 w-4 mr-2" />
                      Generate UTM Link
                    </Button>
                    <Button variant="outline" onClick={clearForm}>
                      Clear Form
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Generated UTM Link</h3>
                    
                    {generatedUrl ? (
                      <div className="space-y-3">
                        <div className="p-4 bg-muted rounded-md overflow-x-auto">
                          <code className="text-sm break-all whitespace-pre-wrap">{generatedUrl}</code>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button onClick={copyToClipboard} variant="outline" className="flex-1">
                            <Copy className="h-4 w-4 mr-2" />
                            Copy to Clipboard
                          </Button>
                          
                          <Button
                            as="a"
                            href={generatedUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="outline"
                            className="flex-1"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Test Link
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="border border-dashed rounded-md p-6 text-center">
                        <Clipboard className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">Fill out the form and click "Generate UTM Link" to create your tracking URL</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-md">
                    <h4 className="font-medium text-blue-800 mb-2">UTM Parameter Guide:</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li><span className="font-semibold">utm_source</span>: The referrer (e.g., google, newsletter)</li>
                      <li><span className="font-semibold">utm_medium</span>: Marketing medium (e.g., cpc, email)</li>
                      <li><span className="font-semibold">utm_campaign</span>: Product, promo code, or slogan</li>
                      <li><span className="font-semibold">utm_term</span>: Identify paid search keywords</li>
                      <li><span className="font-semibold">utm_content</span>: Use to differentiate ads or links</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Best Practices:</h4>
                    <ul className="list-disc list-outside ml-5 text-sm space-y-1">
                      <li>Use lowercase letters for consistency in analytics</li>
                      <li>Use underscores or hyphens instead of spaces</li>
                      <li>Be consistent with your naming conventions</li>
                      <li>Use descriptive but concise parameter values</li>
                      <li>Document your UTM strategy for team alignment</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default UTMLinkBuilderTool;
