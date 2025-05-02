
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tool } from '@/services/toolsService';
import * as LucideIcons from 'lucide-react';

interface ToolCardProps {
  tool: Tool;
}

const ToolCard = ({ tool }: ToolCardProps) => {
  // Dynamically get the icon from Lucide
  // Use Wrench as fallback if the icon doesn't exist
  const IconComponent = (LucideIcons as any)[tool.icon] || LucideIcons.Wrench;

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md group">
      <CardContent className="pt-6 pb-4 flex flex-col items-center text-center">
        <div className="mb-4 p-3 bg-blue-50 text-tool-blue rounded-full group-hover:bg-blue-100 transition-colors">
          <IconComponent size={28} />
        </div>
        <h3 className="font-semibold mb-1">{tool.name}</h3>
        <p className="text-sm text-gray-500 mb-3">{tool.description}</p>
      </CardContent>
      <CardFooter className="pt-0 pb-4 flex justify-center">
        <Link to={tool.link}>
          <Button size="sm" variant="outline">
            Open Tool
          </Button>
        </Link>
      </CardFooter>
      {tool.isTrending && (
        <div className="absolute top-2 right-2">
          <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
            Trending
          </span>
        </div>
      )}
    </Card>
  );
};

export default ToolCard;
