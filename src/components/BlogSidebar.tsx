
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getRecentBlogPosts, blogCategories, BlogPost } from '@/services/blogService';

const BlogSidebar = () => {
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const posts = await getRecentBlogPosts(5);
        setRecentPosts(posts);
      } catch (error) {
        console.error('Error fetching recent posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentPosts();
  }, []);

  return (
    <div className="space-y-6">
      {/* Recent Posts */}
      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-lg font-bold">Recent Posts</CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Skeleton className="h-10 w-10 rounded" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <ul className="space-y-3">
              {recentPosts.map((post) => (
                <li key={post.id}>
                  <Link 
                    to={`/blog/${post.id}`}
                    className="flex items-start space-x-3 hover:bg-gray-50 p-2 rounded-md transition-colors"
                  >
                    {post.imageUrl && (
                      <img 
                        src={post.imageUrl} 
                        alt={post.title} 
                        className="w-10 h-10 object-cover rounded" 
                      />
                    )}
                    <div>
                      <p className="font-medium line-clamp-2 text-sm">{post.title}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-lg font-bold">Categories</CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="flex flex-wrap gap-2">
            {blogCategories.map((category) => (
              <Link 
                key={category}
                to={`/blog?category=${encodeURIComponent(category)}`}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
              >
                {category}
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogSidebar;
