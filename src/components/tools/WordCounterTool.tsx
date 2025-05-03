
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';

const WordCounterTool = () => {
  const [text, setText] = useState('');
  const wordCount = text ? text.trim().split(/\s+/).filter(Boolean).length : 0;
  const charCount = text.length;
  const sentenceCount = text ? text.split(/[.!?]+/).filter(Boolean).length : 0;
  const paragraphCount = text ? text.split(/\n+/).filter(Boolean).length : 0;
  
  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="text" className="block text-sm font-medium mb-2">
          Enter your text
        </label>
        <textarea
          id="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste your text here..."
          className="w-full p-3 border border-gray-300 rounded-md min-h-[200px]"
        />
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-tool-blue">{wordCount}</div>
            <div className="text-sm text-gray-500">Words</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-tool-blue">{charCount}</div>
            <div className="text-sm text-gray-500">Characters</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-tool-blue">{sentenceCount}</div>
            <div className="text-sm text-gray-500">Sentences</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-tool-blue">{paragraphCount}</div>
            <div className="text-sm text-gray-500">Paragraphs</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WordCounterTool;
