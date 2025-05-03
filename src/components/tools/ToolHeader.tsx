
import React from 'react';
import { Link } from 'react-router-dom';
import { Tool } from '@/services/toolsService';
import { ArrowLeft } from 'lucide-react';
import { getIconComponent } from './ToolComponentMap';

interface ToolHeaderProps {
  tool: Tool;
}

const ToolHeader: React.FC<ToolHeaderProps> = ({ tool }) => {
  const IconComponent = getIconComponent(tool.icon);
  
  return (
    <>
      <div className="mb-6">
        <Link to="/" className="text-gray-500 hover:text-gray-700 flex items-center gap-1">
          <ArrowLeft size={16} /> Back to Tools
        </Link>
      </div>
      
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-blue-50 text-tool-blue rounded-full">
          <IconComponent size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold">{tool.name}</h1>
          <p className="text-gray-600">{tool.description}</p>
        </div>
      </div>
    </>
  );
};

export default ToolHeader;
