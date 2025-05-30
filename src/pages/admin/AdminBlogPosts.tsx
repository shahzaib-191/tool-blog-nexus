
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/Layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SEOMetricsCard from '@/components/admin/SEOMetricsCard';
import { 
  getAllBlogPosts, 
  createBlogPost, 
  updateBlogPost, 
  deleteBlogPost, 
  BlogPost, 
  blogCategories 
} from '@/services/blogService';
import { getSEOMetrics } from '@/services/seoService';
import { Edit, Plus, Trash2, Image, Upload, Gauge, FileText } from 'lucide-react';

const AdminBlogPosts = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: blogCategories[0],
    imageUrl: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [seoMetrics, setSeoMetrics] = useState([]);
  const [activeTab, setActiveTab] = useState('posts');

  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();
    fetchSEOMetrics();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const fetchedPosts = await getAllBlogPosts();
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load blog posts.'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSEOMetrics = async () => {
    try {
      const metrics = await getSEOMetrics();
      setSeoMetrics(metrics);
    } catch (error) {
      console.error('Error fetching SEO metrics:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load SEO metrics.'
      });
    }
  };

  const handleCreatePost = async () => {
    try {
      const { title, content, category } = formData;
      
      if (!title || !content || !category) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Please fill in all required fields.'
        });
        return;
      }
      
      // Simulate image upload and get URL
      let imageUrl = '';
      if (imageFile) {
        // In a real application, this would be an actual file upload to a server or Supabase storage
        // For demo purposes, we're using a data URL as a placeholder
        imageUrl = imagePreview || '';
        
        toast({
          title: 'Image Upload',
          description: 'Image uploaded successfully!'
        });
      }
      
      const newPost = await createBlogPost({
        title,
        content,
        category,
        author: 'Admin User', // Hard-coded for now
        imageUrl: imageUrl
      });
      
      setPosts([newPost, ...posts]);
      setIsCreateDialogOpen(false);
      resetForm();
      
      toast({
        title: 'Success',
        description: 'Blog post created successfully!'
      });
    } catch (error) {
      console.error('Error creating blog post:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to create blog post.'
      });
    }
  };

  const handleEditPost = async () => {
    if (!currentPost) return;
    
    try {
      const { title, content, category } = formData;
      
      if (!title || !content || !category) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Please fill in all required fields.'
        });
        return;
      }
      
      // Handle image update if a new one was provided
      let imageUrl = currentPost.imageUrl;
      if (imageFile && imagePreview) {
        // In a real application, this would upload the new image
        imageUrl = imagePreview;
        
        toast({
          title: 'Image Upload',
          description: 'Image updated successfully!'
        });
      }
      
      const updatedPost = await updateBlogPost(currentPost.id, {
        title,
        content,
        category,
        imageUrl
      });
      
      if (updatedPost) {
        setPosts(posts.map(post => post.id === currentPost.id ? updatedPost : post));
      }
      
      setIsEditDialogOpen(false);
      setCurrentPost(null);
      setImageFile(null);
      setImagePreview(null);
      
      toast({
        title: 'Success',
        description: 'Blog post updated successfully!'
      });
    } catch (error) {
      console.error('Error updating blog post:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update blog post.'
      });
    }
  };

  const handleDeletePost = async () => {
    if (!currentPost) return;
    
    try {
      const success = await deleteBlogPost(currentPost.id);
      
      if (success) {
        setPosts(posts.filter(post => post.id !== currentPost.id));
        toast({
          title: 'Success',
          description: 'Blog post deleted successfully!'
        });
      } else {
        throw new Error('Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting blog post:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete blog post.'
      });
    } finally {
      setIsDeleteAlertOpen(false);
      setCurrentPost(null);
    }
  };

  const openEditDialog = (post: BlogPost) => {
    setCurrentPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      category: post.category,
      imageUrl: post.imageUrl || ''
    });
    setImagePreview(post.imageUrl || null);
    setIsEditDialogOpen(true);
  };

  const openDeleteAlert = (post: BlogPost) => {
    setCurrentPost(post);
    setIsDeleteAlertOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      category: blogCategories[0],
      imageUrl: ''
    });
    setImageFile(null);
    setImagePreview(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <AdminLayout title="Blog Posts">
      <div className="mb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="posts">
              <FileText className="h-4 w-4 mr-2" />
              Blog Posts
            </TabsTrigger>
            <TabsTrigger value="seo">
              <Gauge className="h-4 w-4 mr-2" />
              SEO Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-gray-600">
                Manage your blog posts. Create, edit, and delete posts.
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> New Post
              </Button>
            </div>

            {/* Blog Posts Table */}
            <div className="bg-white shadow overflow-hidden rounded-md">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Author
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center">
                        Loading blog posts...
                      </td>
                    </tr>
                  ) : posts.length > 0 ? (
                    posts.map((post) => (
                      <tr key={post.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {post.imageUrl && (
                              <div className="flex-shrink-0 h-10 w-10 mr-4">
                                <img 
                                  src={post.imageUrl} 
                                  alt={post.title} 
                                  className="h-10 w-10 rounded-full object-cover"
                                />
                              </div>
                            )}
                            <div className="text-sm font-medium text-gray-900">{post.title}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {post.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {post.author}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button variant="ghost" size="icon" onClick={() => openEditDialog(post)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => openDeleteAlert(post)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                        No blog posts available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="seo" className="space-y-4">
            <SEOMetricsCard metrics={seoMetrics} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Post Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Blog Post</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new blog post.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter blog post title"
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {blogCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="image">Featured Image</Label>
              <div className="mt-1 flex items-center">
                <label className="block w-full">
                  <div className="flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:bg-gray-50">
                    <div className="space-y-1 text-center">
                      <div className="flex flex-col items-center">
                        {imagePreview ? (
                          <div className="relative w-full h-32 mb-4">
                            <img 
                              src={imagePreview} 
                              alt="Preview" 
                              className="h-32 object-contain mx-auto"
                            />
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              className="absolute top-0 right-0"
                              onClick={(e) => {
                                e.preventDefault();
                                setImageFile(null);
                                setImagePreview(null);
                              }}
                            >
                              ✕
                            </Button>
                          </div>
                        ) : (
                          <Image className="mx-auto h-12 w-12 text-gray-400" />
                        )}
                        <p className="text-sm text-gray-500">
                          <span className="font-medium text-blue-600 hover:text-blue-500">
                            Upload a file
                          </span>{' '}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    </div>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleImageChange}
                    />
                  </div>
                </label>
              </div>
            </div>
            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="Write your blog post content..."
                className="h-64"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsCreateDialogOpen(false);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button onClick={handleCreatePost}>
              <Upload className="mr-2 h-4 w-4" /> Create Post
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Post Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Blog Post</DialogTitle>
            <DialogDescription>
              Update the details of your blog post.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="edit-category">Category</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {blogCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-image">Featured Image</Label>
              <div className="mt-1 flex items-center">
                <label className="block w-full">
                  <div className="flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:bg-gray-50">
                    <div className="space-y-1 text-center">
                      <div className="flex flex-col items-center">
                        {imagePreview ? (
                          <div className="relative w-full h-32 mb-4">
                            <img 
                              src={imagePreview} 
                              alt="Preview" 
                              className="h-32 object-contain mx-auto"
                            />
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              className="absolute top-0 right-0"
                              onClick={(e) => {
                                e.preventDefault();
                                setImageFile(null);
                                setImagePreview(null);
                              }}
                            >
                              ✕
                            </Button>
                          </div>
                        ) : (
                          <Image className="mx-auto h-12 w-12 text-gray-400" />
                        )}
                        <p className="text-sm text-gray-500">
                          <span className="font-medium text-blue-600 hover:text-blue-500">
                            Upload a new image
                          </span>{' '}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    </div>
                    <Input
                      id="edit-image"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleImageChange}
                    />
                  </div>
                </label>
              </div>
            </div>
            <div>
              <Label htmlFor="edit-content">Content</Label>
              <Textarea
                id="edit-content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                className="h-64"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsEditDialogOpen(false);
              setCurrentPost(null);
              setImageFile(null);
              setImagePreview(null);
            }}>
              Cancel
            </Button>
            <Button onClick={handleEditPost}>
              <Upload className="mr-2 h-4 w-4" /> Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Post Alert */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the blog post
              "{currentPost?.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePost} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminBlogPosts;
