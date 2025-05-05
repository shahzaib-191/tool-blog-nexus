
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Copy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import ToolHeader from './ToolHeader';

const AITextGeneratorTool: React.FC = () => {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [promptTemplate, setPromptTemplate] = useState('');
  const [wordCount, setWordCount] = useState<number>(250);
  const [tone, setTone] = useState('professional');
  const [contentType, setContentType] = useState('blog');

  const examplePrompts = {
    blog: "Write an engaging blog post about digital transformation in healthcare.",
    social: "Create an Instagram caption for my new coffee shop's grand opening.",
    ad: "Write a Facebook ad for a fitness program focused on busy professionals.",
    email: "Draft a welcome email for new subscribers to my cooking newsletter."
  };

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt first",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI text generation
    setTimeout(() => {
      let generatedText = '';
      
      if (prompt.toLowerCase().includes('blog') || contentType === 'blog') {
        generatedText = `# The Future of Technology\n\nIn today's rapidly evolving digital landscape, staying ahead of technological trends is crucial for businesses and individuals alike. Innovation continues to accelerate at an unprecedented pace, transforming how we work, communicate, and live our daily lives.\n\n## Key Trends to Watch\n\nArtificial intelligence and machine learning are revolutionizing industries from healthcare to finance. These technologies enable more personalized experiences and data-driven decision making that was impossible just a few years ago.\n\nThe Internet of Things (IoT) connects our world in ways we're only beginning to understand. Smart homes, wearable technology, and connected infrastructure are creating new possibilities and challenges.\n\n## Looking Ahead\n\nAs we move forward, ethical considerations around privacy, security, and equitable access to technology will become increasingly important. Organizations that prioritize responsible innovation will not only comply with emerging regulations but also build greater trust with their customers and stakeholders.\n\nThe future belongs to those who can adapt quickly while maintaining a clear vision of how technology can solve real human problems.`;
      } else if (prompt.toLowerCase().includes('social') || contentType === 'social') {
        generatedText = `✨ NEW ARRIVAL ALERT! ✨\n\nIntroducing our limited edition summer collection that's already flying off the shelves! These pieces were designed with YOU in mind - comfortable, stylish, and perfect for those summer adventures.\n\nTag someone who needs to see this! 👇\n\n#SummerVibes #NewCollection #LimitedEdition`;
      } else if (prompt.toLowerCase().includes('email') || contentType === 'email') {
        generatedText = `Subject: Welcome to Our Community - Your Journey Begins Now!\n\nDear [Name],\n\nThank you for joining our community! We're thrilled to have you with us and can't wait to share all the amazing resources and insights we have in store.\n\nHere's what you can expect in the coming days:\n- Your welcome package with exclusive resources\n- Weekly newsletters packed with industry insights\n- Special member-only offers and early access to upcoming events\n\nIf you have any questions, just reply to this email - we're here to help!\n\nWarm regards,\nThe Team`;
      } else {
        generatedText = `The requested content has been generated based on your specifications. This text is designed to match the ${tone} tone you selected and addresses the key points from your prompt. The content is structured to be engaging and informative, providing value to your target audience.\n\nYour main points have been organized logically, with supporting details and examples where appropriate. The language used is tailored to resonate with your intended readers, creating a connection that encourages further engagement.\n\nFeel free to use this as a foundation, adding your personal touch or additional details specific to your needs.`;
      }
      
      setOutputText(generatedText);
      setIsGenerating(false);
    }, 2000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputText);
    toast({
      title: "Copied!",
      description: "Text copied to clipboard",
    });
  };

  const handlePromptTemplateChange = (value: string) => {
    setPromptTemplate(value);
    setPrompt(examplePrompts[value as keyof typeof examplePrompts]);
  };

  return (
    <>
      <ToolHeader 
        title="AI Text Generator" 
        description="Generate high-quality text content for blogs, social media, emails, and more."
      />

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="generate" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generate">Generate</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>
          
          <TabsContent value="generate" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <div className="grid gap-6">
                  <div>
                    <Label htmlFor="content-type">Content Type</Label>
                    <Select value={contentType} onValueChange={setContentType}>
                      <SelectTrigger className="w-full mt-1">
                        <SelectValue placeholder="Select content type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="blog">Blog Post</SelectItem>
                        <SelectItem value="social">Social Media</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="ad">Advertisement</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="tone">Tone</Label>
                    <Select value={tone} onValueChange={setTone}>
                      <SelectTrigger className="w-full mt-1">
                        <SelectValue placeholder="Select tone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="friendly">Friendly</SelectItem>
                        <SelectItem value="authoritative">Authoritative</SelectItem>
                        <SelectItem value="humorous">Humorous</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <Label htmlFor="wordCount">Word Count: {wordCount}</Label>
                    </div>
                    <Slider 
                      value={[wordCount]} 
                      min={100} 
                      max={1000}
                      step={50}
                      onValueChange={(value) => setWordCount(value[0])} 
                      className="mb-4" 
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="prompt">Your Prompt</Label>
                    <Textarea 
                      id="prompt"
                      placeholder="Enter what you want to generate... (e.g. Write a blog post about sustainable living)"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="min-h-[120px] mt-1"
                    />
                  </div>
                  
                  <Button 
                    onClick={handleGenerate} 
                    disabled={isGenerating || !prompt.trim()}
                    className="w-full"
                  >
                    {isGenerating ? "Generating..." : "Generate Text"}
                  </Button>
                  
                  {outputText && (
                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-2">
                        <Label>Generated Text</Label>
                        <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </Button>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-md whitespace-pre-wrap text-sm">
                        {outputText}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="templates" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <div className="grid gap-4">
                  <div>
                    <Label>Prompt Templates</Label>
                    <p className="text-sm text-gray-500 mb-4">
                      Select a template to quickly start generating content
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {Object.entries(examplePrompts).map(([key, value]) => (
                        <div 
                          key={key} 
                          className={`cursor-pointer p-3 rounded-md border ${promptTemplate === key ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
                          onClick={() => handlePromptTemplateChange(key)}
                        >
                          <p className="font-medium mb-1 capitalize">{key}</p>
                          <p className="text-sm text-gray-600">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default AITextGeneratorTool;
