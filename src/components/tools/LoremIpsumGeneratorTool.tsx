import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Copy, FileText } from 'lucide-react';

const LoremIpsumGeneratorTool = () => {
  const [outputText, setOutputText] = useState<string>('');
  const [count, setCount] = useState<number>(5);
  const [type, setType] = useState<string>('paragraphs');
  const [format, setFormat] = useState<string>('plain');
  
  // Basic Lorem Ipsum text
  const loremIpsumWords = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
    'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
    'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation',
    'ullamco', 'laboris', 'nisi', 'ut', 'aliquip', 'ex', 'ea', 'commodo', 'consequat',
    'duis', 'aute', 'irure', 'dolor', 'in', 'reprehenderit', 'voluptate', 'velit',
    'esse', 'cillum', 'dolore', 'eu', 'fugiat', 'nulla', 'pariatur', 'excepteur',
    'sint', 'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'in', 'culpa',
    'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
  ];
  
  // Generate random word
  const getRandomWord = () => {
    return loremIpsumWords[Math.floor(Math.random() * loremIpsumWords.length)];
  };
  
  // Generate a sentence with 5-15 words
  const generateSentence = () => {
    const sentenceLength = 5 + Math.floor(Math.random() * 11); // 5 to 15 words
    const words = [];
    
    // First word capitalized
    let firstWord = getRandomWord();
    words.push(firstWord.charAt(0).toUpperCase() + firstWord.slice(1));
    
    // Rest of the words
    for (let i = 1; i < sentenceLength; i++) {
      words.push(getRandomWord());
    }
    
    return words.join(' ') + '.';
  };
  
  // Generate a paragraph with 3-7 sentences
  const generateParagraph = () => {
    const paragraphLength = 3 + Math.floor(Math.random() * 5); // 3 to 7 sentences
    const sentences = [];
    
    for (let i = 0; i < paragraphLength; i++) {
      sentences.push(generateSentence());
    }
    
    return sentences.join(' ');
  };
  
  const generateOutput = () => {
    let result = '';
    
    try {
      switch (type) {
        case 'paragraphs':
          const paragraphs = [];
          for (let i = 0; i < count; i++) {
            paragraphs.push(generateParagraph());
          }
          result = paragraphs.join('\n\n');
          break;
          
        case 'sentences':
          const sentences = [];
          for (let i = 0; i < count; i++) {
            sentences.push(generateSentence());
          }
          result = sentences.join(' ');
          break;
          
        case 'words':
          const words = [];
          words.push('Lorem'); // Start with Lorem
          
          for (let i = 1; i < count; i++) {
            words.push(getRandomWord());
          }
          
          result = words.join(' ');
          if (!result.endsWith('.')) {
            result += '.';
          }
          break;
      }
      
      // Apply formatting
      if (format === 'html') {
        if (type === 'paragraphs') {
          result = result.split('\n\n').map(p => `<p>${p}</p>`).join('\n');
        } else if (type === 'sentences') {
          result = `<p>${result}</p>`;
        } else {
          result = `<p>${result}</p>`;
        }
      }
      
      setOutputText(result);
      
      toast({
        title: "Generated",
        description: `Generated ${count} ${type} of Lorem Ipsum text`,
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "There was an error generating Lorem Ipsum text",
        variant: "destructive",
      });
    }
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputText);
    toast({
      title: "Copied!",
      description: "Text copied to clipboard",
    });
  };

  return (
    <div className="container max-w-3xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <FileText className="h-5 w-5" />
            Lorem Ipsum Generator
          </CardTitle>
          <p className="text-sm text-muted-foreground">Generate placeholder text for designs</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="count" className="block text-sm font-medium mb-2">
                  Count
                </Label>
                <Input 
                  id="count"
                  type="number" 
                  min="1" 
                  max="100" 
                  value={count}
                  onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                />
              </div>
              
              <div>
                <Label className="block text-sm font-medium mb-2">
                  Type
                </Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paragraphs">Paragraphs</SelectItem>
                    <SelectItem value="sentences">Sentences</SelectItem>
                    <SelectItem value="words">Words</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="block text-sm font-medium mb-2">
                  Format
                </Label>
                <RadioGroup value={format} onValueChange={setFormat} className="flex space-x-4">
                  <div className="flex items-center">
                    <RadioGroupItem value="plain" id="plain" />
                    <Label htmlFor="plain" className="ml-2">Plain Text</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="html" id="html" />
                    <Label htmlFor="html" className="ml-2">HTML</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            
            <Button onClick={generateOutput} className="w-full">
              Generate Lorem Ipsum
            </Button>
            
            {outputText && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium">Generated Text</h3>
                  <Button variant="outline" size="sm" onClick={copyToClipboard}>
                    <Copy className="h-4 w-4 mr-2" /> Copy
                  </Button>
                </div>
                
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-md">
                  {format === 'plain' ? (
                    <pre className="whitespace-pre-wrap text-sm">{outputText}</pre>
                  ) : (
                    <div className="text-sm prose dark:prose-invert max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: outputText }} />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoremIpsumGeneratorTool;
