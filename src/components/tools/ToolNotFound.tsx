
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const ToolNotFound: React.FC = () => {
  return (
    <div className="text-center py-12">
      <h2 className="text-2xl font-bold mb-4">Tool Not Found</h2>
      <p className="text-gray-600 mb-6">
        Sorry, the tool you're looking for doesn't exist or may have been removed.
      </p>
      <Link to="/">
        <Button>Browse All Tools</Button>
      </Link>
    </div>
  );
};

export default ToolNotFound;
