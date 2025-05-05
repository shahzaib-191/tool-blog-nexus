
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Copy, RotateCcw, ArrowRightLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import ToolHeader from './ToolHeader';

const AIParaphraserTool: React.FC = () => {
  const { toast } = useToast();
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [toneStyle, setToneStyle] = useState('standard');

  const handleParaphrase = () => {
    if (!inputText.trim()) {
      toast({
        title: "Error",
        description: "Please enter text to paraphrase",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate AI paraphrasing process
    setTimeout(() => {
      let paraphrasedText = '';
      
      switch (toneStyle) {
        case 'formal':
          paraphrasedText = inputText
            .replace(/don't/gi, 'do not')
            .replace(/can't/gi, 'cannot')
            .replace(/won't/gi, 'will not')
            .replace(/I'm/gi, 'I am')
            .replace(/you're/gi, 'you are')
            .replace(/they're/gi, 'they are')
            .replace(/we're/gi, 'we are')
            .replace(/good/gi, 'excellent')
            .replace(/bad/gi, 'unfavorable')
            .replace(/big/gi, 'substantial')
            .replace(/small/gi, 'minimal');
          break;
        case 'simple':
          paraphrasedText = inputText
            .replace(/utilize/gi, 'use')
            .replace(/implement/gi, 'use')
            .replace(/demonstrate/gi, 'show')
            .replace(/facilitate/gi, 'help')
            .replace(/substantial/gi, 'big')
            .replace(/minimal/gi, 'small')
            .replace(/prioritize/gi, 'focus on')
            .replace(/initiate/gi, 'start');
          break;
        case 'creative':
          paraphrasedText = inputText
            .replace(/good/gi, 'fantastic')
            .replace(/bad/gi, 'terrible')
            .replace(/happy/gi, 'overjoyed')
            .replace(/sad/gi, 'heartbroken')
            .replace(/big/gi, 'enormous')
            .replace(/small/gi, 'tiny')
            .replace(/important/gi, 'crucial')
            .replace(/problem/gi, 'challenge');
          break;
        default:
          // Standard paraphrasing
          paraphrasedText = inputText
            .split(' ')
            .map(word => {
              if (Math.random() > 0.7 && word.length > 3) {
                return word.split('').reverse().join('');
              }
              return word;
            })
            .join(' ');
            
          // Correct the above nonsense with a more sensible paraphrase
          paraphrasedText = inputText
            .replace(/think/gi, 'believe')
            .replace(/said/gi, 'stated')
            .replace(/big/gi, 'large')
            .replace(/small/gi, 'little')
            .replace(/good/gi, 'great')
            .replace(/bad/gi, 'poor')
            .replace(/looks/gi, 'appears')
            .replace(/very/gi, 'quite')
            .replace(/goes/gi, 'proceeds')
            .replace(/use/gi, 'utilize');
      }
      
      setOutputText(paraphrasedText);
      setIsProcessing(false);
      
      toast({
        title: "Success!",
        description: "Text has been paraphrased",
        variant: "default",
      });
    }, 1500);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputText);
    toast({
      title: "Copied!",
      description: "Text copied to clipboard",
    });
  };

  const resetTexts = () => {
    setInputText('');
    setOutputText('');
  };

  const swapTexts = () => {
    setInputText(outputText);
    setOutputText(inputText);
  };

  return (
    <>
      <ToolHeader 
        title="AI Paraphraser" 
        description="Rewrite text while maintaining original meaning. Perfect for avoiding plagiarism and improving content."
      />

      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label htmlFor="tone-style">Paraphrase Style</Label>
                  {inputText && (
                    <Badge variant="default" className="ml-2">
                      {inputText.trim().split(/\s+/).length} words
                    </Badge>
                  )}
                </div>
                <Select value={toneStyle} onValueChange={setToneStyle}>
                  <SelectTrigger id="tone-style" className="w-full">
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="simple">Simple</SelectItem>
                    <SelectItem value="creative">Creative</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label htmlFor="input-text">Original Text</Label>
                    <Button variant="ghost" size="sm" onClick={resetTexts}>
                      <RotateCcw className="h-3.5 w-3.5 mr-1" />
                      Reset
                    </Button>
                  </div>
                  <Textarea 
                    id="input-text"
                    placeholder="Enter text to paraphrase..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="min-h-[200px]"
                  />
                </div>
                
                <div className="relative">
                  <div className="flex justify-between items-center mb-2">
                    <Label htmlFor="output-text">Paraphrased Text</Label>
                    {outputText && (
                      <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                        <Copy className="h-3.5 w-3.5 mr-1" />
                        Copy
                      </Button>
                    )}
                  </div>
                  <Textarea 
                    id="output-text"
                    placeholder="Paraphrased text will appear here..."
                    value={outputText}
                    readOnly
                    className="min-h-[200px]"
                  />
                  
                  {(inputText && outputText) && (
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={swapTexts}
                      className="absolute top-1/2 -left-6 transform -translate-x-1/2 -translate-y-1/2 rounded-full h-8 w-8 bg-white border shadow-md hidden md:flex"
                    >
                      <ArrowRightLeft className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
              
              <Button 
                onClick={handleParaphrase} 
                disabled={isProcessing || !inputText.trim()}
                className="w-full"
              >
                {isProcessing ? "Paraphrasing..." : "Paraphrase Text"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AIParaphraserTool;
