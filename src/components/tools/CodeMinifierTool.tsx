
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, FileCode } from 'lucide-react';

const CodeMinifierTool = () => {
  const [activeTab, setActiveTab] = useState<string>('html');
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [minified, setMinified] = useState<boolean>(false);
  
  const minifyHTML = (html: string) => {
    // Basic HTML minification
    return html
      .replace(/\s+/g, ' ')                  // Replace multiple whitespaces with a single space
      .replace(/>\s+</g, '><')               // Remove whitespace between tags
      .replace(/<!--[\s\S]*?-->/g, '')       // Remove HTML comments
      .replace(/\s+>/g, '>')                 // Remove whitespace before closing bracket
      .replace(/<\s+/g, '<')                 // Remove whitespace after opening bracket
      .trim();
  };
  
  const minifyCSS = (css: string) => {
    // Basic CSS minification
    return css
      .replace(/\/\*[\s\S]*?\*\//g, '')      // Remove comments
      .replace(/\s+/g, ' ')                  // Replace multiple whitespaces with a single space
      .replace(/\s*{\s*/g, '{')              // Remove spaces around opening braces
      .replace(/\s*}\s*/g, '}')              // Remove spaces around closing braces
      .replace(/\s*:\s*/g, ':')              // Remove spaces around colons
      .replace(/\s*;\s*/g, ';')              // Remove spaces around semicolons
      .replace(/\s*,\s*/g, ',')              // Remove spaces around commas
      .trim();
  };
  
  const minifyJS = (js: string) => {
    // Basic JavaScript minification
    // Note: Real JS minification is much more complex
    return js
      .replace(/\/\/.*?(\r|\n|$)/g, '$1')    // Remove single line comments
      .replace(/\/\*[\s\S]*?\*\//g, '')      // Remove multi-line comments
      .replace(/\s+/g, ' ')                  // Replace multiple whitespaces with a single space
      .replace(/\s*{\s*/g, '{')              // Remove spaces around opening braces
      .replace(/\s*}\s*/g, '}')              // Remove spaces around closing braces
      .replace(/\s*\(\s*/g, '(')             // Remove spaces around opening parentheses
      .replace(/\s*\)\s*/g, ')')             // Remove spaces around closing parentheses
      .replace(/\s*;\s*/g, ';')              // Remove spaces around semicolons
      .replace(/\s*,\s*/g, ',')              // Remove spaces around commas
      .trim();
  };
  
  const handleMinify = () => {
    if (!input.trim()) {
      toast({
        title: "Empty input",
        description: "Please enter some code to minify",
        variant: "destructive",
      });
      return;
    }
    
    try {
      let minifiedCode = '';
      
      switch (activeTab) {
        case 'html':
          minifiedCode = minifyHTML(input);
          break;
        case 'css':
          minifiedCode = minifyCSS(input);
          break;
        case 'js':
          minifiedCode = minifyJS(input);
          break;
        default:
          minifiedCode = input.replace(/\s+/g, ' ').trim();
      }
      
      setOutput(minifiedCode);
      setMinified(true);
      
      // Calculate size reduction
      const originalSize = new Blob([input]).size;
      const minifiedSize = new Blob([minifiedCode]).size;
      const reduction = ((originalSize - minifiedSize) / originalSize * 100).toFixed(2);
      
      toast({
        title: "Minification complete",
        description: `Size reduced by ${reduction}% (${originalSize} → ${minifiedSize} bytes)`,
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Minification failed",
        description: "There was an error minifying your code",
        variant: "destructive",
      });
    }
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    toast({
      title: "Copied!",
      description: "Minified code copied to clipboard",
    });
  };
  
  const getPlaceholder = () => {
    switch (activeTab) {
      case 'html':
        return `<!DOCTYPE html>\n<html>\n  <head>\n    <title>Example</title>\n  </head>\n  <body>\n    <h1>Hello World!</h1>\n    <!-- This is a comment -->\n    <p>This is an example.</p>\n  </body>\n</html>`;
      case 'css':
        return `body {\n  font-family: Arial, sans-serif;\n  margin: 0;\n  padding: 20px;\n}\n\n/* This is a comment */\n.container {\n  max-width: 1200px;\n  margin: 0 auto;\n}`;
      case 'js':
        return `function greet(name) {\n  // This is a comment\n  console.log("Hello, " + name + "!");\n}\n\n/* This is a\n   multiline comment */\nconst user = {\n  firstName: "John",\n  lastName: "Doe"\n};`;
      default:
        return '';
    }
  };

  return (
    <div className="container max-w-4xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <FileCode className="h-5 w-5" />
            HTML/CSS/JS Minifier
          </CardTitle>
          <p className="text-sm text-muted-foreground">Minify code to improve page load speed</p>
        </CardHeader>
        <CardContent>
          <Tabs 
            defaultValue="html" 
            value={activeTab}
            onValueChange={(value) => {
              setActiveTab(value);
              setInput('');
              setOutput('');
              setMinified(false);
            }}
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="html">HTML</TabsTrigger>
              <TabsTrigger value="css">CSS</TabsTrigger>
              <TabsTrigger value="js">JavaScript</TabsTrigger>
            </TabsList>
            
            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Input Code
                </label>
                <textarea
                  className="min-h-[200px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring font-mono"
                  placeholder={getPlaceholder()}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                ></textarea>
              </div>
              
              <Button onClick={handleMinify} disabled={!input.trim()} className="w-full">
                Minify {activeTab.toUpperCase()}
              </Button>
              
              {minified && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="block text-sm font-medium">
                      Minified Output
                    </label>
                    <Button variant="outline" size="sm" onClick={copyToClipboard}>
                      <Copy className="h-4 w-4 mr-2" /> Copy
                    </Button>
                  </div>
                  <textarea
                    className="min-h-[150px] w-full rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm shadow-sm font-mono"
                    value={output}
                    readOnly
                  ></textarea>
                </div>
              )}
              
              <div className="text-xs text-muted-foreground pt-4">
                <p className="mb-1">Notes:</p>
                <ul className="list-disc list-inside pl-4 space-y-1">
                  <li>This is a basic minifier for demonstration purposes.</li>
                  <li>For production use, consider using specialized tools like Terser, UglifyJS, or CleanCSS.</li>
                  <li>Minification may break some complex JavaScript code patterns.</li>
                </ul>
              </div>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CodeMinifierTool;
