
// Blog post interface
export interface BlogPost {
  id: string;
  title: string;
  content: string;
  category: string;
  author: string;
  createdAt: string;
  imageUrl?: string;
}

// Categories
export const blogCategories = [
  "Productivity",
  "SEO",
  "Web Development",
  "Design",
  "AI Tools",
  "Image Processing"
];

// Initial mock data
const initialBlogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Top 10 Productivity Tools You Should Use in 2025",
    content: "In today's fast-paced digital world, staying productive is more important than ever. Here are the top 10 productivity tools that can help you optimize your workflow and achieve more in less time...",
    category: "Productivity",
    author: "Admin User",
    createdAt: "2025-04-25T10:30:00Z",
    imageUrl: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZHVjdGl2aXR5fGVufDB8fDB8fHww"
  },
  {
    id: "2",
    title: "How to Optimize Your Website for Better SEO Performance",
    content: "Search Engine Optimization is crucial for any website looking to increase visibility. This comprehensive guide covers everything from keyword research to technical optimizations...",
    category: "SEO",
    author: "Regular User",
    createdAt: "2025-04-20T14:45:00Z",
    imageUrl: "https://images.unsplash.com/photo-1562577309-4932fdd64cd1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c2VvfGVufDB8fDB8fHww"
  },
  {
    id: "3",
    title: "The Power of AI Tools in Modern Content Creation",
    content: "Artificial Intelligence is revolutionizing the way we create content. From text generation to image creation, AI tools are becoming essential for content creators...",
    category: "AI Tools",
    author: "Admin User",
    createdAt: "2025-04-15T09:15:00Z",
    imageUrl: "https://images.unsplash.com/photo-1677442135066-8cedf832644d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8QUklMjB0b29sc3xlbnwwfHwwfHx8MA%3D%3D"
  },
];

// Load blog posts from localStorage or use initial data if none exists
const loadBlogPosts = (): BlogPost[] => {
  const savedPosts = localStorage.getItem('blogPosts');
  if (savedPosts) {
    return JSON.parse(savedPosts);
  }
  return initialBlogPosts;
};

// Save blog posts to localStorage
const saveBlogPosts = (posts: BlogPost[]): void => {
  localStorage.setItem('blogPosts', JSON.stringify(posts));
};

// Initialize blog posts
let blogPosts = loadBlogPosts();

// Get all blog posts
export const getAllBlogPosts = (): Promise<BlogPost[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...blogPosts]), 500);
  });
};

// Get blog post by id
export const getBlogPostById = (id: string): Promise<BlogPost | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(blogPosts.find(post => post.id === id));
    }, 500);
  });
};

// Get recent blog posts
export const getRecentBlogPosts = (limit: number = 5): Promise<BlogPost[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const sorted = [...blogPosts].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      resolve(sorted.slice(0, limit));
    }, 500);
  });
};

// Get blog posts by category
export const getBlogPostsByCategory = (category: string): Promise<BlogPost[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(blogPosts.filter(post => post.category === category));
    }, 500);
  });
};

// Create blog post
export const createBlogPost = (post: Omit<BlogPost, 'id' | 'createdAt'>): Promise<BlogPost> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newPost: BlogPost = {
        ...post,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      blogPosts = [newPost, ...blogPosts];
      saveBlogPosts(blogPosts); // Save to localStorage
      console.log("Blog post created:", newPost);
      console.log("Current blog posts:", blogPosts);
      resolve(newPost);
    }, 500);
  });
};

// Update blog post
export const updateBlogPost = (id: string, updates: Partial<BlogPost>): Promise<BlogPost | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const postIndex = blogPosts.findIndex(post => post.id === id);
      if (postIndex !== -1) {
        blogPosts[postIndex] = { ...blogPosts[postIndex], ...updates };
        saveBlogPosts(blogPosts); // Save to localStorage
        resolve(blogPosts[postIndex]);
      } else {
        resolve(undefined);
      }
    }, 500);
  });
};

// Delete blog post
export const deleteBlogPost = (id: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const initialLength = blogPosts.length;
      blogPosts = blogPosts.filter(post => post.id !== id);
      saveBlogPosts(blogPosts); // Save to localStorage
      resolve(blogPosts.length < initialLength);
    }, 500);
  });
};
