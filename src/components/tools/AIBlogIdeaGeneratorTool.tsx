
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Lightbulb, ChevronRight, Copy, Check, BookOpen } from "lucide-react";

interface BlogIdea {
  title: string;
  description: string;
  outline: string[];
  keywords: string[];
}

const categories = [
  "Technology",
  "Health & Fitness",
  "Business",
  "Marketing",
  "Personal Finance",
  "Education",
  "Travel",
  "Food & Cooking",
  "Fashion",
  "Self Improvement"
];

const targetAudiences = [
  "General",
  "Beginners",
  "Professionals",
  "Students",
  "Parents",
  "Entrepreneurs",
  "Seniors"
];

const AIBlogIdeaGeneratorTool = () => {
  const [topic, setTopic] = useState('');
  const [category, setCategory] = useState('Technology');
  const [audience, setAudience] = useState('General');
  const [loading, setLoading] = useState(false);
  const [ideas, setIdeas] = useState<BlogIdea[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const { toast } = useToast();

  const handleGenerateIdeas = () => {
    if (!topic.trim()) {
      toast({
        variant: "destructive",
        title: "Topic required",
        description: "Please enter a topic to generate blog ideas."
      });
      return;
    }

    setLoading(true);
    setIdeas([]);

    // Simulate API call with mock data generation
    setTimeout(() => {
      const generatedIdeas = generateMockBlogIdeas(topic, category, audience);
      setIdeas(generatedIdeas);
      setLoading(false);

      toast({
        title: "Ideas Generated",
        description: `${generatedIdeas.length} blog ideas created based on your topic.`
      });
    }, 2000);
  };

  const copyToClipboard = (index: number, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedIndex(index);

    toast({
      title: "Copied to clipboard",
      description: "Blog idea copied to your clipboard."
    });

    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Generate mock blog ideas based on user input
  const generateMockBlogIdeas = (topic: string, category: string, audience: string): BlogIdea[] => {
    const ideas: BlogIdea[] = [];
    
    // Templates for different categories
    const templates = {
      Technology: [
        "The Ultimate Guide to {topic}",
        "{number} Ways {topic} Is Changing the Future",
        "How to Master {topic} in {timeframe}",
        "What Experts Won't Tell You About {topic}",
        "{topic} 101: A Beginner's Guide"
      ],
      "Health & Fitness": [
        "Transform Your {bodypart} with These {topic} Exercises",
        "{number} {topic} Habits That Will Change Your Life",
        "The Science Behind {topic}: What You Need to Know",
        "How to Use {topic} to Improve Your Wellbeing",
        "{topic} vs {alternative}: Which Is Better for Your Health?"
      ],
      Business: [
        "How to Scale Your {topic} Business in {timeframe}",
        "{number} {topic} Strategies That Actually Work",
        "The Future of {topic} in Business",
        "Case Study: How {company} Mastered {topic}",
        "{topic} ROI: Measuring What Matters"
      ]
      // Add more categories as needed
    };

    // Select templates based on category or use general templates
    const selectedTemplates = templates[category as keyof typeof templates] || [
      "The Complete Guide to {topic}",
      "{number} Essential {topic} Tips You Need to Know",
      "How to Use {topic} to Achieve {goal}",
      "Why {topic} Matters: An In-depth Analysis",
      "{topic} vs {alternative}: Which Should You Choose?"
    ];
    
    // Fill in templates with the topic and random values
    for (let i = 0; i < 5; i++) {
      const templateIndex = i % selectedTemplates.length;
      let title = selectedTemplates[templateIndex]
        .replace('{topic}', topic)
        .replace('{number}', String(Math.floor(Math.random() * 15) + 5))
        .replace('{timeframe}', ['30 Days', '2 Weeks', 'One Month', '1 Year'][Math.floor(Math.random() * 4)])
        .replace('{bodypart}', ['Body', 'Core', 'Mind', 'Health'][Math.floor(Math.random() * 4)])
        .replace('{company}', ['Amazon', 'Google', 'Tesla', 'Apple', 'Microsoft'][Math.floor(Math.random() * 5)])
        .replace('{goal}', ['Success', 'Growth', 'Efficiency', 'Productivity'][Math.floor(Math.random() * 4)])
        .replace('{alternative}', generateAlternativeTopic(topic));
      
      // Generate a description based on title and audience
      const description = generateDescription(title, topic, audience);
      
      // Generate an outline
      const outline = generateOutline(title, topic);
      
      // Generate keywords
      const keywords = generateKeywords(topic, category, title);
      
      ideas.push({
        title,
        description,
        outline,
        keywords
      });
    }
    
    return ideas;
  };

  // Helper function to generate alternative topic
  const generateAlternativeTopic = (topic: string): string => {
    const alternatives: Record<string, string[]> = {
      'React': ['Angular', 'Vue', 'Svelte'],
      'JavaScript': ['TypeScript', 'Python', 'Ruby'],
      'SEO': ['PPC', 'Content Marketing', 'Social Media'],
      'running': ['walking', 'swimming', 'cycling'],
      'keto': ['paleo', 'vegan', 'intermittent fasting'],
      'Instagram': ['TikTok', 'YouTube', 'Twitter']
    };
    
    // Try to find a specific alternative for the topic
    const lowerTopic = topic.toLowerCase();
    for (const key in alternatives) {
      if (lowerTopic.includes(key.toLowerCase())) {
        return alternatives[key][Math.floor(Math.random() * alternatives[key].length)];
      }
    }
    
    // Generic alternatives if no specific ones found
    const genericAlternatives = ['Traditional Methods', 'The Competition', 'Manual Approaches', 'Other Options'];
    return genericAlternatives[Math.floor(Math.random() * genericAlternatives.length)];
  };

  // Helper function to generate description
  const generateDescription = (title: string, topic: string, audience: string): string => {
    const audienceMap: Record<string, string> = {
      'General': 'readers',
      'Beginners': 'beginners',
      'Professionals': 'professionals',
      'Students': 'students',
      'Parents': 'parents',
      'Entrepreneurs': 'entrepreneurs',
      'Seniors': 'seniors'
    };
    
    const audienceText = audienceMap[audience] || 'readers';
    
    const templates = [
      `Explore the world of ${topic} in this comprehensive article designed for ${audienceText}. This post will delve into the key aspects that make ${title.toLowerCase()} so relevant today.`,
      `A deep dive into ${topic} tailored for ${audienceText} looking to expand their knowledge. This article covers everything from fundamentals to advanced strategies.`,
      `Discover how ${topic} can transform your approach in this guide specifically written for ${audienceText}. Learn practical tips and insights that you can apply immediately.`,
      `This article breaks down the complexities of ${topic} into digestible information for ${audienceText}. Understand the essentials without the overwhelming jargon.`,
      `An insightful exploration of ${topic} that ${audienceText} will find valuable. This post addresses common challenges and provides actionable solutions.`
    ];
    
    return templates[Math.floor(Math.random() * templates.length)];
  };

  // Helper function to generate outline
  const generateOutline = (title: string, topic: string): string[] => {
    const sections = [
      'Introduction to ' + topic,
      'Why ' + topic + ' Matters',
      'Key Benefits of ' + topic,
      'Common Misconceptions',
      'How to Get Started with ' + topic,
      title.includes('Guide') ? 'Step-by-Step Guide' : 'Best Practices',
      'Case Studies or Examples',
      'Expert Tips and Tricks',
      'Tools and Resources',
      'Conclusion and Next Steps'
    ];
    
    // Randomly select 5-7 sections
    const numSections = Math.floor(Math.random() * 3) + 5;
    const selectedSections = [];
    
    // Always include intro and conclusion
    selectedSections.push(sections[0]);
    
    // Randomly select middle sections
    const middleSections = sections.slice(1, -1).sort(() => 0.5 - Math.random()).slice(0, numSections - 2);
    selectedSections.push(...middleSections);
    
    // Add conclusion
    selectedSections.push(sections[sections.length - 1]);
    
    return selectedSections;
  };

  // Helper function to generate keywords
  const generateKeywords = (topic: string, category: string, title: string): string[] => {
    // Base keywords from topic
    const baseKeywords = [topic.toLowerCase()];
    
    // Add words from title
    const titleWords = title
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(' ')
      .filter(word => word.length > 3 && !baseKeywords.includes(word));
    
    // Add category
    baseKeywords.push(category.toLowerCase());
    
    // Add some related words
    const relatedWords = [
      'guide', 'how to', 'tips', 'tutorial', 'best practices',
      'strategies', 'examples', 'top', 'review', 'analysis'
    ];
    
    // Combine all keywords
    const allKeywords = [
      ...baseKeywords,
      ...titleWords.slice(0, 3),  // Limit to prevent too many title words
      ...relatedWords.sort(() => 0.5 - Math.random()).slice(0, 3)  // Add 3 random related words
    ];
    
    // Remove duplicates and return
    return Array.from(new Set(allKeywords)).slice(0, 8);  // Limit to 8 keywords
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold">AI Blog Idea Generator</h2>
        <p className="text-gray-600 mt-2">
          Generate creative blog post ideas, outlines, and keywords in seconds
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Generate Blog Ideas
          </CardTitle>
          <CardDescription>
            Enter a topic and customize your preferences to generate tailored blog ideas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="topic">Topic or Focus Area</Label>
              <Input
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Digital Marketing, Fitness, React Development"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Blog Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="audience">Target Audience</Label>
                <Select value={audience} onValueChange={setAudience}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select target audience" />
                  </SelectTrigger>
                  <SelectContent>
                    {targetAudiences.map((aud) => (
                      <SelectItem key={aud} value={aud}>{aud}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleGenerateIdeas} 
            disabled={loading || !topic.trim()}
            className="w-full"
          >
            {loading ? 'Generating Ideas...' : 'Generate Blog Ideas'}
          </Button>
        </CardFooter>
      </Card>
      
      {ideas.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-xl font-bold">Generated Blog Ideas</h3>
          
          {ideas.map((idea, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{idea.title}</CardTitle>
                <CardDescription>{idea.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium flex items-center mb-2">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Suggested Outline
                    </h4>
                    <ul className="space-y-2 pl-5 list-disc text-sm">
                      {idea.outline.map((section, i) => (
                        <li key={i}>{section}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Suggested Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                      {idea.keywords.map((keyword, i) => (
                        <div key={i} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">
                          {keyword}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="ml-auto"
                  onClick={() => copyToClipboard(index, `
Title: ${idea.title}

Description: ${idea.description}

Outline:
${idea.outline.map(section => `- ${section}`).join('\n')}

Keywords: ${idea.keywords.join(', ')}
                  `)}
                >
                  {copiedIndex === index ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Idea
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AIBlogIdeaGeneratorTool;
