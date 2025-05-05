
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save, Download, Upload, Trash, Copy, FileEdit } from 'lucide-react';

const OnlineNotepadTool = () => {
  const [text, setText] = useState<string>('');
  const [savedText, setSavedText] = useState<string>('');
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  
  // Load saved content from localStorage on initial mount
  useEffect(() => {
    const savedContent = localStorage.getItem('online-notepad-content');
    if (savedContent) {
      setText(savedContent);
      setSavedText(savedContent);
      
      const savedTime = localStorage.getItem('online-notepad-saved-time');
      if (savedTime) {
        setLastSaved(savedTime);
      }
    }
  }, []);
  
  const handleSave = () => {
    try {
      localStorage.setItem('online-notepad-content', text);
      
      const now = new Date().toLocaleString();
      localStorage.setItem('online-notepad-saved-time', now);
      
      setSavedText(text);
      setLastSaved(now);
      
      toast({
        title: "Saved",
        description: "Your note has been saved in your browser",
      });
    } catch (error) {
      toast({
        title: "Save failed",
        description: "Could not save your note. Your browser storage might be full.",
        variant: "destructive",
      });
    }
  };
  
  const handleClear = () => {
    if (text && text !== savedText) {
      if (!window.confirm("You have unsaved changes. Are you sure you want to clear everything?")) {
        return;
      }
    }
    
    setText('');
    toast({
      title: "Cleared",
      description: "Notepad content has been cleared",
    });
  };
  
  const handleDownload = () => {
    try {
      const blob = new Blob([text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'notepad-' + new Date().toISOString().split('T')[0] + '.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Downloaded",
        description: "Your note has been downloaded as a text file",
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Could not download your note",
        variant: "destructive",
      });
    }
  };
  
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum file size is 1MB",
        variant: "destructive",
      });
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setText(content);
      toast({
        title: "File loaded",
        description: `"${file.name}" has been loaded into the editor`,
      });
    };
    reader.readAsText(file);
    
    // Reset the input value so the same file can be uploaded again
    e.target.value = '';
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Text copied to clipboard",
    });
  };

  return (
    <div className="container max-w-4xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <FileEdit className="h-5 w-5" />
            Online Notepad
          </CardTitle>
          <p className="text-sm text-muted-foreground">Take notes online without installing any software</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2 justify-between items-center">
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" /> Save
              </Button>
              <Button variant="outline" onClick={handleClear}>
                <Trash className="h-4 w-4 mr-2" /> Clear
              </Button>
              <Button variant="outline" onClick={copyToClipboard}>
                <Copy className="h-4 w-4 mr-2" /> Copy
              </Button>
              <Button variant="outline" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" /> Download
              </Button>
              <div className="relative">
                <Button variant="outline" onClick={() => document.getElementById('file-upload')?.click()}>
                  <Upload className="h-4 w-4 mr-2" /> Upload
                </Button>
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept=".txt,.md,.text"
                  onChange={handleUpload}
                />
              </div>
            </div>
            
            {lastSaved && (
              <span className="text-xs text-muted-foreground">
                Last saved: {lastSaved}
              </span>
            )}
          </div>
          
          <textarea
            className="min-h-[400px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring font-mono resize-y"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Start typing your notes here..."
          ></textarea>
          
          <div className="text-xs text-muted-foreground flex justify-between">
            <span>Character count: {text.length}</span>
            <span>Word count: {text.split(/\s+/).filter(Boolean).length}</span>
            <span>Line count: {text.split('\n').length}</span>
          </div>
          
          <div className="text-xs text-muted-foreground text-center">
            Note: Your content is stored locally in your browser. Clearing browser data will delete unsaved notes.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnlineNotepadTool;
