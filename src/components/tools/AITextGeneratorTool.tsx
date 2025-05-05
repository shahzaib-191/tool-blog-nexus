
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Copy, Loader2 } from 'lucide-react';

const formSchema = z.object({
  prompt: z.string().min(5, { message: "Prompt must be at least 5 characters long" }),
  style: z.string(),
  wordCount: z.string().transform((val) => parseInt(val, 10)),
});

const AITextGeneratorTool = () => {
  const [generatedText, setGeneratedText] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
      style: 'informative',
      wordCount: '150',
    },
  });
  
  const handleGenerate = async (data: z.infer<typeof formSchema>) => {
    setIsGenerating(true);
    
    try {
      // Simulate AI text generation with a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate placeholder text based on style
      let text = '';
      const { prompt, style, wordCount } = data;
      
      switch (style) {
        case 'informative':
          text = `Here is an informative article about ${prompt}. This content addresses the key aspects and provides valuable insights about the topic. The information presented here is designed to be educational and instructive. Readers can learn about the main concepts related to ${prompt} and understand its significance. This article aims to provide a clear and concise explanation of the subject matter. It's structured to present facts and details in a logical sequence, making it easy to follow and comprehend.`;
          break;
        case 'creative':
          text = `Imagine a world where ${prompt} exists in the most extraordinary way. The colorful landscape unfolds with magical elements that captivate your imagination. Characters with unique personalities navigate through this creative realm, discovering hidden treasures and unexpected twists. This story takes you on a journey through uncharted territories of creativity and innovation. The narrative weaves together elements of wonder and excitement, creating an immersive experience for the reader.`;
          break;
        case 'persuasive':
          text = `You absolutely need to consider ${prompt} as your top priority. The undeniable benefits of this approach will transform how you think about the subject. Evidence clearly shows that taking action on this matter leads to significant improvements in outcomes. Industry leaders have already recognized the importance of ${prompt} and are reaping the rewards. Don't fall behind—embrace this opportunity to stay ahead of the curve and maximize your results.`;
          break;
        case 'technical':
          text = `The technical specifications of ${prompt} include several critical components that must be carefully considered during implementation. System architecture requires proper configuration of all parameters to ensure optimal performance. When deploying this solution, administrators should follow best practices for security and efficiency. Documentation should be thoroughly reviewed prior to installation to prevent common errors and compatibility issues. Regular maintenance will be required to ensure continued operation within expected parameters.`;
          break;
        default:
          text = `Here is some generated content about ${prompt}. This text is designed to meet your specified requirements and provide value based on your input. The content addresses the main points related to your topic and aims to satisfy your content needs.`;
      }
      
      // Adjust length to roughly match requested word count
      const words = text.split(' ');
      const adjustedText = words.slice(0, data.wordCount).join(' ');
      
      setGeneratedText(adjustedText);
      
      toast({
        title: "Content generated",
        description: "Your AI text has been generated successfully",
      });
    } catch (error) {
      toast({
        title: "Failed to generate text",
        description: "There was an error generating your content",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedText);
    toast({
      title: "Copied!",
      description: "Text copied to clipboard",
    });
  };

  return (
    <div className="container max-w-3xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle>AI Text Generator</CardTitle>
          <p className="text-sm text-muted-foreground">
            Generate high-quality text content with AI assistance
          </p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleGenerate)} className="space-y-6">
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What would you like to generate?</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="E.g., An article about artificial intelligence" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="style"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content Style</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a style" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="informative">Informative</SelectItem>
                          <SelectItem value="creative">Creative</SelectItem>
                          <SelectItem value="persuasive">Persuasive</SelectItem>
                          <SelectItem value="technical">Technical</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="wordCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Word Count (approx.)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select word count" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="50">Short (~50 words)</SelectItem>
                          <SelectItem value="150">Medium (~150 words)</SelectItem>
                          <SelectItem value="300">Long (~300 words)</SelectItem>
                          <SelectItem value="500">Very Long (~500 words)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Content"
                )}
              </Button>
            </form>
          </Form>
          
          {generatedText && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Generated Result</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    ~{generatedText.split(' ').length} words
                  </Badge>
                  <Button size="sm" variant="outline" onClick={copyToClipboard}>
                    <Copy className="h-4 w-4 mr-2" /> Copy
                  </Button>
                </div>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-md">
                <p className="whitespace-pre-line">{generatedText}</p>
              </div>
              
              <div className="text-xs text-muted-foreground text-center mt-2">
                Note: This is a simulation of AI text generation. In a production app, this would connect to an LLM API.
              </div>
            </div>
          )}
          
        </CardContent>
      </Card>
    </div>
  );
};

export default AITextGeneratorTool;
