
import React from 'react';
import { Link } from 'react-router-dom';
import { Tool } from '@/services/toolsService';
import { ArrowLeft } from 'lucide-react';
import { getIconComponent } from './ToolComponentMap';

interface ToolHeaderProps {
  tool?: Tool;
  title?: string;
  description?: string;
}

const ToolHeader: React.FC<ToolHeaderProps> = ({ tool, title, description }) => {
  // Use either the tool object or the directly provided title/description
  const displayTitle = tool?.name || title;
  const displayDescription = tool?.description || description;
  const IconComponent = tool ? getIconComponent(tool.icon) : null;
  
  return (
    <>
      <div className="mb-6">
        <Link to="/" className="text-gray-500 hover:text-gray-700 flex items-center gap-1">
          <ArrowLeft size={16} /> Back to Tools
        </Link>
      </div>
      
      <div className="flex items-center gap-4 mb-8">
        {IconComponent && (
          <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
            <IconComponent size={32} />
          </div>
        )}
        <div>
          <h1 className="text-3xl font-bold">{displayTitle}</h1>
          <p className="text-gray-600">{displayDescription}</p>
        </div>
      </div>
    </>
  );
};

export default ToolHeader;
