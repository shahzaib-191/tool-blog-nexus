
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import MainLayout from '@/components/Layout/MainLayout';
import BlogSidebar from '@/components/BlogSidebar';
import { getBlogPostById, BlogPost } from '@/services/blogService';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, User, ArrowLeft } from 'lucide-react';

const BlogPostPage = () => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) return;
      
      try {
        setLoading(true);
        const postData = await getBlogPostById(postId);
        if (postData) {
          setPost(postData);
        }
      } catch (error) {
        console.error('Error fetching blog post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/blog" className="text-gray-500 hover:text-gray-700 flex items-center gap-1">
            <ArrowLeft size={16} /> Back to Blog
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main content */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="space-y-6">
                <Skeleton className="h-10 w-3/4" />
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-64 w-full" />
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ) : post ? (
              <article className="bg-white rounded-lg shadow-sm p-6">
                <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
                
                <div className="flex items-center text-gray-500 text-sm mb-6 space-x-4">
                  <div className="flex items-center">
                    <User size={16} className="mr-1" />
                    {post.author}
                  </div>
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-1" />
                    {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                </div>
                
                {post.imageUrl && (
                  <div className="mb-6">
                    <img 
                      src={post.imageUrl} 
                      alt={post.title}
                      className="w-full rounded-lg"
                    />
                  </div>
                )}
                
                <div className="prose max-w-none">
                  {post.content.split('\n\n').map((paragraph, idx) => (
                    <p key={idx} className="mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <Link 
                    to={`/blog?category=${encodeURIComponent(post.category)}`}
                    className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {post.category}
                  </Link>
                </div>
              </article>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold mb-4">Post Not Found</h2>
                <p className="text-gray-600 mb-6">
                  Sorry, the blog post you're looking for doesn't exist or may have been removed.
                </p>
                <Link 
                  to="/blog"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Browse All Posts
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <BlogSidebar />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default BlogPostPage;
