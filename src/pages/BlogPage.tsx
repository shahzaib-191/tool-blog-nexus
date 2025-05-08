
import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import MainLayout from '@/components/Layout/MainLayout';
import BlogSidebar from '@/components/BlogSidebar';
import { 
  getAllBlogPosts, 
  getBlogPostsByCategory, 
  BlogPost 
} from '@/services/blogService';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, User } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const BlogPage = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');
  
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        let fetchedPosts;
        
        if (category) {
          fetchedPosts = await getBlogPostsByCategory(category);
        } else {
          fetchedPosts = await getAllBlogPosts();
        }
        
        console.log("Blog posts fetched:", fetchedPosts); // Log for debugging
        setPosts(fetchedPosts);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        toast({
          title: "Error",
          description: "Failed to load blog posts. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [category, toast]);

  return (
    <MainLayout>
      <div className="bg-blue-50 py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4 text-center">Blog</h1>
          <p className="text-xl text-center text-gray-600 max-w-2xl mx-auto">
            Latest articles, tutorials, and insights about our tools and web technologies
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main content */}
          <div className="lg:col-span-3">
            {category && (
              <div className="mb-6">
                <div className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  Category: {category}
                </div>
              </div>
            )}

            {loading ? (
              // Skeleton loading state
              <div className="space-y-8">
                {[...Array(3)].map((_, index) => (
                  <Card key={index}>
                    <CardContent className="p-0">
                      <Skeleton className="h-48 rounded-t-lg" />
                      <div className="p-6 space-y-4">
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : posts.length > 0 ? (
              // Blog posts
              <div className="space-y-8">
                {posts.map((post) => (
                  <Card key={post.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      {post.imageUrl && (
                        <img 
                          src={post.imageUrl} 
                          alt={post.title} 
                          className="w-full h-48 object-cover"
                        />
                      )}
                      <div className="p-6">
                        <Link to={`/blog/${post.id}`}>
                          <h2 className="text-2xl font-bold mb-2 hover:text-blue-600 transition-colors">
                            {post.title}
                          </h2>
                        </Link>
                        
                        <div className="flex items-center text-gray-500 text-sm mb-4 space-x-4">
                          <div className="flex items-center">
                            <User size={14} className="mr-1" />
                            {post.author}
                          </div>
                          <div className="flex items-center">
                            <Calendar size={14} className="mr-1" />
                            {new Date(post.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {post.content}
                        </p>
                        
                        <Link 
                          to={`/blog/${post.id}`} 
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Read more
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              // No posts found
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-2">No Posts Found</h2>
                <p className="text-gray-600">
                  {category 
                    ? `There are no posts in the ${category} category yet.` 
                    : "There are no blog posts available yet."}
                </p>
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

export default BlogPage;
