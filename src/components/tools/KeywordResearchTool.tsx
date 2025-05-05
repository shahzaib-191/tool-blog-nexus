
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, TrendingUp, ArrowDownUp } from 'lucide-react';

const formSchema = z.object({
  keyword: z.string().min(2, "Keyword must be at least 2 characters")
});

type KeywordResult = {
  keyword: string;
  searchVolume: number;
  difficulty: number;
  cpc: number;
  relevance: 'high' | 'medium' | 'low';
};

// Mock keyword research data
const generateKeywordResults = (baseKeyword: string): KeywordResult[] => {
  const variations = [
    { suffix: '', modifier: 1 },
    { suffix: ' online', modifier: 0.8 },
    { suffix: ' best', modifier: 0.9 },
    { suffix: ' how to', modifier: 0.7 },
    { suffix: ' meaning', modifier: 0.5 },
    { suffix: ' near me', modifier: 0.85 },
    { suffix: ' free', modifier: 0.75 },
    { suffix: ' download', modifier: 0.6 },
    { suffix: ' tutorial', modifier: 0.65 },
    { suffix: ' example', modifier: 0.5 },
  ];
  
  return variations.map(v => {
    // Generate semi-random but deterministic values based on the keyword
    const seed = baseKeyword.length + v.suffix.length;
    const searchVolume = Math.floor(1000 * v.modifier * (1 + (seed % 10) / 10));
    const difficulty = Math.floor(Math.min(100, 30 + seed * 3 * v.modifier));
    const cpc = parseFloat((0.5 + seed / 20 * v.modifier).toFixed(2));
    
    let relevance: 'high' | 'medium' | 'low';
    if (v.modifier > 0.8) relevance = 'high';
    else if (v.modifier > 0.6) relevance = 'medium';
    else relevance = 'low';
    
    return {
      keyword: baseKeyword + v.suffix,
      searchVolume,
      difficulty,
      cpc,
      relevance
    };
  });
};

const KeywordResearchTool = () => {
  const [results, setResults] = useState<KeywordResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      keyword: "",
    },
  });
  
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      const keywordResults = generateKeywordResults(data.keyword.trim().toLowerCase());
      setResults(keywordResults);
      setIsLoading(false);
      
      toast({
        title: "Keyword Research Complete",
        description: `Found ${keywordResults.length} keyword suggestions`,
      });
    }, 1500);
  };
  
  const getDifficultyColor = (difficulty: number) => {
    if (difficulty < 40) return "bg-green-100 text-green-800";
    if (difficulty < 70) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };
  
  const getRelevanceBadge = (relevance: 'high' | 'medium' | 'low') => {
    switch (relevance) {
      case 'high':
        return <Badge variant="success">High</Badge>;
      case 'medium':
        return <Badge variant="warning">Medium</Badge>;
      case 'low':
        return <Badge>Low</Badge>;
      default:
        return null;
    }
  };
  
  return (
    <div className="container mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Keyword Research Tool</CardTitle>
          <p className="text-sm text-muted-foreground">Find valuable keywords for your content</p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="keyword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enter a seed keyword</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="e.g., digital marketing" 
                          className="pl-9" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? "Researching..." : "Research Keywords"}
              </Button>
            </form>
          </Form>
          
          {results.length > 0 && (
            <div className="mt-8 overflow-x-auto">
              <h3 className="text-lg font-semibold mb-4">Keyword Suggestions</h3>
              <div className="border rounded-md">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keyword</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Search Vol.
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center">
                          <ArrowDownUp className="h-3 w-3 mr-1" />
                          Difficulty
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CPC ($)</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Relevance</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {results.map((keyword, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {keyword.keyword}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {keyword.searchVolume.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center">
                            <span className={`inline-block w-8 text-center py-0.5 px-1 rounded text-xs font-medium ${getDifficultyColor(keyword.difficulty)}`}>
                              {keyword.difficulty}
                            </span>
                            <div className="ml-2 w-20 bg-gray-200 rounded-full h-2.5">
                              <div 
                                className={`h-2.5 rounded-full ${
                                  keyword.difficulty < 40 ? 'bg-green-500' : 
                                  keyword.difficulty < 70 ? 'bg-yellow-500' : 
                                  'bg-red-500'
                                }`} 
                                style={{ width: `${keyword.difficulty}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          ${keyword.cpc.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {getRelevanceBadge(keyword.relevance)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default KeywordResearchTool;
