
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const ToolLoading: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-14 w-14 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="space-y-4">
          <Skeleton className="h-8 w-full max-w-sm" />
          <Skeleton className="h-32 w-full rounded-md" />
          <div className="flex items-center space-x-4 pt-4">
            <Skeleton className="h-10 w-24 rounded-md" />
            <Skeleton className="h-10 w-24 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolLoading;
