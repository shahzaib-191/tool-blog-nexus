
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MainLayout from '@/components/Layout/MainLayout';
import BlogSidebar from '@/components/BlogSidebar';
import ToolCategorySection from '@/components/ToolCategorySection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tool, toolCategories, getAllTools, getTrendingTools } from '@/services/toolsService';
import ToolCard from '@/components/ToolCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  
  const [activeTab, setActiveTab] = useState(initialCategory);
  const [allTools, setAllTools] = useState<Tool[]>([]);
  const [trendingTools, setTrendingTools] = useState<Tool[]>([]);
  const [filteredTools, setFilteredTools] = useState<Tool[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTools = async () => {
      try {
        setLoading(true);
        const [allToolsData, trendingToolsData] = await Promise.all([
          getAllTools(),
          getTrendingTools()
        ]);
        
        setAllTools(allToolsData);
        setTrendingTools(trendingToolsData);
        
        // Initialize filtered tools based on active tab
        if (activeTab === 'trending') {
          setFilteredTools(trendingToolsData);
        } else if (activeTab === 'all') {
          setFilteredTools(allToolsData);
        } else {
          setFilteredTools(allToolsData.filter(tool => tool.category === activeTab));
        }
      } catch (error) {
        console.error('Error fetching tools:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTools();
  }, [activeTab]);

  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const baseTools = activeTab === 'trending' 
        ? trendingTools 
        : activeTab === 'all' 
          ? allTools 
          : allTools.filter(tool => tool.category === activeTab);
          
      setFilteredTools(
        baseTools.filter(
          tool => 
            tool.name.toLowerCase().includes(query) || 
            tool.description.toLowerCase().includes(query)
        )
      );
    } else {
      // Reset to default filtered list based on active tab
      if (activeTab === 'trending') {
        setFilteredTools(trendingTools);
      } else if (activeTab === 'all') {
        setFilteredTools(allTools);
      } else {
        setFilteredTools(allTools.filter(tool => tool.category === activeTab));
      }
    }
  }, [searchQuery, activeTab, allTools, trendingTools]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchParams(value === 'all' ? {} : { category: value });
    setSearchQuery(''); // Reset search when changing tabs
  };

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Powerful Online Tools <span className="text-tool-blue">For Everyone</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Access over 50 free online tools to boost your productivity, enhance your website, 
            and make your digital life easier
          </p>
          
          {/* Search bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="text"
              placeholder="Search for tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 py-6"
            />
          </div>
        </div>
      </section>

      {/* Main content with sidebar */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main tools area */}
          <div className="lg:col-span-3">
            <Tabs defaultValue={activeTab} onValueChange={handleTabChange} value={activeTab} className="mb-8">
              <TabsList className="w-full justify-start overflow-x-auto">
                <TabsTrigger value="all">All Tools</TabsTrigger>
                <TabsTrigger value="trending">Trending</TabsTrigger>
                {toolCategories.map((category) => (
                  <TabsTrigger key={category} value={category}>
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              <TabsContent value={activeTab} className="mt-6">
                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {[...Array(9)].map((_, index) => (
                      <div key={index} className="bg-white rounded-lg shadow p-4">
                        <div className="flex flex-col items-center">
                          <Skeleton className="h-16 w-16 rounded-full mb-4" />
                          <Skeleton className="h-6 w-3/4 mb-2" />
                          <Skeleton className="h-4 w-full mb-4" />
                          <Skeleton className="h-9 w-24" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    {filteredTools.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {filteredTools.map((tool) => (
                          <ToolCard key={tool.id} tool={tool} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No tools found matching "{searchQuery}"</p>
                      </div>
                    )}
                  </>
                )}
              </TabsContent>
            </Tabs>

            {/* Show all categories when "all" is selected and there's no search query */}
            {activeTab === 'all' && !searchQuery && !loading && (
              <div className="space-y-12">
                {toolCategories.map((category) => (
                  <ToolCategorySection key={category} categoryName={category} />
                ))}
              </div>
            )}
          </div>

          {/* Blog sidebar */}
          <div className="lg:col-span-1">
            <BlogSidebar />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default HomePage;
