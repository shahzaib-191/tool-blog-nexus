
import React from 'react';
import ToolHeader from './ToolHeader';

const WorldClockTool: React.FC = () => {
  return (
    <>
      <ToolHeader
        title="World Clock"
        description="Check the current time in different cities and time zones around the world."
      />
      <div className="container mx-auto px-4 py-6">
        <div className="text-center p-8 bg-gray-50 rounded-md">
          <h3 className="text-lg font-medium text-gray-700">Coming Soon</h3>
          <p className="text-sm text-gray-500 mt-2">
            This tool is currently under development. Please check back later.
          </p>
        </div>
      </div>
    </>
  );
};

export default WorldClockTool;
