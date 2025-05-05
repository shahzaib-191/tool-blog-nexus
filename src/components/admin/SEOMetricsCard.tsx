
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';

type SEOMetric = {
  postId: string;
  title: string;
  seoScore: number;
  clicks: number;
  impressions: number;
  position: number;
  changeDirection: 'up' | 'down' | 'neutral';
  changePercent: number;
};

interface SEOMetricsCardProps {
  metrics: SEOMetric[];
}

export const SEOMetricsCard = ({ metrics }: SEOMetricsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>SEO Performance</CardTitle>
        <CardDescription>Track how your blog posts are performing in search rankings</CardDescription>
      </CardHeader>
      <CardContent>
        {metrics.length > 0 ? (
          <div className="space-y-8">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics}>
                  <XAxis dataKey="title" tickFormatter={(value) => value.substring(0, 10) + '...'} />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number, name: string) => [value, name === 'position' ? 'Avg. Position' : name]}
                    labelFormatter={(label) => `Post: ${label}`}
                  />
                  <Bar dataKey="clicks" fill="#2563eb" name="Clicks" />
                  <Bar dataKey="impressions" fill="#4ade80" name="Impressions" />
                  <Bar dataKey="position" fill="#f59e0b" name="Avg. Position" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Top Performing Posts</h4>
              <div className="grid gap-3">
                {metrics.map((metric) => (
                  <div key={metric.postId} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                    <div>
                      <p className="font-medium text-sm">{metric.title}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant={metric.seoScore > 70 ? "success" : metric.seoScore > 50 ? "warning" : "destructive"}>
                          Score: {metric.seoScore}
                        </Badge>
                        <span className="text-xs text-gray-500">Pos: {metric.position.toFixed(1)}</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className={`flex items-center text-xs ${
                        metric.changeDirection === 'up' 
                          ? 'text-green-600' 
                          : metric.changeDirection === 'down'
                          ? 'text-red-600'
                          : 'text-gray-600'
                      }`}>
                        {metric.changeDirection === 'up' ? (
                          <ArrowUp className="h-3 w-3 mr-1" />
                        ) : metric.changeDirection === 'down' ? (
                          <ArrowDown className="h-3 w-3 mr-1" />
                        ) : (
                          <Minus className="h-3 w-3 mr-1" />
                        )}
                        {metric.changePercent}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No SEO metrics available yet.</p>
            <p className="text-sm mt-2">Metrics will appear once your posts start ranking.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SEOMetricsCard;
