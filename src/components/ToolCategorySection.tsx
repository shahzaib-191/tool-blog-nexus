
import { useState, useEffect } from 'react';
import { Tool, getToolsByCategory } from '@/services/toolsService';
import ToolCard from '@/components/ToolCard';
import { Skeleton } from '@/components/ui/skeleton';

interface ToolCategorySectionProps {
  categoryName: string;
}

const ToolCategorySection = ({ categoryName }: ToolCategorySectionProps) => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTools = async () => {
      try {
        setLoading(true);
        const categoryTools = await getToolsByCategory(categoryName);
        setTools(categoryTools);
      } catch (error) {
        console.error(`Error fetching ${categoryName} tools:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchTools();
  }, [categoryName]);

  if (tools.length === 0 && !loading) {
    return null;
  }

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">{categoryName}</h2>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
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
            {tools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ToolCategorySection;
