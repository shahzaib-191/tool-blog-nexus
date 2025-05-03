
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MainLayout from '@/components/Layout/MainLayout';
import { getAllTools, toolCategories, Tool } from '@/services/toolsService';
import ToolCard from '@/components/ToolCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AllToolsPage = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  
  // Get category from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const categoryParam = queryParams.get('category');
  const [activeCategory, setActiveCategory] = useState(categoryParam || "all");
  
  useEffect(() => {
    const fetchTools = async () => {
      try {
        setLoading(true);
        const allTools = await getAllTools();
        setTools(allTools);
      } catch (error) {
        console.error('Error fetching tools:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTools();
  }, []);
  
  // Update active category when URL changes
  useEffect(() => {
    const category = queryParams.get('category');
    if (category) {
      setActiveCategory(category);
    } else {
      setActiveCategory("all");
    }
  }, [location.search]);
  
  const filteredTools = activeCategory === "all" 
    ? tools 
    : tools.filter(tool => tool.category === activeCategory);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">All Tools</h1>
        
        <Tabs value={activeCategory} className="mb-8" onValueChange={setActiveCategory}>
          <TabsList className="mb-6 flex flex-wrap">
            <TabsTrigger value="all">All Categories</TabsTrigger>
            {toolCategories.map(category => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value={activeCategory} className="mt-4">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, index) => (
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredTools.length > 0 ? (
                  filteredTools.map((tool) => (
                    <ToolCard key={tool.id} tool={tool} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12 text-gray-500">
                    No tools found in this category.
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default AllToolsPage;
