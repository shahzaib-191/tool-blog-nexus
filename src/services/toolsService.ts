
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
    icon: "FileText",
    link: "/tools/pdf-to-word",
    isTrending: true
  },
  {
    id: "word-to-pdf",
    name: "Word to PDF Converter",
    description: "Convert Word documents to PDF format",
    category: "Productivity & Utility",
    icon: "File",
    link: "/tools/word-to-pdf"
  },
  {
    id: "image-to-pdf",
    name: "Image to PDF Converter",
    description: "Convert images to PDF documents",
    category: "Productivity & Utility",
    icon: "Image",
    link: "/tools/image-to-pdf"
  },
  {
    id: "qr-generator",
    name: "QR Code Generator",
    description: "Create customizable QR codes for any link or text",
    category: "Productivity & Utility",
    icon: "Search",
    link: "/tools/qr-generator"
  },
  {
    id: "text-to-speech",
    name: "Text to Speech",
    description: "Convert written text into natural-sounding voice",
    category: "Productivity & Utility",
    icon: "Volume",
    link: "/tools/text-to-speech"
  },
  {
    id: "speech-to-text",
    name: "Speech to Text",
    description: "Convert spoken words into written text",
    category: "Productivity & Utility",
    icon: "Mic",
    link: "/tools/speech-to-text",
    isTrending: true
  },
  {
    id: "unit-converter",
    name: "Unit Converter",
    description: "Convert between different units of measurement",
    category: "Productivity & Utility",
    icon: "ArrowRightLeft",
    link: "/tools/unit-converter"
  },
  {
    id: "currency-converter",
    name: "Currency Converter",
    description: "Convert between different currencies with live rates",
    category: "Productivity & Utility",
    icon: "Currency",
    link: "/tools/currency-converter"
  },
  {
    id: "pomodoro-timer",
    name: "Pomodoro Timer",
    description: "Boost productivity with timed work sessions",
    category: "Productivity & Utility",
    icon: "Timer",
    link: "/tools/pomodoro-timer"
  },
  {
    id: "world-clock",
    name: "World Clock",
    description: "Check the time in different time zones",
    category: "Productivity & Utility",
    icon: "Clock",
    link: "/tools/world-clock"
  },
  {
    id: "online-notepad",
    name: "Online Notepad",
    description: "Take notes online without installing any software",
    category: "Productivity & Utility",
    icon: "Edit",
    link: "/tools/online-notepad"
  },

  // SEO & Marketing Tools
  {
    id: "meta-tag-generator",
    name: "Meta Tag Generator",
    description: "Generate meta tags for better SEO performance",
    category: "SEO & Marketing",
    icon: "Code",
    link: "/tools/meta-tag-generator",
    isTrending: true
  },
  {
    id: "keyword-research",
    name: "Keyword Research Tool",
    description: "Find valuable keywords for your content",
    category: "SEO & Marketing",
    icon: "Search",
    link: "/tools/keyword-research",
    isTrending: true
  },
  {
    id: "plagiarism-checker",
    name: "Plagiarism Checker",
    description: "Check content for originality and duplicate content",
    category: "SEO & Marketing",
    icon: "Check",
    link: "/tools/plagiarism-checker",
    isTrending: true
  },
  {
    id: "word-counter",
    name: "Word Counter",
    description: "Count words, characters, sentences in your text",
    category: "SEO & Marketing",
    icon: "List",
    link: "/tools/word-counter",
    isTrending: true
  },
  {
    id: "backlink-checker",
    name: "Backlink Checker",
    description: "Analyze backlinks pointing to your website",
    category: "SEO & Marketing",
    icon: "Link",
    link: "/tools/backlink-checker"
  },
  {
    id: "website-speed-test",
    name: "Website Speed Test",
    description: "Test your website loading speed and performance",
    category: "SEO & Marketing",
    icon: "Timer",
    link: "/tools/website-speed-test"
  },
  {
    id: "utm-link-builder",
    name: "UTM Link Builder",
    description: "Create UTM parameters for campaign tracking",
    category: "SEO & Marketing",
    icon: "Link",
    link: "/tools/utm-link-builder"
  },
  {
    id: "readability-checker",
    name: "Readability Checker",
    description: "Check and improve your content's readability",
    category: "SEO & Marketing",
    icon: "FileText",
    link: "/tools/readability-checker"
  },
  {
    id: "domain-age-checker",
    name: "Domain Age Checker",
    description: "Check how old a domain name is",
    category: "SEO & Marketing",
    icon: "Calendar",
    link: "/tools/domain-age-checker"
  },
  {
    id: "ssl-checker",
    name: "SSL Checker",
    description: "Verify SSL certificate installation and status",
    category: "Web Development",
    icon: "Lock",
    link: "/tools/ssl-checker"
  },
  {
    id: "whois-lookup",
    name: "Whois Lookup",
    description: "Look up domain registration information",
    category: "Web Development",
    icon: "Search",
    link: "/tools/whois-lookup"
  },
  {
    id: "dns-lookup",
    name: "DNS Lookup",
    description: "Look up DNS records for a domain",
    category: "Web Development",
    icon: "World",
    link: "/tools/dns-lookup"
  },
  {
    id: "ip-address-finder",
    name: "IP Address Finder",
    description: "Find your public IP address",
    category: "Web Development",
    icon: "Wifi",
    link: "/tools/ip-address-finder"
  },
  {
    id: "port-scanner",
    name: "Port Scanner",
    description: "Check open ports on a server",
    category: "Web Development",
    icon: "Search",
    link: "/tools/port-scanner"
  },

  // Image & Video Tools
  {
    id: "image-compressor",
    name: "Image Compressor",
    description: "Compress images without losing quality",
    category: "Image & Video",
    icon: "Image",
    link: "/tools/image-compressor",
    isTrending: true
  },
  {
    id: "image-resizer",
    name: "Image Resizer",
    description: "Resize images to exact dimensions",
    category: "Image & Video",
    icon: "ArrowLeftRight",
    link: "/tools/image-resizer"
  },
  {
    id: "background-remover",
    name: "Background Remover",
    description: "Remove background from images automatically",
    category: "Image & Video",
    icon: "Trash",
    link: "/tools/background-remover",
    isTrending: true
  },
  {
    id: "video-to-gif",
    name: "Video to GIF Converter",
    description: "Convert videos to animated GIFs",
    category: "Image & Video",
    icon: "Video",
    link: "/tools/video-to-gif",
    isTrending: true
  },
  {
    id: "video-compressor",
    name: "Video Compressor",
    description: "Compress video files without losing quality",
    category: "Image & Video",
    icon: "Video",
    link: "/tools/video-compressor"
  },
  {
    id: "thumbnail-downloader",
    name: "Thumbnail Downloader",
    description: "Download YouTube video thumbnails in full resolution",
    category: "Image & Video",
    icon: "Download",
    link: "/tools/thumbnail-downloader"
  },

  // Web Development Tools
  {
    id: "json-formatter",
    name: "JSON Formatter / Validator",
    description: "Format and validate JSON code",
    category: "Web Development",
    icon: "Code",
    link: "/tools/json-formatter",
    isTrending: true
  },
  {
    id: "css-minifier",
    name: "HTML/CSS/JS Minifier",
    description: "Minify code to improve page load speed",
    category: "Web Development",
    icon: "Code",
    link: "/tools/css-minifier"
  },
  {
    id: "lorem-ipsum",
    name: "Lorem Ipsum Generator",
    description: "Generate placeholder text for designs",
    category: "Web Development",
    icon: "FileText",
    link: "/tools/lorem-ipsum"
  },
  
  // AI & Writing Tools
  {
    id: "ai-text-generator",
    name: "AI Text Generator",
    description: "Generate text content with AI assistance",
    category: "AI & Writing",
    icon: "FileText",
    link: "/tools/ai-text-generator",
    isTrending: true
  },
  {
    id: "ai-paraphraser",
    name: "AI Paraphraser",
    description: "Rewrite text while maintaining meaning",
    category: "AI & Writing",
    icon: "Edit",
    link: "/tools/ai-paraphraser",
    isTrending: true
  },
  {
    id: "ai-blog-idea",
    name: "AI Blog Idea Generator",
    description: "Generate creative blog ideas and outlines",
    category: "AI & Writing",
    icon: "FileText",
    link: "/tools/ai-blog-idea"
  },
  {
    id: "ai-resume-builder",
    name: "AI Resume Builder",
    description: "Build professional resumes with AI assistance",
    category: "AI & Writing",
    icon: "FileText",
    link: "/tools/ai-resume-builder"
  },
  {
    id: "ai-chatbot-embed",
    name: "AI Chatbot Embed",
    description: "Create and embed AI chatbots on your website",
    category: "AI & Writing",
    icon: "MessageCircle",
    link: "/tools/ai-chatbot-embed"
  },
  {
    id: "ai-story-generator",
    name: "AI Story Generator",
    description: "Generate creative stories with AI",
    category: "AI & Writing",
    icon: "BookOpen",
    link: "/tools/ai-story-generator"
  },
  {
    id: "ai-voice-generator",
    name: "AI Voice Generator",
    description: "Generate realistic AI voices for your content",
    category: "AI & Writing",
    icon: "Volume2",
    link: "/tools/ai-voice-generator"
  },
  {
    id: "image-prompt-generator",
    name: "Image Prompt Generator",
    description: "Generate prompts for AI image generation",
    category: "AI & Writing",
    icon: "Image",
    link: "/tools/image-prompt-generator"
  },
  {
    id: "audio-to-text",
    name: "Audio to Text Converter",
    description: "Convert audio files to text transcripts",
    category: "Productivity & Utility",
    icon: "Headphones",
    link: "/tools/audio-to-text"
  },

  // Miscellaneous Tools
  {
    id: "password-generator",
    name: "Password Generator",
    description: "Create strong, secure passwords",
    category: "Miscellaneous & Fun",
    icon: "Lock",
    link: "/tools/password-generator"
  },
  {
    id: "bmi-calculator",
    name: "BMI Calculator",
    description: "Calculate your Body Mass Index",
    category: "Productivity & Utility",
    icon: "Calculator",
    link: "/tools/bmi-calculator"
  },
  {
    id: "age-calculator",
    name: "Age Calculator",
    description: "Calculate exact age from birthdate",
    category: "Productivity & Utility",
    icon: "Calendar",
    link: "/tools/age-calculator"
  },
  {
    id: "meme-generator",
    name: "Meme Generator",
    description: "Create funny memes with custom text",
    category: "Miscellaneous & Fun",
    icon: "Image",
    link: "/tools/meme-generator"
  },
  {
    id: "fake-credit-card",
    name: "Fake Credit Card Generator",
    description: "Generate test credit card numbers for testing",
    category: "Miscellaneous & Fun",
    icon: "CreditCard",
    link: "/tools/fake-credit-card"
  },
  {
    id: "ascii-art",
    name: "ASCII Art Generator",
    description: "Convert images to ASCII art",
    category: "Miscellaneous & Fun",
    icon: "Code",
    link: "/tools/ascii-art"
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
