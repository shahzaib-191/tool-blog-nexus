
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, ArrowRightLeft, Loader2 } from 'lucide-react';

const AIParaphraserTool = () => {
  const [inputText, setInputText] = useState<string>('');
  const [outputText, setOutputText] = useState<string>('');
  const [style, setStyle] = useState<string>('simple');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
  const handleParaphrase = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Empty input",
        description: "Please enter some text to paraphrase",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simple paraphrasing simulation based on selected style
      let result = '';
      
      switch (style) {
        case 'simple':
          result = simpleParaphrase(inputText);
          break;
        case 'formal':
          result = formalParaphrase(inputText);
          break;
        case 'creative':
          result = creativeParaphrase(inputText);
          break;
        case 'concise':
          result = conciseParaphrase(inputText);
          break;
        default:
          result = simpleParaphrase(inputText);
      }
      
      setOutputText(result);
      
      toast({
        title: "Text paraphrased",
        description: "Your content has been rewritten successfully",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Failed to paraphrase",
        description: "There was an error processing your text",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputText);
    toast({
      title: "Copied!",
      description: "Paraphrased text copied to clipboard",
    });
  };
  
  // Very simple mock paraphrasing functions
  const simpleParaphrase = (text: string) => {
    return text
      .replace(/is not/g, "isn't")
      .replace(/cannot/g, "can't")
      .replace(/would not/g, "wouldn't")
      .replace(/important/g, "significant")
      .replace(/big/g, "large")
      .replace(/small/g, "tiny")
      .replace(/good/g, "great")
      .replace(/bad/g, "poor")
      .replace(/happy/g, "glad")
      .replace(/sad/g, "unhappy");
  };
  
  const formalParaphrase = (text: string) => {
    return text
      .replace(/isn't/g, "is not")
      .replace(/can't/g, "cannot")
      .replace(/wouldn't/g, "would not")
      .replace(/good/g, "excellent")
      .replace(/bad/g, "unfavorable")
      .replace(/big/g, "substantial")
      .replace(/think/g, "consider")
      .replace(/use/g, "utilize")
      .replace(/get/g, "obtain")
      .replace(/make/g, "manufacture");
  };
  
  const creativeParaphrase = (text: string) => {
    return text
      .replace(/happy/g, "over the moon")
      .replace(/sad/g, "down in the dumps")
      .replace(/difficult/g, "as tough as nails")
      .replace(/easy/g, "a piece of cake")
      .replace(/good/g, "fantastic")
      .replace(/bad/g, "terrible")
      .replace(/interesting/g, "fascinating")
      .replace(/boring/g, "mind-numbing")
      .replace(/tired/g, "exhausted")
      .replace(/said/g, "expressed");
  };
  
  const conciseParaphrase = (text: string) => {
    return text
      .replace(/in order to/g, "to")
      .replace(/due to the fact that/g, "because")
      .replace(/at this point in time/g, "now")
      .replace(/in the event that/g, "if")
      .replace(/on the grounds that/g, "since")
      .replace(/in the near future/g, "soon")
      .replace(/it is important to note that/g, "note that")
      .replace(/in spite of the fact that/g, "although")
      .replace(/with regard to/g, "regarding")
      .replace(/take into consideration/g, "consider");
  };

  return (
    <div className="container max-w-4xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle>AI Text Paraphraser</CardTitle>
          <p className="text-sm text-muted-foreground">
            Rewrite text while maintaining the original meaning
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium">
                  Enter text to paraphrase
                </label>
                <div className="flex items-center">
                  <span className="text-sm mr-2">Style:</span>
                  <Select value={style} onValueChange={setStyle}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="simple">Simple</SelectItem>
                      <SelectItem value="formal">Formal</SelectItem>
                      <SelectItem value="creative">Creative</SelectItem>
                      <SelectItem value="concise">Concise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <textarea
                className="min-h-[150px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="Enter the text you want to paraphrase here..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
            </div>
            
            <Button 
              onClick={handleParaphrase} 
              className="w-full"
              disabled={isProcessing || !inputText.trim()}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Paraphrasing...
                </>
              ) : (
                <>
                  <ArrowRightLeft className="mr-2 h-4 w-4" />
                  Paraphrase Text
                </>
              )}
            </Button>
            
            {outputText && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium">Paraphrased Result</h3>
                  <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                    <Copy className="h-4 w-4 mr-2" /> Copy
                  </Button>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-md">
                  <p className="whitespace-pre-line">{outputText}</p>
                </div>
                <div className="text-xs text-muted-foreground text-center mt-2">
                  Note: This is a simple demonstration. A real implementation would use an AI model.
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIParaphraserTool;
