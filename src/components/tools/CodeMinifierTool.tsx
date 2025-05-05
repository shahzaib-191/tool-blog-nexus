
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ToolHeader from './ToolHeader';

const CodeMinifierTool: React.FC = () => {
  const [inputCode, setInputCode] = useState('');
  const [outputCode, setOutputCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [codeType, setCodeType] = useState<'html' | 'css' | 'js'>('html');
  const [copied, setCopied] = useState(false);

  const minifyHTML = (html: string): string => {
    // Simple HTML minification - in a real app, you'd use a proper library
    return html
      .replace(/<!--[\s\S]*?-->/g, '') // Remove comments
      .replace(/\s{2,}/g, ' ') // Remove extra spaces
      .replace(/>\s+</g, '><') // Remove spaces between tags
      .trim();
  };

  const minifyCSS = (css: string): string => {
    // Simple CSS minification - in a real app, you'd use a proper library
    return css
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
      .replace(/\s{2,}/g, ' ') // Remove extra spaces
      .replace(/\s*{\s*/g, '{') // Remove spaces around {
      .replace(/\s*}\s*/g, '}') // Remove spaces around }
      .replace(/\s*:\s*/g, ':') // Remove spaces around :
      .replace(/\s*;\s*/g, ';') // Remove spaces around ;
      .replace(/\s*,\s*/g, ',') // Remove spaces around ,
      .trim();
  };

  const minifyJS = (js: string): string => {
    // Simple JS minification - in a real app, you'd use a proper library
    try {
      // For demonstration purposes only - this is not a real minifier
      return js
        .replace(/\/\/.*$/gm, '') // Remove single-line comments
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
        .replace(/\s{2,}/g, ' ') // Remove extra spaces
        .replace(/\s*{\s*/g, '{') // Remove spaces around {
        .replace(/\s*}\s*/g, '}') // Remove spaces around }
        .replace(/\s*:\s*/g, ':') // Remove spaces around :
        .replace(/\s*;\s*/g, ';') // Remove spaces around ;
        .replace(/\s*,\s*/g, ',') // Remove spaces around ,
        .trim();
    } catch (err) {
      setError('Error minifying JavaScript: ' + (err as Error).message);
      return js;
    }
  };

  const handleMinify = () => {
    try {
      if (!inputCode.trim()) {
        setError('Please enter code to minify');
        setOutputCode('');
        return;
      }
      
      let minified = '';
      
      if (codeType === 'html') {
        minified = minifyHTML(inputCode);
      } else if (codeType === 'css') {
        minified = minifyCSS(inputCode);
      } else if (codeType === 'js') {
        minified = minifyJS(inputCode);
      }
      
      setOutputCode(minified);
      setError(null);
      
      // Calculate compression ratio
      const compressionRatio = inputCode ? ((1 - minified.length / inputCode.length) * 100).toFixed(1) : '0';
      console.log(`Minified ${codeType.toUpperCase()}: ${compressionRatio}% reduction`);
    } catch (err) {
      setError('Error minifying code: ' + (err as Error).message);
      setOutputCode('');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCompressionRatio = (): string => {
    if (!inputCode || !outputCode) return '0';
    return ((1 - outputCode.length / inputCode.length) * 100).toFixed(1);
  };

  return (
    <>
      <ToolHeader 
        title="HTML/CSS/JS Minifier" 
        description="Minify your code to reduce file size and improve loading speed"
      />

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="html" onValueChange={(value) => setCodeType(value as 'html' | 'css' | 'js')} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="html">HTML</TabsTrigger>
            <TabsTrigger value="css">CSS</TabsTrigger>
            <TabsTrigger value="js">JavaScript</TabsTrigger>
          </TabsList>
          
          <div className="mt-6 grid md:grid-cols-2 gap-6">
            <div>
              <Card>
                <CardContent className="pt-6">
                  <p className="mb-2 text-sm font-medium">Input Code</p>
                  <Textarea 
                    placeholder={`Paste your ${codeType.toUpperCase()} code here...`}
                    value={inputCode}
                    onChange={(e) => {
                      setInputCode(e.target.value);
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
                    <p className="text-sm font-medium">Minified Code</p>
                    {outputCode && (
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
                    value={outputCode}
                    readOnly
                    className="h-[300px] font-mono text-sm"
                    placeholder={`Minified ${codeType.toUpperCase()} will appear here...`}
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
            
            <div className="flex justify-between items-center mb-4">
              <div>
                {outputCode && !error && (
                  <Badge variant="default" className="mr-2">
                    {getCompressionRatio()}% reduction
                  </Badge>
                )}
                
                {outputCode && !error && (
                  <span className="text-sm text-gray-500">
                    Original: {inputCode.length.toLocaleString()} chars, 
                    Minified: {outputCode.length.toLocaleString()} chars
                  </span>
                )}
              </div>
              
              <Button onClick={handleMinify}>Minify {codeType.toUpperCase()}</Button>
            </div>
            
            <div className="text-sm text-gray-500">
              <p>
                Click "Minify {codeType.toUpperCase()}" to compress your code by removing unnecessary characters
                without changing its functionality.
              </p>
            </div>
          </div>
        </Tabs>
      </div>
    </>
  );
};

export default CodeMinifierTool;
