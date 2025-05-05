
// Mock SEO data service
// In a real application, this would connect to Google Search Console API or similar

export interface SEOMetrics {
  postId: string;
  title: string;
  seoScore: number;
  clicks: number;
  impressions: number;
  position: number;
  changeDirection: 'up' | 'down' | 'neutral';
  changePercent: number;
}

// Mock SEO data
const mockSEOData: SEOMetrics[] = [
  {
    postId: '1',
    title: 'Getting Started with React',
    seoScore: 87,
    clicks: 156,
    impressions: 2340,
    position: 3.2,
    changeDirection: 'up',
    changePercent: 12
  },
  {
    postId: '2',
    title: 'Advanced TypeScript Tips',
    seoScore: 76,
    clicks: 98,
    impressions: 1560,
    position: 5.7,
    changeDirection: 'up',
    changePercent: 8
  },
  {
    postId: '3',
    title: 'Introduction to Web Design',
    seoScore: 65,
    clicks: 45,
    impressions: 890,
    position: 8.3,
    changeDirection: 'down',
    changePercent: 5
  },
  {
    postId: '4',
    title: 'Best Practices for SEO',
    seoScore: 91,
    clicks: 210,
    impressions: 3200,
    position: 2.1,
    changeDirection: 'up',
    changePercent: 15
  },
  {
    postId: '5',
    title: 'CSS Grid Layout Tutorial',
    seoScore: 72,
    clicks: 87,
    impressions: 1250,
    position: 6.4,
    changeDirection: 'neutral',
    changePercent: 0
  }
];

// Get SEO metrics for all blog posts
export const getSEOMetrics = (): Promise<SEOMetrics[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...mockSEOData]), 500);
  });
};

// Get SEO metrics for a specific blog post
export const getPostSEOMetrics = (postId: string): Promise<SEOMetrics | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockSEOData.find(metric => metric.postId === postId));
    }, 500);
  });
};

// Generate SEO recommendations
export const generateSEORecommendations = (content: string, title: string, keywords: string[]): Promise<string[]> => {
  return new Promise((resolve) => {
    // Very simple mock recommendations
    const recommendations: string[] = [];
    
    if (title.length < 30) {
      recommendations.push('Consider making your title longer (30-60 characters) for better SEO.');
    }
    
    if (content.length < 300) {
      recommendations.push('Content is too short. Aim for at least 300 words for better rankings.');
    }
    
    if (keywords.length < 3) {
      recommendations.push('Add more focus keywords to improve visibility.');
    }
    
    // Add some generic recommendations
    recommendations.push('Add meta descriptions with focus keywords.');
    recommendations.push('Use header tags (H1, H2, H3) to structure your content.');
    recommendations.push('Include internal links to your other blog posts.');
    
    setTimeout(() => resolve(recommendations), 800);
  });
};
