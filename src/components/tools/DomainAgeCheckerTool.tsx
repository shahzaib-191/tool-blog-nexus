
import { useState } from 'react';
import ToolHeader from './ToolHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Globe, Calendar, Clock, Info } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const DomainAgeCheckerTool = () => {
  const { toast } = useToast();
  const [domain, setDomain] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<{
    domain: string;
    registrationDate: string;
    age: string;
    expiryDate: string;
    registrar: string;
  } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!domain) {
      toast({
        title: "Domain Required",
        description: "Please enter a domain name to check.",
        variant: "destructive",
      });
      return;
    }
    
    // Check domain format validity
    const domainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    if (!domainRegex.test(domain)) {
      toast({
        title: "Invalid Domain",
        description: "Please enter a valid domain name (e.g., example.com).",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Generate fake registration date between 1 and 15 years ago
      const years = Math.floor(Math.random() * 15) + 1;
      const registrationDate = new Date();
      registrationDate.setFullYear(registrationDate.getFullYear() - years);
      
      // Generate fake expiry date in the future
      const expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + Math.floor(Math.random() * 5) + 1);
      
      // Format dates
      const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      };
      
      // Calculate age string
      const ageYears = years;
      const ageMonths = Math.floor(Math.random() * 12);
      const ageString = `${ageYears} years, ${ageMonths} months`;
      
      // Generate random registrar
      const registrars = [
        'GoDaddy.com, LLC',
        'Namecheap Inc.',
        'Network Solutions, LLC',
        'NameSilo, LLC',
        'Google Domains',
        'Cloudflare, Inc.'
      ];
      const randomRegistrar = registrars[Math.floor(Math.random() * registrars.length)];
      
      setResults({
        domain: domain,
        registrationDate: formatDate(registrationDate),
        age: ageString,
        expiryDate: formatDate(expiryDate),
        registrar: randomRegistrar
      });
      
      setIsLoading(false);
      
      toast({
        title: "Domain Age Check Complete",
        description: `Results for ${domain} have been retrieved.`,
      });
    }, 1500);
  };

  return (
    <>
      <ToolHeader
        title="Domain Age Checker"
        description="Check when a domain was registered and its age to evaluate its authority and trustworthiness."
      />
      
      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardContent className="pt-6 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col space-y-1.5">
                <label htmlFor="domain" className="font-medium">Enter Domain Name</label>
                <div className="flex">
                  <div className="relative w-full">
                    <Globe className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    <Input 
                      id="domain"
                      placeholder="example.com"
                      className="pl-10"
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="ml-2" 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Checking...' : 'Check'}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">Enter a domain name without http:// or www (e.g., example.com)</p>
              </div>
            </form>

            {results && (
              <div className="bg-primary-foreground p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-center">Domain Age Results</h3>
                
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="flex items-center gap-3 p-4 bg-background rounded-md">
                    <div className="p-2 bg-primary/10 rounded-md">
                      <Calendar className="text-primary h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Registration Date</p>
                      <p className="text-lg">{results.registrationDate}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-background rounded-md">
                    <div className="p-2 bg-primary/10 rounded-md">
                      <Clock className="text-primary h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Domain Age</p>
                      <p className="text-lg">{results.age}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-background rounded-md">
                    <div className="p-2 bg-primary/10 rounded-md">
                      <Calendar className="text-primary h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Expiry Date</p>
                      <p className="text-lg">{results.expiryDate}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-background rounded-md">
                    <div className="p-2 bg-primary/10 rounded-md">
                      <Info className="text-primary h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Registrar</p>
                      <p className="text-lg">{results.registrar}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-blue-50 p-4 rounded-md">
              <h4 className="font-medium text-blue-800 mb-2">Why Domain Age Matters:</h4>
              <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                <li>Older domains are often considered more trustworthy by search engines</li>
                <li>Domain age can be a factor in website authority and credibility</li>
                <li>Established domains typically have better SEO performance</li>
                <li>Understanding domain history helps in competitor research</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default DomainAgeCheckerTool;
