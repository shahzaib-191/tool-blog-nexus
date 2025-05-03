
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const ToolLoading: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-14 w-14 rounded-full" />
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
      </div>
      <Skeleton className="h-[300px] w-full rounded-md" />
    </div>
  );
};

export default ToolLoading;
