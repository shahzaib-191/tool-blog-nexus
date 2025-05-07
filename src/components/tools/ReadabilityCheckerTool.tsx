
import { useState } from 'react';
import ToolHeader from './ToolHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Gauge, FileText, BookOpen, AlertCircle, CheckCircle2, Copy } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

type ReadabilityScore = {
  fleschReadingEase: number;
  fleschKincaidGrade: number;
  smogIndex: number;
  colemanLiauIndex: number;
  automatedReadabilityIndex: number;
  averageGradeLevel: number;
};

type TextStatistics = {
  wordCount: number;
  sentenceCount: number;
  paragraphCount: number;
  characterCount: number;
  syllableCount: number;
  averageWordLength: number;
  averageSentenceLength: number;
};

type ReadabilityIssue = {
  type: 'sentence_length' | 'paragraph_length' | 'passive_voice' | 'complex_word' | 'jargon';
  description: string;
  suggestion: string;
};

const ReadabilityCheckerTool = () => {
  const { toast } = useToast();
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [readabilityScores, setReadabilityScores] = useState<ReadabilityScore | null>(null);
  const [textStats, setTextStats] = useState<TextStatistics | null>(null);
  const [issues, setIssues] = useState<ReadabilityIssue[]>([]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const analyzeText = () => {
    if (!text.trim()) {
      toast({
        title: "Empty Text",
        description: "Please enter some text to analyze.",
        variant: "destructive",
      });
      return;
    }
    
    setIsAnalyzing(true);
    
    // Simulate processing delay
    setTimeout(() => {
      const stats = analyzeTextStatistics(text);
      setTextStats(stats);
      
      const scores = calculateReadabilityScores(stats);
      setReadabilityScores(scores);
      
      const detectedIssues = findReadabilityIssues(text, stats);
      setIssues(detectedIssues);
      
      setIsAnalyzing(false);
      
      toast({
        title: "Analysis Complete",
        description: `Your text has an average grade level of ${scores.averageGradeLevel.toFixed(1)}.`,
      });
    }, 1500);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to Clipboard",
      description: "Text has been copied to your clipboard.",
    });
  };

  const clearText = () => {
    setText('');
    setReadabilityScores(null);
    setTextStats(null);
    setIssues([]);
  };

  // Text analysis functions
  const analyzeTextStatistics = (text: string): TextStatistics => {
    // Clean the text for analysis
    const cleanText = text.trim();
    
    // Count words: split by whitespace
    const words = cleanText.split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;
    
    // Count sentences: split by periods, question marks, exclamation points
    // This is a simplification and might not catch all edge cases
    const sentences = cleanText.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
    const sentenceCount = Math.max(1, sentences.length);
    
    // Count paragraphs: split by double line breaks
    const paragraphs = cleanText.split(/\n\s*\n/).filter(para => para.trim().length > 0);
    const paragraphCount = Math.max(1, paragraphs.length);
    
    // Count characters (excluding spaces)
    const characterCount = cleanText.replace(/\s+/g, '').length;
    
    // Estimate syllable count (simplified algorithm)
    const syllableCount = estimateSyllables(cleanText);
    
    // Calculate averages
    const averageWordLength = characterCount / Math.max(1, wordCount);
    const averageSentenceLength = wordCount / Math.max(1, sentenceCount);
    
    return {
      wordCount,
      sentenceCount,
      paragraphCount,
      characterCount,
      syllableCount,
      averageWordLength,
      averageSentenceLength
    };
  };
  
  // Very simplified syllable counting algorithm
  const estimateSyllables = (text: string): number => {
    const words = text.toLowerCase().split(/\s+/).filter(word => word.length > 0);
    
    let syllableCount = 0;
    for (const word of words) {
      // Count vowel groups as syllables
      const vowelGroups = word.match(/[aeiouy]+/g);
      let count = vowelGroups ? vowelGroups.length : 1;
      
      // Adjust for common patterns
      if (word.length > 3 && word.endsWith('e')) {
        count -= 1;
      }
      
      // Ensure at least one syllable per word
      syllableCount += Math.max(1, count);
    }
    
    return syllableCount;
  };
  
  const calculateReadabilityScores = (stats: TextStatistics): ReadabilityScore => {
    // Flesch Reading Ease
    // Higher scores = easier to read (90-100: Very Easy, 0-30: Very Difficult)
    const fleschReadingEase = 206.835 - 1.015 * (stats.wordCount / stats.sentenceCount) - 84.6 * (stats.syllableCount / stats.wordCount);
    
    // Flesch-Kincaid Grade Level
    // Corresponds to US grade level
    const fleschKincaidGrade = 0.39 * (stats.wordCount / stats.sentenceCount) + 11.8 * (stats.syllableCount / stats.wordCount) - 15.59;
    
    // SMOG Index
    // Estimates years of education needed to understand the text
    const smogIndex = 1.043 * Math.sqrt(stats.syllableCount * (30 / stats.sentenceCount)) + 3.1291;
    
    // Coleman-Liau Index
    // Based on characters instead of syllables
    const colemanLiauIndex = 5.89 * (stats.characterCount / stats.wordCount) - 0.3 * (stats.sentenceCount / stats.wordCount) - 15.8;
    
    // Automated Readability Index
    const automatedReadabilityIndex = 4.71 * (stats.characterCount / stats.wordCount) + 0.5 * (stats.wordCount / stats.sentenceCount) - 21.43;
    
    // Calculate average grade level
    const averageGradeLevel = (fleschKincaidGrade + smogIndex + colemanLiauIndex + automatedReadabilityIndex) / 4;
    
    return {
      fleschReadingEase: Math.max(0, Math.min(100, fleschReadingEase)),
      fleschKincaidGrade: Math.max(0, fleschKincaidGrade),
      smogIndex: Math.max(0, smogIndex),
      colemanLiauIndex: Math.max(0, colemanLiauIndex),
      automatedReadabilityIndex: Math.max(0, automatedReadabilityIndex),
      averageGradeLevel: Math.max(0, averageGradeLevel)
    };
  };
  
  const findReadabilityIssues = (text: string, stats: TextStatistics): ReadabilityIssue[] => {
    const issues: ReadabilityIssue[] = [];
    
    // Check for long sentences
    if (stats.averageSentenceLength > 20) {
      issues.push({
        type: 'sentence_length',
        description: 'Your sentences are too long on average.',
        suggestion: 'Try to keep sentences under 20 words for better readability.'
      });
    }
    
    // Check for long paragraphs
    if (stats.wordCount / stats.paragraphCount > 100) {
      issues.push({
        type: 'paragraph_length',
        description: 'Your paragraphs contain too many words on average.',
        suggestion: 'Break up long paragraphs into smaller chunks of 3-5 sentences.'
      });
    }
    
    // Check for passive voice (simplified check)
    const passiveVoicePattern = /\b(am|is|are|was|were|be|being|been)\s+(\w+ed|built|done|grown|known|worn)\b/gi;
    const passiveMatches = text.match(passiveVoicePattern);
    if (passiveMatches && passiveMatches.length > 1) {
      issues.push({
        type: 'passive_voice',
        description: 'Your text contains multiple instances of passive voice.',
        suggestion: 'Use active voice for clearer, more engaging writing.'
      });
    }
    
    // Check for complex words
    const complexWordPatterns = /\b\w{13,}\b/g;
    const complexMatches = text.match(complexWordPatterns);
    if (complexMatches && complexMatches.length > 2) {
      issues.push({
        type: 'complex_word',
        description: 'Your text contains several long, complex words.',
        suggestion: 'Use simpler alternatives for complex words where possible.'
      });
    }
    
    // Check for technical jargon (simplified)
    const jargonPatterns = /\b(paradigm|leverage|synergy|optimize|utilize|implementation|functionality|interface)\b/gi;
    const jargonMatches = text.match(jargonPatterns);
    if (jargonMatches && jargonMatches.length > 0) {
      issues.push({
        type: 'jargon',
        description: 'Your text contains technical jargon or business buzzwords.',
        suggestion: 'Replace jargon with plain language that your audience will understand.'
      });
    }
    
    return issues;
  };
  
  const getScoreDescription = (score: number): string => {
    if (score >= 90) return "Very Easy - 5th Grade";
    if (score >= 80) return "Easy - 6th Grade";
    if (score >= 70) return "Fairly Easy - 7th Grade";
    if (score >= 60) return "Standard - 8th & 9th Grade";
    if (score >= 50) return "Fairly Difficult - 10th to 12th Grade";
    if (score >= 30) return "Difficult - College Level";
    return "Very Difficult - College Graduate";
  };
  
  const getScoreColor = (score: number): string => {
    if (score >= 80) return "text-green-500"; 
    if (score >= 60) return "text-blue-500";
    if (score >= 40) return "text-yellow-500";
    return "text-red-500";
  };
  
  const getGradeColor = (grade: number): string => {
    if (grade <= 8) return "text-green-500";
    if (grade <= 12) return "text-blue-500";
    if (grade <= 16) return "text-yellow-500";
    return "text-red-500"; 
  };
  
  const getGaugeColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-blue-500";
    if (score >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <>
      <ToolHeader
        title="Readability Checker"
        description="Analyze and improve your text's readability to ensure it's accessible to your target audience."
      />
      
      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardContent className="pt-6 space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-2">
                <div className="space-y-2">
                  <label htmlFor="text-input" className="text-sm font-medium">
                    Enter your text
                  </label>
                  <div className="relative">
                    <Textarea
                      id="text-input"
                      value={text}
                      onChange={handleTextChange}
                      placeholder="Paste or type your text here to analyze its readability..."
                      className="min-h-[300px] font-sans"
                    />
                    {text && (
                      <div className="absolute top-2 right-2 flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 px-2 text-muted-foreground"
                          onClick={copyToClipboard}
                        >
                          <Copy className="h-3.5 w-3.5 mr-1" />
                          Copy
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 px-2 text-muted-foreground"
                          onClick={clearText}
                        >
                          Clear
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-muted-foreground">
                      {textStats ? `${textStats.wordCount} words, ${textStats.sentenceCount} sentences` : 'Enter text to analyze readability'}
                    </p>
                    <Button 
                      onClick={analyzeText} 
                      disabled={!text.trim() || isAnalyzing}
                    >
                      {isAnalyzing ? 'Analyzing...' : 'Analyze Readability'}
                    </Button>
                  </div>
                </div>
                
                {readabilityScores && (
                  <div className="mt-8">
                    <Tabs defaultValue="scores">
                      <TabsList className="mb-6">
                        <TabsTrigger value="scores">Readability Scores</TabsTrigger>
                        <TabsTrigger value="statistics">Text Statistics</TabsTrigger>
                        <TabsTrigger value="issues">Issues & Suggestions</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="scores" className="space-y-6">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="p-4 rounded-lg border space-y-4">
                            <h3 className="font-medium text-lg">Flesch Reading Ease</h3>
                            <div className="flex justify-center">
                              <div className="relative h-32 w-32">
                                <svg viewBox="0 0 100 100" className="transform -rotate-90 h-full w-full">
                                  <circle 
                                    cx="50" cy="50" r="45" fill="none" 
                                    stroke="#e5e7eb" 
                                    strokeWidth="10"
                                  />
                                  <circle 
                                    cx="50" cy="50" r="45" fill="none" 
                                    stroke={getGaugeColor(readabilityScores.fleschReadingEase)} 
                                    strokeWidth="10"
                                    strokeDasharray="282.7"
                                    strokeDashoffset={282.7 - (282.7 * readabilityScores.fleschReadingEase / 100)}
                                    strokeLinecap="round"
                                  />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <span className={`text-3xl font-bold ${getScoreColor(readabilityScores.fleschReadingEase)}`}>
                                    {Math.round(readabilityScores.fleschReadingEase)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <p className="text-center">
                              {getScoreDescription(readabilityScores.fleschReadingEase)}
                            </p>
                          </div>
                          
                          <div className="p-4 rounded-lg border">
                            <h3 className="font-medium text-lg mb-4">Grade Level Scores</h3>
                            <ul className="space-y-4">
                              <li className="flex justify-between items-center">
                                <span>Flesch-Kincaid:</span>
                                <span className={getGradeColor(readabilityScores.fleschKincaidGrade)}>
                                  Grade {readabilityScores.fleschKincaidGrade.toFixed(1)}
                                </span>
                              </li>
                              <li className="flex justify-between items-center">
                                <span>SMOG Index:</span>
                                <span className={getGradeColor(readabilityScores.smogIndex)}>
                                  Grade {readabilityScores.smogIndex.toFixed(1)}
                                </span>
                              </li>
                              <li className="flex justify-between items-center">
                                <span>Coleman-Liau:</span>
                                <span className={getGradeColor(readabilityScores.colemanLiauIndex)}>
                                  Grade {readabilityScores.colemanLiauIndex.toFixed(1)}
                                </span>
                              </li>
                              <li className="flex justify-between items-center">
                                <span>ARI:</span>
                                <span className={getGradeColor(readabilityScores.automatedReadabilityIndex)}>
                                  Grade {readabilityScores.automatedReadabilityIndex.toFixed(1)}
                                </span>
                              </li>
                              <li className="flex justify-between items-center pt-2 border-t font-medium">
                                <span>Average Grade Level:</span>
                                <span className={getGradeColor(readabilityScores.averageGradeLevel)}>
                                  Grade {readabilityScores.averageGradeLevel.toFixed(1)}
                                </span>
                              </li>
                            </ul>
                          </div>
                        </div>
                        
                        <div className="p-4 rounded-lg bg-blue-50 space-y-2">
                          <h3 className="font-medium text-blue-800">What These Scores Mean:</h3>
                          <p className="text-sm text-blue-700">
                            The Flesch Reading Ease score indicates how easy your text is to read.
                            Higher scores (90-100) mean the text is very easy to read, suitable for 5th graders.
                            Lower scores (0-30) suggest the text is very difficult, appropriate for college graduates.
                          </p>
                          <p className="text-sm text-blue-700">
                            Grade level scores estimate the U.S. school grade level required to understand your text.
                            For general audiences, aim for grades 7-9. For specialized or academic content, grades 10-12 may be appropriate.
                          </p>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="statistics">
                        {textStats && (
                          <div className="space-y-6">
                            <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
                              <div className="p-4 rounded-lg border text-center">
                                <p className="text-muted-foreground text-sm mb-1">Words</p>
                                <p className="text-2xl font-bold">{textStats.wordCount}</p>
                              </div>
                              
                              <div className="p-4 rounded-lg border text-center">
                                <p className="text-muted-foreground text-sm mb-1">Characters</p>
                                <p className="text-2xl font-bold">{textStats.characterCount}</p>
                              </div>
                              
                              <div className="p-4 rounded-lg border text-center">
                                <p className="text-muted-foreground text-sm mb-1">Sentences</p>
                                <p className="text-2xl font-bold">{textStats.sentenceCount}</p>
                              </div>
                              
                              <div className="p-4 rounded-lg border text-center">
                                <p className="text-muted-foreground text-sm mb-1">Paragraphs</p>
                                <p className="text-2xl font-bold">{textStats.paragraphCount}</p>
                              </div>
                            </div>
                            
                            <div className="space-y-4">
                              <h3 className="font-medium">Text Analysis</h3>
                              
                              <div className="space-y-4">
                                <div>
                                  <div className="mb-1 flex justify-between text-sm">
                                    <span>Average Word Length</span>
                                    <span>{textStats.averageWordLength.toFixed(1)} characters</span>
                                  </div>
                                  <Progress value={Math.min(100, textStats.averageWordLength * 20)} className="h-2" />
                                </div>
                                
                                <div>
                                  <div className="mb-1 flex justify-between text-sm">
                                    <span>Average Sentence Length</span>
                                    <span>{textStats.averageSentenceLength.toFixed(1)} words</span>
                                  </div>
                                  <Progress value={Math.min(100, textStats.averageSentenceLength * 4)} className="h-2" />
                                </div>
                                
                                <div>
                                  <div className="mb-1 flex justify-between text-sm">
                                    <span>Estimated Syllables</span>
                                    <span>{textStats.syllableCount}</span>
                                  </div>
                                  <Progress value={Math.min(100, textStats.syllableCount / textStats.wordCount * 50)} className="h-2" />
                                </div>
                                
                                <div>
                                  <div className="mb-1 flex justify-between text-sm">
                                    <span>Words per Paragraph</span>
                                    <span>{(textStats.wordCount / textStats.paragraphCount).toFixed(1)} words</span>
                                  </div>
                                  <Progress 
                                    value={Math.min(100, (textStats.wordCount / textStats.paragraphCount) / 2)} 
                                    className="h-2" 
                                  />
                                </div>
                              </div>
                            </div>
                            
                            <div className="p-4 rounded-lg bg-blue-50 space-y-2">
                              <h3 className="font-medium text-blue-800">Readability Tips:</h3>
                              <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                                <li>Aim for an average sentence length of 15-20 words</li>
                                <li>Use shorter paragraphs (3-5 sentences) to improve readability</li>
                                <li>Choose shorter words when possible</li>
                                <li>Vary sentence length to maintain reader interest</li>
                                <li>Break up text with headings, lists, and bullet points</li>
                              </ul>
                            </div>
                          </div>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="issues">
                        <div className="space-y-6">
                          <div>
                            <h3 className="font-medium mb-4">
                              {issues.length > 0 ? `Readability Issues (${issues.length})` : 'No Issues Found'}
                            </h3>
                            
                            {issues.length > 0 ? (
                              <div className="divide-y">
                                {issues.map((issue, index) => (
                                  <div key={index} className="py-4 space-y-2">
                                    <div className="flex items-start">
                                      <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                                      <div>
                                        <p className="font-medium">{issue.description}</p>
                                        <p className="text-sm text-muted-foreground">{issue.suggestion}</p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="flex items-center justify-center p-4 bg-green-50 rounded-md">
                                <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" />
                                <p className="text-green-700">
                                  No major readability issues detected! Your text appears to be well-structured.
                                </p>
                              </div>
                            )}
                          </div>
                          
                          <div className="space-y-3">
                            <h3 className="font-medium">Readability Improvement Tips</h3>
                            <ul className="space-y-2">
                              <li className="flex items-start">
                                <CheckCircle2 className="h-4 w-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                                <p className="text-sm">Use shorter sentences and paragraphs to improve clarity.</p>
                              </li>
                              <li className="flex items-start">
                                <CheckCircle2 className="h-4 w-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                                <p className="text-sm">Choose simpler words over complex ones when possible.</p>
                              </li>
                              <li className="flex items-start">
                                <CheckCircle2 className="h-4 w-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                                <p className="text-sm">Use active voice instead of passive voice for clearer communication.</p>
                              </li>
                              <li className="flex items-start">
                                <CheckCircle2 className="h-4 w-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                                <p className="text-sm">Break up dense text with headings, lists, and bullet points.</p>
                              </li>
                              <li className="flex items-start">
                                <CheckCircle2 className="h-4 w-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                                <p className="text-sm">Avoid jargon, technical terms, and acronyms unless necessary for your audience.</p>
                              </li>
                              <li className="flex items-start">
                                <CheckCircle2 className="h-4 w-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                                <p className="text-sm">Use transitional phrases to connect ideas and improve flow.</p>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                )}
              </div>
              
              <div>
                <div className="sticky top-4 space-y-4">
                  <div className="p-4 border rounded-lg bg-background">
                    <h3 className="font-semibold text-lg mb-4">Readability Target Audience</h3>
                    <div className="space-y-6">
                      <div>
                        <p className="mb-2 text-sm">General Public</p>
                        <div className="flex items-center">
                          <div className="h-2.5 flex-grow rounded-l-full bg-green-500"></div>
                          <div className="h-2.5 flex-grow bg-blue-500"></div>
                          <div className="h-2.5 flex-grow rounded-r-full bg-gray-200"></div>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">Grades 4-9</p>
                      </div>
                      
                      <div>
                        <p className="mb-2 text-sm">College Educated</p>
                        <div className="flex items-center">
                          <div className="h-2.5 flex-grow rounded-l-full bg-gray-200"></div>
                          <div className="h-2.5 flex-grow bg-blue-500"></div>
                          <div className="h-2.5 flex-grow rounded-r-full bg-red-500"></div>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">Grades 10-16</p>
                      </div>
                      
                      <div>
                        <p className="mb-2 text-sm">Professional/Academic</p>
                        <div className="flex items-center">
                          <div className="h-2.5 flex-grow rounded-l-full bg-gray-200"></div>
                          <div className="h-2.5 flex-grow bg-gray-200"></div>
                          <div className="h-2.5 flex-grow rounded-r-full bg-red-500"></div>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">Grades 12+</p>
                      </div>
                    </div>
                    
                    {readabilityScores && (
                      <div className="mt-6 p-3 bg-primary/5 rounded-lg">
                        <p className="text-sm font-medium">Your Content Level:</p>
                        <p className="text-xl font-bold mt-1">
                          Grade {Math.round(readabilityScores.averageGradeLevel)}
                          <span className="text-sm font-normal text-muted-foreground ml-2">
                            ({readabilityScores.averageGradeLevel < 8 ? 'Easy' : 
                              readabilityScores.averageGradeLevel < 12 ? 'Moderate' : 'Advanced'})
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg text-sm">
                    <h4 className="font-medium text-blue-800 mb-2">Why Readability Matters:</h4>
                    <ul className="list-disc list-inside text-blue-700 space-y-1">
                      <li>Increases reader engagement</li>
                      <li>Improves understanding and retention</li>
                      <li>Makes content accessible to wider audiences</li>
                      <li>Boosts conversion rates on marketing content</li>
                      <li>Enhances SEO performance</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ReadabilityCheckerTool;
