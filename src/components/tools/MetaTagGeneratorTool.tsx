
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Copy, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const MetaTagGeneratorTool = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    keywords: '',
    author: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    twitterTitle: '',
    twitterDescription: '',
    twitterImage: '',
    robots: 'index, follow',
  });
  
  const [generatedCode, setGeneratedCode] = useState('');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Auto-fill social fields if they're empty
    if (name === 'title' && !formData.ogTitle && !formData.twitterTitle) {
      setFormData(prev => ({ ...prev, ogTitle: value, twitterTitle: value }));
    }
    if (name === 'description' && !formData.ogDescription && !formData.twitterDescription) {
      setFormData(prev => ({ ...prev, ogDescription: value, twitterDescription: value }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generateMetaTags = () => {
    let metaTags = `<!-- Primary Meta Tags -->\n`;
    metaTags += formData.title ? `<title>${formData.title}</title>\n` : '';
    metaTags += formData.description ? `<meta name="description" content="${formData.description}" />\n` : '';
    metaTags += formData.keywords ? `<meta name="keywords" content="${formData.keywords}" />\n` : '';
    metaTags += formData.author ? `<meta name="author" content="${formData.author}" />\n` : '';
    metaTags += `<meta name="robots" content="${formData.robots}" />\n`;
    
    // Open Graph / Facebook
    if (formData.ogTitle || formData.ogDescription || formData.ogImage) {
      metaTags += `\n<!-- Open Graph / Facebook -->\n`;
      metaTags += `<meta property="og:type" content="${formData.ogType}" />\n`;
      metaTags += formData.ogTitle ? `<meta property="og:title" content="${formData.ogTitle}" />\n` : '';
      metaTags += formData.ogDescription ? `<meta property="og:description" content="${formData.ogDescription}" />\n` : '';
      metaTags += formData.ogImage ? `<meta property="og:image" content="${formData.ogImage}" />\n` : '';
      metaTags += `<meta property="og:url" content="[YOUR PAGE URL]" />\n`;
    }
    
    // Twitter
    if (formData.twitterTitle || formData.twitterDescription || formData.twitterImage) {
      metaTags += `\n<!-- Twitter -->\n`;
      metaTags += `<meta property="twitter:card" content="${formData.twitterCard}" />\n`;
      metaTags += formData.twitterTitle ? `<meta property="twitter:title" content="${formData.twitterTitle}" />\n` : '';
      metaTags += formData.twitterDescription ? `<meta property="twitter:description" content="${formData.twitterDescription}" />\n` : '';
      metaTags += formData.twitterImage ? `<meta property="twitter:image" content="${formData.twitterImage}" />\n` : '';
      metaTags += `<meta property="twitter:url" content="[YOUR PAGE URL]" />\n`;
    }
    
    setGeneratedCode(metaTags);
    
    toast({
      title: "Meta tags generated",
      description: "Your meta tags have been generated successfully."
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    
    toast({
      title: "Copied to clipboard",
      description: "Meta tags have been copied to your clipboard."
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold">Meta Tag Generator</h2>
        <p className="text-gray-600 mt-2">
          Create optimized meta tags for better SEO and social media sharing
        </p>
      </div>
      
      <Tabs defaultValue="basic">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="basic">Basic SEO</TabsTrigger>
          <TabsTrigger value="opengraph">Open Graph</TabsTrigger>
          <TabsTrigger value="twitter">Twitter Cards</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="space-y-4 mt-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Page Title (55-60 characters recommended)"
                maxLength={60}
              />
              <p className="text-xs text-gray-500 mt-1">{formData.title.length}/60 characters</p>
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Page description (150-160 characters recommended)"
                maxLength={160}
              />
              <p className="text-xs text-gray-500 mt-1">{formData.description.length}/160 characters</p>
            </div>
            
            <div>
              <Label htmlFor="keywords">Keywords</Label>
              <Input
                id="keywords"
                name="keywords"
                value={formData.keywords}
                onChange={handleInputChange}
                placeholder="keyword1, keyword2, keyword3 (comma separated)"
              />
            </div>
            
            <div>
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                placeholder="Page author"
              />
            </div>
            
            <div>
              <Label htmlFor="robots">Robots</Label>
              <Select 
                value={formData.robots} 
                onValueChange={(value) => handleSelectChange('robots', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select robots directive" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="index, follow">index, follow (default)</SelectItem>
                  <SelectItem value="noindex, follow">noindex, follow</SelectItem>
                  <SelectItem value="index, nofollow">index, nofollow</SelectItem>
                  <SelectItem value="noindex, nofollow">noindex, nofollow</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="opengraph" className="space-y-4 mt-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="ogTitle">OG Title</Label>
              <Input
                id="ogTitle"
                name="ogTitle"
                value={formData.ogTitle}
                onChange={handleInputChange}
                placeholder="Title for social media sharing"
              />
            </div>
            
            <div>
              <Label htmlFor="ogDescription">OG Description</Label>
              <Textarea
                id="ogDescription"
                name="ogDescription"
                value={formData.ogDescription}
                onChange={handleInputChange}
                placeholder="Description for social media sharing"
              />
            </div>
            
            <div>
              <Label htmlFor="ogImage">OG Image URL</Label>
              <Input
                id="ogImage"
                name="ogImage"
                value={formData.ogImage}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg (1200x630px recommended)"
              />
            </div>
            
            <div>
              <Label htmlFor="ogType">OG Type</Label>
              <Select 
                value={formData.ogType} 
                onValueChange={(value) => handleSelectChange('ogType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select OG type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="website">website</SelectItem>
                  <SelectItem value="article">article</SelectItem>
                  <SelectItem value="blog">blog</SelectItem>
                  <SelectItem value="book">book</SelectItem>
                  <SelectItem value="profile">profile</SelectItem>
                  <SelectItem value="video">video</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="twitter" className="space-y-4 mt-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="twitterCard">Twitter Card</Label>
              <Select 
                value={formData.twitterCard} 
                onValueChange={(value) => handleSelectChange('twitterCard', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Twitter card type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="summary">summary</SelectItem>
                  <SelectItem value="summary_large_image">summary_large_image</SelectItem>
                  <SelectItem value="app">app</SelectItem>
                  <SelectItem value="player">player</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="twitterTitle">Twitter Title</Label>
              <Input
                id="twitterTitle"
                name="twitterTitle"
                value={formData.twitterTitle}
                onChange={handleInputChange}
                placeholder="Title for Twitter sharing"
              />
            </div>
            
            <div>
              <Label htmlFor="twitterDescription">Twitter Description</Label>
              <Textarea
                id="twitterDescription"
                name="twitterDescription"
                value={formData.twitterDescription}
                onChange={handleInputChange}
                placeholder="Description for Twitter sharing"
              />
            </div>
            
            <div>
              <Label htmlFor="twitterImage">Twitter Image URL</Label>
              <Input
                id="twitterImage"
                name="twitterImage"
                value={formData.twitterImage}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg (1200x675px recommended)"
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-center mt-6">
        <Button 
          onClick={generateMetaTags} 
          disabled={!formData.title && !formData.description}
        >
          Generate Meta Tags
        </Button>
      </div>
      
      {generatedCode && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code size={20} />
              Generated Meta Tags
            </CardTitle>
            <CardDescription>
              Copy and paste these meta tags into the <code>&lt;head&gt;</code> section of your HTML
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-4 relative">
              <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
                {generatedCode}
              </pre>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={copyToClipboard} className="ml-auto">
              {copied ? (
                <>
                  <Check size={16} className="mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={16} className="mr-2" />
                  Copy to Clipboard
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default MetaTagGeneratorTool;
