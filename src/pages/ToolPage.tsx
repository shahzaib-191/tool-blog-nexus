
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '@/components/Layout/MainLayout';
import { getToolById, Tool } from '@/services/toolsService';
import { getToolComponent } from '@/components/tools/ToolComponentMap';
import ToolLoading from '@/components/tools/ToolLoading';
import ToolNotFound from '@/components/tools/ToolNotFound';

const ToolPage = () => {
  const { toolId } = useParams<{ toolId: string }>();
  const [tool, setTool] = useState<Tool | null>(null);
  const [loading, setLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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

  // Check if this is a network tool (whois or dns lookup) for special styling
  const isNetworkTool = toolId === 'whois-lookup' || toolId === 'dns-lookup';

  // Handle mouse movement for spider animation
  useEffect(() => {
    if (!isNetworkTool) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    if (isNetworkTool) {
      createSpiderNodes();
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      removeSpiderNodes();
    };
  }, [isNetworkTool]);

  // Create spider cursor
  useEffect(() => {
    if (!isNetworkTool) return;
    
    // Remove any existing spider cursors first
    const existingCursors = document.querySelectorAll('.spider-cursor');
    existingCursors.forEach(cursor => {
      if (cursor.parentNode) {
        document.body.removeChild(cursor);
      }
    });

    const spiderCursor = document.createElement('div');
    spiderCursor.className = 'spider-cursor';
    document.body.appendChild(spiderCursor);

    // Add spider legs
    for (let i = 1; i <= 8; i++) {
      const leg = document.createElement('div');
      leg.className = `spider-leg leg-${i}`;
      spiderCursor.appendChild(leg);
    }

    const updateSpiderPosition = () => {
      if (spiderCursor) {
        spiderCursor.style.left = `${mousePosition.x}px`;
        spiderCursor.style.top = `${mousePosition.y}px`;
      }
      requestAnimationFrame(updateSpiderPosition);
    };
    
    const animationFrame = requestAnimationFrame(updateSpiderPosition);
    
    return () => {
      cancelAnimationFrame(animationFrame);
      if (spiderCursor && spiderCursor.parentNode) {
        document.body.removeChild(spiderCursor);
      }
    };
  }, [isNetworkTool, mousePosition]);

  // Create spider web nodes
  const createSpiderNodes = () => {
    removeSpiderNodes();
    
    const container = document.querySelector('.network-tool-container');
    if (!container) return;
    
    // Create animated spider web nodes
    for (let i = 0; i < 50; i++) {
      const node = document.createElement('div');
      node.className = 'node';
      
      const posX = Math.random() * 100;
      const posY = Math.random() * 100;
      
      node.style.left = `${posX}%`;
      node.style.top = `${posY}%`;
      node.style.animationDelay = `${i * 0.1}s`;
      
      container.appendChild(node);
    }
    
    // Create connections between nodes
    const nodes = document.querySelectorAll('.node');
    for (let i = 0; i < nodes.length; i++) {
      const currentNode = nodes[i];
      
      // Connect this node to 2-3 other random nodes
      const connections = Math.floor(Math.random() * 2) + 2;
      
      for (let c = 0; c < connections; c++) {
        // Get random target node
        const targetIndex = Math.floor(Math.random() * nodes.length);
        if (targetIndex !== i) {
          const targetNode = nodes[targetIndex];
          
          // Create line between nodes
          const line = document.createElement('div');
          line.className = 'network-node-connection';
          
          // Calculate position and angle
          const rect1 = currentNode.getBoundingClientRect();
          const rect2 = targetNode.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          
          const x1 = rect1.left - containerRect.left + rect1.width / 2;
          const y1 = rect1.top - containerRect.top + rect1.height / 2;
          const x2 = rect2.left - containerRect.left + rect2.width / 2;
          const y2 = rect2.top - containerRect.top + rect2.height / 2;
          
          const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
          const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
          
          line.style.width = `${length}px`;
          line.style.left = `${x1}px`;
          line.style.top = `${y1}px`;
          line.style.transform = `rotate(${angle}deg)`;
          line.style.animationDelay = `${i * 0.2}s`;
          
          container.appendChild(line);
        }
      }
    }
  };

  const removeSpiderNodes = () => {
    const nodes = document.querySelectorAll('.node');
    const connections = document.querySelectorAll('.network-node-connection');
    
    nodes.forEach(node => node.remove());
    connections.forEach(connection => connection.remove());
  };

  // Get the component for this tool
  const ToolComponent = getToolComponent(toolId);

  return (
    <MainLayout>
      <div 
        className={`${isNetworkTool ? 'network-tool-container' : 'container mx-auto px-4 py-8'}`}
      >
        {loading ? (
          <ToolLoading />
        ) : tool ? (
          <div className={`${isNetworkTool ? 'relative z-10 px-4 py-8' : 'bg-white p-6 rounded-lg shadow-sm'}`}>
            <ToolComponent />
          </div>
        ) : (
          <ToolNotFound />
        )}
      </div>
    </MainLayout>
  );
};

export default ToolPage;
