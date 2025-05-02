
export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  link: string;
  isTrending?: boolean;
}

export const toolCategories = [
  "Productivity & Utility",
  "SEO & Marketing",
  "Image & Video",
  "Web Development",
  "AI & Writing",
  "PDF & Document",
  "Design & Color",
  "Education & Learning",
  "Miscellaneous & Fun"
];

export const tools: Tool[] = [
  // Productivity & Utility Tools
  {
    id: "pdf-to-word",
    name: "PDF to Word Converter",
    description: "Convert PDF documents to editable Word files",
    category: "Productivity & Utility",
    icon: "file-text",
    link: "/tools/pdf-to-word",
    isTrending: true
  },
  {
    id: "word-to-pdf",
    name: "Word to PDF Converter",
    description: "Convert Word documents to PDF format",
    category: "Productivity & Utility",
    icon: "file",
    link: "/tools/word-to-pdf"
  },
  {
    id: "image-to-pdf",
    name: "Image to PDF Converter",
    description: "Convert images to PDF documents",
    category: "Productivity & Utility",
    icon: "image",
    link: "/tools/image-to-pdf"
  },
  {
    id: "qr-generator",
    name: "QR Code Generator",
    description: "Create customizable QR codes for any link or text",
    category: "Productivity & Utility",
    icon: "grid",
    link: "/tools/qr-generator"
  },
  {
    id: "text-to-speech",
    name: "Text to Speech",
    description: "Convert written text into natural-sounding voice",
    category: "Productivity & Utility",
    icon: "volume-2",
    link: "/tools/text-to-speech"
  },

  // SEO & Marketing Tools
  {
    id: "meta-tag-generator",
    name: "Meta Tag Generator",
    description: "Generate meta tags for better SEO performance",
    category: "SEO & Marketing",
    icon: "code",
    link: "/tools/meta-tag-generator",
    isTrending: true
  },
  {
    id: "keyword-research",
    name: "Keyword Research Tool",
    description: "Find valuable keywords for your content",
    category: "SEO & Marketing",
    icon: "search",
    link: "/tools/keyword-research",
    isTrending: true
  },
  {
    id: "plagiarism-checker",
    name: "Plagiarism Checker",
    description: "Check content for originality and duplicate content",
    category: "SEO & Marketing",
    icon: "check",
    link: "/tools/plagiarism-checker",
    isTrending: true
  },
  {
    id: "word-counter",
    name: "Word Counter",
    description: "Count words, characters, sentences in your text",
    category: "SEO & Marketing",
    icon: "list",
    link: "/tools/word-counter",
    isTrending: true
  },

  // Image & Video Tools
  {
    id: "image-compressor",
    name: "Image Compressor",
    description: "Compress images without losing quality",
    category: "Image & Video",
    icon: "image",
    link: "/tools/image-compressor",
    isTrending: true
  },
  {
    id: "image-resizer",
    name: "Image Resizer",
    description: "Resize images to exact dimensions",
    category: "Image & Video",
    icon: "maximize",
    link: "/tools/image-resizer"
  },
  {
    id: "background-remover",
    name: "Background Remover",
    description: "Remove background from images automatically",
    category: "Image & Video",
    icon: "trash-2",
    link: "/tools/background-remover",
    isTrending: true
  },
  {
    id: "video-to-gif",
    name: "Video to GIF Converter",
    description: "Convert videos to animated GIFs",
    category: "Image & Video",
    icon: "play",
    link: "/tools/video-to-gif",
    isTrending: true
  },

  // Web Development Tools
  {
    id: "json-formatter",
    name: "JSON Formatter / Validator",
    description: "Format and validate JSON code",
    category: "Web Development",
    icon: "code",
    link: "/tools/json-formatter",
    isTrending: true
  },
  {
    id: "css-minifier",
    name: "HTML/CSS/JS Minifier",
    description: "Minify code to improve page load speed",
    category: "Web Development",
    icon: "code",
    link: "/tools/css-minifier"
  },
  {
    id: "lorem-ipsum",
    name: "Lorem Ipsum Generator",
    description: "Generate placeholder text for designs",
    category: "Web Development",
    icon: "file-text",
    link: "/tools/lorem-ipsum"
  },
  
  // AI & Writing Tools
  {
    id: "ai-text-generator",
    name: "AI Text Generator",
    description: "Generate text content with AI assistance",
    category: "AI & Writing",
    icon: "file-text",
    link: "/tools/ai-text-generator",
    isTrending: true
  },
  {
    id: "ai-paraphraser",
    name: "AI Paraphraser",
    description: "Rewrite text while maintaining meaning",
    category: "AI & Writing",
    icon: "edit",
    link: "/tools/ai-paraphraser",
    isTrending: true
  },
  {
    id: "ai-blog-idea",
    name: "AI Blog Idea Generator",
    description: "Generate creative blog ideas and outlines",
    category: "AI & Writing",
    icon: "bulb",
    link: "/tools/ai-blog-idea"
  },

  // Miscellaneous Tools
  {
    id: "password-generator",
    name: "Password Generator",
    description: "Create strong, secure passwords",
    category: "Miscellaneous & Fun",
    icon: "lock",
    link: "/tools/password-generator"
  },
  {
    id: "bmi-calculator",
    name: "BMI Calculator",
    description: "Calculate your Body Mass Index",
    category: "Productivity & Utility",
    icon: "calculator",
    link: "/tools/bmi-calculator"
  },
  {
    id: "age-calculator",
    name: "Age Calculator",
    description: "Calculate exact age from birthdate",
    category: "Productivity & Utility",
    icon: "calendar",
    link: "/tools/age-calculator"
  }
];

// Get all tools
export const getAllTools = (): Promise<Tool[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...tools]), 300);
  });
};

// Get tool by id
export const getToolById = (id: string): Promise<Tool | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(tools.find(tool => tool.id === id));
    }, 300);
  });
};

// Get tools by category
export const getToolsByCategory = (category: string): Promise<Tool[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(tools.filter(tool => tool.category === category));
    }, 300);
  });
};

// Get trending tools
export const getTrendingTools = (): Promise<Tool[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(tools.filter(tool => tool.isTrending));
    }, 300);
  });
};
