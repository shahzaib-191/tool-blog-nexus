
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ToolHeader from './ToolHeader';

const JsonFormatterTool: React.FC = () => {
  const [inputJson, setInputJson] = useState('');
  const [outputJson, setOutputJson] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [indentSize, setIndentSize] = useState(2);
  const [copied, setCopied] = useState(false);

  const formatJson = () => {
    try {
      if (!inputJson.trim()) {
        setError('Please enter JSON to format');
        setOutputJson('');
        return;
      }
      
      const parsedJson = JSON.parse(inputJson);
      const formattedJson = JSON.stringify(parsedJson, null, indentSize);
      setOutputJson(formattedJson);
      setError(null);
    } catch (err) {
      setError('Invalid JSON: ' + (err as Error).message);
      setOutputJson('');
    }
  };

  const validateJson = () => {
    try {
      if (!inputJson.trim()) {
        setError('Please enter JSON to validate');
        return false;
      }
      
      JSON.parse(inputJson);
      setError(null);
      return true;
    } catch (err) {
      setError('Invalid JSON: ' + (err as Error).message);
      return false;
    }
  };

  const minifyJson = () => {
    try {
      if (!inputJson.trim()) {
        setError('Please enter JSON to minify');
        setOutputJson('');
        return;
      }
      
      const parsedJson = JSON.parse(inputJson);
      const minifiedJson = JSON.stringify(parsedJson);
      setOutputJson(minifiedJson);
      setError(null);
    } catch (err) {
      setError('Invalid JSON: ' + (err as Error).message);
      setOutputJson('');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <ToolHeader 
        title="JSON Formatter / Validator" 
        description="Format, validate and beautify JSON data"
      />

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="format" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="format">Format</TabsTrigger>
            <TabsTrigger value="validate">Validate</TabsTrigger>
            <TabsTrigger value="minify">Minify</TabsTrigger>
          </TabsList>
          
          <div className="mt-6 grid md:grid-cols-2 gap-6">
            <div>
              <Card>
                <CardContent className="pt-6">
                  <p className="mb-2 text-sm font-medium">Input JSON</p>
                  <Textarea 
                    placeholder="Paste your JSON here..."
                    value={inputJson}
                    onChange={(e) => {
                      setInputJson(e.target.value);
                      setError(null);
                    }}
                    className="h-[300px] font-mono text-sm"
                  />
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-medium">Output</p>
                    {outputJson && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={copyToClipboard}
                        className="h-8 gap-1"
                      >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        {copied ? 'Copied' : 'Copy'}
                      </Button>
                    )}
                  </div>
                  <Textarea 
                    value={outputJson}
                    readOnly
                    className="h-[300px] font-mono text-sm"
                    placeholder="Formatted JSON will appear here..."
                  />
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="mt-4">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <TabsContent value="format" className="mt-0">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm">Indent Size:</span>
                  {[2, 4, 8].map((size) => (
                    <Button 
                      key={size}
                      variant={indentSize === size ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setIndentSize(size)}
                      className="h-8 w-8 p-0"
                    >
                      {size}
                    </Button>
                  ))}
                </div>
                <Button onClick={formatJson}>Format JSON</Button>
              </div>
              
              {outputJson && !error && (
                <Badge variant="outline" className="bg-green-50 text-green-700 mb-2">JSON formatted successfully</Badge>
              )}
              
              <p className="text-sm text-gray-500">
                Click "Format JSON" to prettify and indent your JSON data.
              </p>
            </TabsContent>
            
            <TabsContent value="validate" className="mt-0">
              <div className="flex justify-end mb-4">
                <Button onClick={validateJson}>Validate JSON</Button>
              </div>
              
              {inputJson && !error && (
                <Badge variant="outline" className="bg-green-50 text-green-700 mb-2">Valid JSON ✓</Badge>
              )}
              
              <p className="text-sm text-gray-500">
                Check if your JSON is valid and correctly formatted.
              </p>
            </TabsContent>
            
            <TabsContent value="minify" className="mt-0">
              <div className="flex justify-end mb-4">
                <Button onClick={minifyJson}>Minify JSON</Button>
              </div>
              
              {outputJson && !error && (
                <Badge variant="outline" className="bg-green-50 text-green-700 mb-2">JSON minified successfully</Badge>
              )}
              
              <p className="text-sm text-gray-500">
                Remove all whitespace to create a compact version of your JSON.
              </p>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </>
  );
};

export default JsonFormatterTool;
