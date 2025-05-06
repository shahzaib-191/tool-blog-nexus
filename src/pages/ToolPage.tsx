
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '@/components/Layout/MainLayout';
import { getToolById, Tool } from '@/services/toolsService';
import { getToolComponent } from '@/components/tools/ToolComponentMap';
import ToolHeader from '@/components/tools/ToolHeader';
import ToolLoading from '@/components/tools/ToolLoading';
import ToolNotFound from '@/components/tools/ToolNotFound';

const ToolPage = () => {
  const { toolId } = useParams<{ toolId: string }>();
  const [tool, setTool] = useState<Tool | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTool = async () => {
      if (!toolId) return;
      
      try {
        setLoading(true);
        const toolData = await getToolById(toolId);
        setTool(toolData || null);
      } catch (error) {
        console.error('Error fetching tool:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTool();
  }, [toolId]);

  // Get the component for this tool
  const ToolComponent = getToolComponent(toolId);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <ToolLoading />
        ) : tool ? (
          <>
            <ToolHeader tool={tool} />
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <ToolComponent />
            </div>
          </>
        ) : (
          <ToolNotFound />
        )}
      </div>
    </MainLayout>
  );
};

export default ToolPage;
