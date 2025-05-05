
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, FileText, AlertTriangle, Check, Info } from 'lucide-react';

interface PlagiarismResult {
  score: number;
  matches: {
    text: string;
    similarity: number;
    source: string;
  }[];
}

const PlagiarismCheckerTool = () => {
  const [text, setText] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<PlagiarismResult | null>(null);
  const { toast } = useToast();

  const handleCheck = () => {
    if (text.trim().length < 50) {
      toast({
        variant: "destructive",
        title: "Text too short",
        description: "Please enter at least 50 characters to check for plagiarism."
      });
      return;
    }

    setIsChecking(true);
    setResult(null);
    setProgress(0);

    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 300);

    // Simulate API call with mock data
    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      
      // Analyze text length and content for mock results
      const words = text.trim().split(/\s+/).length;
      
      // Generate mock result based on text content
      const mockResult: PlagiarismResult = {
        score: generateMockScore(text),
        matches: generateMockMatches(text)
      };
      
      setResult(mockResult);
      setIsChecking(false);
      
      toast({
        title: "Analysis Complete",
        description: `Plagiarism check completed for ${words} words.`,
      });
    }, 3500);
  };

  // Generate a mock similarity score based on text content
  const generateMockScore = (text: string): number => {
    // Simple mock logic - longer texts get lower plagiarism scores
    const length = text.length;
    const baseScore = Math.max(0, 40 - (length / 100));
    
    // Add some randomness
    const randomFactor = Math.random() * 20;
    
    // Check for common phrases that might indicate higher plagiarism
    const commonPhrases = [
      "according to research",
      "studies have shown",
      "in conclusion",
      "as a result",
      "it is important to note"
    ];
    
    let phraseBonus = 0;
    commonPhrases.forEach(phrase => {
      if (text.toLowerCase().includes(phrase.toLowerCase())) {
        phraseBonus += 5;
      }
    });
    
    return Math.min(95, Math.max(0, baseScore + randomFactor + phraseBonus));
  };

  // Generate mock matching segments
  const generateMockMatches = (text: string) => {
    const matches = [];
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    const sources = [
      "Wikipedia.org",
      "Academic Journal of Science",
      "research-papers.edu",
      "educational-resources.com",
      "thesis-database.org"
    ];
    
    // Select 1-3 sentences to mark as "plagiarized"
    const maxMatches = Math.min(3, sentences.length);
    const numMatches = Math.max(1, Math.floor(Math.random() * maxMatches));
    
    const selectedIndexes = new Set<number>();
    while (selectedIndexes.size < numMatches) {
      selectedIndexes.add(Math.floor(Math.random() * sentences.length));
    }
    
    Array.from(selectedIndexes).forEach(index => {
      if (sentences[index].length > 10) {
        matches.push({
          text: sentences[index],
          similarity: 70 + Math.floor(Math.random() * 25),
          source: sources[Math.floor(Math.random() * sources.length)]
        });
      }
    });
    
    return matches;
  };

  const getSeverityLabel = (score: number) => {
    if (score < 20) return { label: "Low", color: "text-green-600" };
    if (score < 40) return { label: "Moderate", color: "text-yellow-600" };
    return { label: "High", color: "text-red-600" };
  };
  
  const getSeverityProgressColor = (score: number) => {
    if (score < 20) return "bg-green-600";
    if (score < 40) return "bg-yellow-600";
    return "bg-red-600";
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold">Plagiarism Checker</h2>
        <p className="text-gray-600 mt-2">
          Check your content for potential plagiarism and ensure originality
        </p>
      </div>
      
      <div className="space-y-4">
        <Textarea
          placeholder="Paste your text here to check for plagiarism (minimum 50 characters)..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="min-h-[200px]"
        />
        
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {text.trim().split(/\s+/).length} words | {text.length} characters
          </div>
          <Button 
            onClick={handleCheck} 
            disabled={isChecking || text.trim().length < 50}
          >
            {isChecking ? 'Checking...' : 'Check for Plagiarism'}
            {!isChecking && <Search className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      </div>
      
      {isChecking && (
        <div className="space-y-2">
          <div className="text-sm font-medium">Analyzing content...</div>
          <Progress value={progress} className="h-2" />
          <div className="text-xs text-gray-500 text-right">{progress}%</div>
        </div>
      )}
      
      {result && (
        <div className="space-y-6 mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText size={20} />
                Plagiarism Analysis Results
              </CardTitle>
              <CardDescription>
                Summary of plagiarism detection for your content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="relative w-32 h-32 mx-auto md:mx-0">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                      className="text-gray-200 stroke-current"
                      strokeWidth="10"
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                    ></circle>
                    <circle
                      className={`${getSeverityProgressColor(result.score)} stroke-current`}
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={`${result.score * 2.51} 251.2`}
                      strokeDashoffset="0"
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      transform="rotate(-90 50 50)"
                    ></circle>
                    <text x="50" y="50" fontFamily="Verdana" fontSize="20" textAnchor="middle" alignmentBaseline="middle">{result.score}%</text>
                  </svg>
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl font-bold mb-2">
                    <span className={getSeverityLabel(result.score).color}>
                      {getSeverityLabel(result.score).label} Plagiarism Detected
                    </span>
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {result.score < 20 ? (
                      "Your content appears to be mostly original. Good job!"
                    ) : result.score < 40 ? (
                      "Some potential plagiarism detected. Consider revising highlighted sections."
                    ) : (
                      "Significant plagiarism detected. Major revisions recommended."
                    )}
                  </p>
                  <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                    <div className="bg-gray-50 px-4 py-2 rounded-md">
                      <div className="text-sm text-gray-500">Word Count</div>
                      <div className="font-medium">{text.trim().split(/\s+/).length}</div>
                    </div>
                    <div className="bg-gray-50 px-4 py-2 rounded-md">
                      <div className="text-sm text-gray-500">Matches Found</div>
                      <div className="font-medium">{result.matches.length}</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {result.matches.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle size={20} />
                  Potential Matches
                </CardTitle>
                <CardDescription>
                  Content segments that may be similar to existing sources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Matched Text</TableHead>
                      <TableHead>Similarity</TableHead>
                      <TableHead>Potential Source</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.matches.map((match, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{match.text}</TableCell>
                        <TableCell>
                          <span className={match.similarity > 80 ? "text-red-600" : "text-yellow-600"}>
                            {match.similarity}%
                          </span>
                        </TableCell>
                        <TableCell>{match.source}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info size={20} />
                Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 list-disc pl-5">
                {result.score < 20 ? (
                  <>
                    <li>Your content appears largely original. Great work!</li>
                    <li>Consider citing any referenced works even if rewritten.</li>
                    <li>Continue to maintain high standards of originality in your writing.</li>
                  </>
                ) : result.score < 40 ? (
                  <>
                    <li>Review highlighted sections and consider rewriting them.</li>
                    <li>Add proper citations and references where needed.</li>
                    <li>Use quotation marks for direct quotes from other sources.</li>
                    <li>Paraphrase content in your own words.</li>
                  </>
                ) : (
                  <>
                    <li>Significant rewriting is recommended to avoid plagiarism issues.</li>
                    <li>Use proper citations for all referenced materials.</li>
                    <li>Consider restructuring your content approach entirely.</li>
                    <li>Use quotes for direct references and always cite sources.</li>
                    <li>Check your institution's or publication's plagiarism policies.</li>
                  </>
                )}
              </ul>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-gray-500">
                <Check className="inline h-4 w-4 mr-1" />
                This is a simulation for educational purposes. For professional plagiarism checking, use specialized services.
              </p>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PlagiarismCheckerTool;
