
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy } from 'lucide-react';

const JsonFormatterTool = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const formatJson = () => {
    try {
      // Parse JSON to validate it
      const parsedJson = JSON.parse(input);
      
      // Format with indentation
      const formattedJson = JSON.stringify(parsedJson, null, 2);
      
      setOutput(formattedJson);
      setIsValid(true);
      
      toast({
        title: "JSON is valid",
        description: "Your JSON has been formatted successfully",
        variant: "success",
      });
    } catch (error) {
      setIsValid(false);
      setOutput('');
      
      toast({
        title: "Invalid JSON",
        description: error instanceof Error ? error.message : "Please check your JSON syntax",
        variant: "destructive",
      });
    }
  };
  
  const minifyJson = () => {
    try {
      // Parse JSON to validate it
      const parsedJson = JSON.parse(input);
      
      // Minify (no whitespace)
      const minifiedJson = JSON.stringify(parsedJson);
      
      setOutput(minifiedJson);
      setIsValid(true);
      
      toast({
        title: "JSON is valid",
        description: "Your JSON has been minified successfully",
        variant: "success",
      });
    } catch (error) {
      setIsValid(false);
      setOutput('');
      
      toast({
        title: "Invalid JSON",
        description: error instanceof Error ? error.message : "Please check your JSON syntax",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    toast({
      title: "Copied!",
      description: "JSON copied to clipboard",
    });
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setIsValid(null);
  };

  return (
    <div className="container max-w-4xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle>JSON Formatter / Validator</CardTitle>
          <p className="text-sm text-muted-foreground">Format, validate or minify JSON data</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <label htmlFor="input" className="block text-sm font-medium mb-2">
                Input JSON
              </label>
              <textarea
                id="input"
                className="min-h-[200px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder='{"example": "Paste your JSON here"}'
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Button onClick={formatJson}>Format & Validate</Button>
              <Button variant="outline" onClick={minifyJson}>Minify</Button>
              <Button variant="outline" onClick={clearAll}>Clear</Button>
            </div>

            {isValid !== null && (
              <div className={`p-2 rounded-md text-white ${isValid ? 'bg-green-500' : 'bg-red-500'}`}>
                {isValid ? 'JSON is valid!' : 'Invalid JSON. Please check your syntax.'}
              </div>
            )}

            {output && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="output" className="block text-sm font-medium">
                    Formatted Result
                  </label>
                  <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                    <Copy className="h-4 w-4 mr-2" /> Copy
                  </Button>
                </div>
                <pre className="bg-slate-100 dark:bg-slate-800 p-4 rounded-md overflow-x-auto whitespace-pre-wrap">
                  <code>{output}</code>
                </pre>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JsonFormatterTool;
