import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Calendar, User, Building, Globe, Database } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import ToolHeader from './ToolHeader';

interface WhoisResult {
  domain: string;
  registrar: {
    name: string;
    url: string;
    abuseContactEmail: string;
  };
  registrant: {
    organization: string;
    country: string;
    state: string;
    city: string;
  };
  dates: {
    createdDate: string;
    updatedDate: string;
    expiryDate: string;
  };
  nameServers: string[];
  domainStatus: string[];
  dnssec: string;
  isAvailable: boolean;
  rawData: string;
}

const WhoisLookupTool: React.FC = () => {
  const { toast } = useToast();
  const [domain, setDomain] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [results, setResults] = useState<WhoisResult | null>(null);
  const [recentDomains, setRecentDomains] = useState<string[]>([]);
  const [showRawData, setShowRawData] = useState(false);
  
  useEffect(() => {
    if (results) {
      createNetworkConnections();
    }
    return () => {
      removeNetworkConnections();
    };
  }, [results]);

  const createNetworkConnections = () => {
    removeNetworkConnections();
    
    const container = document.querySelector('.network-tool-container');
    if (!container) return;
    
    // Create animated connection lines
    for (let i = 0; i < 8; i++) {
      const line = document.createElement('div');
      line.className = 'network-node-connection';
      
      const startX = Math.random() * 100;
      const startY = Math.random() * 100;
      const endX = Math.random() * 100;
      const endY = Math.random() * 100;
      const width = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
      const angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);
      
      line.style.width = `${width}%`;
      line.style.left = `${startX}%`;
      line.style.top = `${startY}%`;
      line.style.transform = `rotate(${angle}deg)`;
      line.style.animationDelay = `${i * 0.5}s`;
      
      container.appendChild(line);
    }
  };

  const removeNetworkConnections = () => {
    const connections = document.querySelectorAll('.network-node-connection');
    connections.forEach(connection => connection.remove());
  };
  
  const checkDomain = () => {
    // Validate domain
    if (!domain) {
      toast({
        title: "Domain required",
        description: "Please enter a domain name",
        variant: "destructive",
      });
      return;
    }
    
    // Basic domain validation
    const domainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    const cleanDomain = domain.replace(/^https?:\/\//i, '').replace(/^www\./i, '').split('/')[0];
    
    if (!domainRegex.test(cleanDomain)) {
      toast({
        title: "Invalid domain",
        description: "Please enter a valid domain name (e.g., example.com)",
        variant: "destructive",
      });
      return;
    }
    
    setIsChecking(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Generate mock results
      const mockResults = generateMockWhoisResults(cleanDomain);
      setResults(mockResults);
      setIsChecking(false);
      
      // Add to recent domains
      if (!recentDomains.includes(cleanDomain)) {
        setRecentDomains([cleanDomain, ...recentDomains.slice(0, 4)]);
      }
      
      toast({
        title: "WHOIS lookup complete",
        description: `Results for ${cleanDomain} are ready`,
      });
    }, 1500);
  };
  
  const generateMockWhoisResults = (domainName: string): WhoisResult => {
    // Generate random dates
    const now = new Date();
    const randomPastYears = Math.floor(Math.random() * 20) + 1; // Random between 1-20 years
    const createdDate = new Date(
      now.getFullYear() - randomPastYears,
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28) + 1
    );
    
    const randomUpdateMonths = Math.floor(Math.random() * 12) + 1; // Random between 1-12 months
    const updatedDate = new Date(
      now.getFullYear(),
      now.getMonth() - randomUpdateMonths,
      Math.floor(Math.random() * 28) + 1
    );
    
    const randomFutureYears = Math.floor(Math.random() * 9) + 1; // Random between 1-9 years
    const expiryDate = new Date(
      now.getFullYear() + randomFutureYears,
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28) + 1
    );
    
    // Random registrars
    const registrars = [
      { name: "GoDaddy.com, LLC", url: "https://www.godaddy.com", email: "abuse@godaddy.com" },
      { name: "Namecheap, Inc.", url: "https://www.namecheap.com", email: "abuse@namecheap.com" },
      { name: "Network Solutions, LLC", url: "https://www.networksolutions.com", email: "abuse@web.com" },
      { name: "Google Domains", url: "https://domains.google", email: "registrar-abuse@google.com" },
      { name: "Tucows Domains Inc.", url: "https://tucowsdomains.com", email: "abuse@tucows.com" },
      { name: "NameSilo, LLC", url: "https://www.namesilo.com", email: "abuse@namesilo.com" },
      { name: "Dynadot, LLC", url: "https://www.dynadot.com", email: "abuse@dynadot.com" },
      { name: "Gandi SAS", url: "https://www.gandi.net", email: "abuse@support.gandi.net" },
      { name: "Amazon Registrar, Inc.", url: "https://www.amazon.com", email: "abuse@amazonaws.com" }
    ];
    
    const selectedRegistrar = registrars[Math.floor(Math.random() * registrars.length)];
    
    // Random name servers
    const nameServerSets = [
      [
        "ns1.example-registrar.com",
        "ns2.example-registrar.com"
      ],
      [
        "ns-1234.awsdns-12.org",
        "ns-567.awsdns-34.net",
        "ns-891.awsdns-56.com"
      ],
      [
        "dns1.registrar-servers.com",
        "dns2.registrar-servers.com"
      ],
      [
        "ns1.digitalocean.com",
        "ns2.digitalocean.com",
        "ns3.digitalocean.com"
      ],
      [
        "ns1.cloudflare.com",
        "ns2.cloudflare.com"
      ]
    ];
    
    const selectedNameServers = nameServerSets[Math.floor(Math.random() * nameServerSets.length)];
    
    // Random domain statuses
    const statusSets = [
      ["clientTransferProhibited", "clientUpdateProhibited", "clientDeleteProhibited"],
      ["clientTransferProhibited"],
      ["ok"]
    ];
    
    const selectedStatuses = statusSets[Math.floor(Math.random() * statusSets.length)];
    
    // Random registrant details
    const organizations = ["Example Organization", "Tech Company Inc.", "Digital Solutions LLC", "Web Enterprises Ltd."];
    const countries = ["US", "GB", "CA", "DE", "AU", "FR", "JP", "SG"];
    const states = ["CA", "NY", "TX", "FL", "WA", "MA", "IL", "Ontario", "NSW", "Bavaria"];
    const cities = ["San Francisco", "New York", "London", "Toronto", "Sydney", "Berlin", "Tokyo", "Singapore"];
    
    const selectedOrg = Math.random() > 0.3 ? organizations[Math.floor(Math.random() * organizations.length)] : "REDACTED FOR PRIVACY";
    const selectedCountry = Math.random() > 0.3 ? countries[Math.floor(Math.random() * countries.length)] : "REDACTED FOR PRIVACY";
    const selectedState = Math.random() > 0.3 ? states[Math.floor(Math.random() * states.length)] : "REDACTED FOR PRIVACY";
    const selectedCity = Math.random() > 0.3 ? cities[Math.floor(Math.random() * cities.length)] : "REDACTED FOR PRIVACY";
    
    // Generate mock raw WHOIS data
    const rawWhoisData = `
Domain Name: ${domainName.toUpperCase()}
Registry Domain ID: ${Math.random().toString(36).substring(2, 15)}_DOMAIN_COM-VRSN
Registrar WHOIS Server: whois.${selectedRegistrar.url.replace(/https?:\/\//i, '')}
Registrar URL: ${selectedRegistrar.url}
Updated Date: ${updatedDate.toISOString().split('T')[0]}
Creation Date: ${createdDate.toISOString().split('T')[0]}
Registrar Registration Expiration Date: ${expiryDate.toISOString().split('T')[0]}
Registrar: ${selectedRegistrar.name}
Registrar IANA ID: ${Math.floor(Math.random() * 2000) + 100}
Registrar Abuse Contact Email: ${selectedRegistrar.email}
Registrar Abuse Contact Phone: +1.${Math.floor(Math.random() * 900) + 100}${Math.floor(Math.random() * 900) + 100}${Math.floor(Math.random() * 10000)}
Domain Status: ${selectedStatuses.join(" ")}
Registry Registrant ID: ${Math.random() > 0.3 ? Math.random().toString(36).substring(2, 15) : "REDACTED FOR PRIVACY"}
Registrant Name: ${Math.random() > 0.3 ? "John Doe" : "REDACTED FOR PRIVACY"}
Registrant Organization: ${selectedOrg}
Registrant Street: ${Math.random() > 0.3 ? "123 Example St" : "REDACTED FOR PRIVACY"}
Registrant City: ${selectedCity}
Registrant State/Province: ${selectedState}
Registrant Postal Code: ${Math.random() > 0.3 ? Math.floor(Math.random() * 90000) + 10000 : "REDACTED FOR PRIVACY"}
Registrant Country: ${selectedCountry}
Registrant Phone: ${Math.random() > 0.3 ? "+1." + (Math.floor(Math.random() * 900) + 100) + (Math.floor(Math.random() * 900) + 100) + (Math.floor(Math.random() * 10000)) : "REDACTED FOR PRIVACY"}
Registrant Email: ${Math.random() > 0.3 ? "contact@" + domainName : "REDACTED FOR PRIVACY"}
Name Server: ${selectedNameServers.join("\nName Server: ")}
DNSSEC: ${Math.random() > 0.5 ? "signedDelegation" : "unsigned"}
`;

    return {
      domain: domainName,
      registrar: {
        name: selectedRegistrar.name,
        url: selectedRegistrar.url,
        abuseContactEmail: selectedRegistrar.email
      },
      registrant: {
        organization: selectedOrg,
        country: selectedCountry,
        state: selectedState,
        city: selectedCity
      },
      dates: {
        createdDate: createdDate.toISOString().split('T')[0],
        updatedDate: updatedDate.toISOString().split('T')[0],
        expiryDate: expiryDate.toISOString().split('T')[0]
      },
      nameServers: selectedNameServers,
      domainStatus: selectedStatuses,
      dnssec: Math.random() > 0.5 ? "signedDelegation" : "unsigned",
      isAvailable: false, // For WHOIS results, the domain exists
      rawData: rawWhoisData
    };
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    
    toast({
      description: "Content copied to clipboard",
    });
  };
  
  const checkRecentDomain = (domainName: string) => {
    setDomain(domainName);
    setTimeout(() => checkDomain(), 100);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="tool-header">
        <h1>WHOIS Lookup</h1>
      </div>
      
      <div className="search-container mb-6">
        <input
          type="text"
          className="search-input"
          placeholder="Enter a domain name or IP address..."
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && checkDomain()}
        />
        <button 
          className="search-button"
          onClick={checkDomain}
          disabled={isChecking}
        >
          {isChecking ? "Searching..." : "Search"}
        </button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-6">
            {recentDomains.length > 0 && (
              <div>
                <div className="text-sm font-medium mb-2">Recent Lookups</div>
                <div className="flex flex-wrap gap-2">
                  {recentDomains.map(recentDomain => (
                    <Badge 
                      key={recentDomain} 
                      variant="outline" 
                      className="cursor-pointer hover:bg-gray-100"
                      onClick={() => checkRecentDomain(recentDomain)}
                    >
                      {recentDomain}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {isChecking && (
              <div className="text-center p-8 rounded-md bg-gray-50 animate-pulse">
                <Database className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Looking up WHOIS information...</p>
              </div>
            )}
            
            {results && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">WHOIS Results for {results.domain}</h3>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowRawData(!showRawData)}
                    >
                      {showRawData ? "Show Summary" : "Show Raw Data"}
                    </Button>
                  </div>
                </div>
                
                {showRawData ? (
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Raw WHOIS Data</span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => copyToClipboard(results.rawData)}
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </Button>
                    </div>
                    <pre className="bg-black text-green-400 font-mono text-xs p-4 rounded-md overflow-auto max-h-[400px]">
                      {results.rawData}
                    </pre>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-md">
                        <div className="flex items-center gap-2 mb-3">
                          <Calendar className="h-5 w-5 text-blue-500" />
                          <h3 className="font-medium">Domain Dates</h3>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Created Date:</span>
                            <span className="text-sm font-medium">{results.dates.createdDate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Updated Date:</span>
                            <span className="text-sm font-medium">{results.dates.updatedDate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Expires Date:</span>
                            <span className="text-sm font-medium">{results.dates.expiryDate}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-md">
                        <div className="flex items-center gap-2 mb-3">
                          <Building className="h-5 w-5 text-purple-500" />
                          <h3 className="font-medium">Registrar Information</h3>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Registrar:</span>
                            <span className="text-sm font-medium">{results.registrar.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Registrar URL:</span>
                            <a 
                              href={results.registrar.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline"
                            >
                              {results.registrar.url.replace(/https?:\/\//i, '')}
                            </a>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Abuse Contact:</span>
                            <span className="text-sm font-medium">{results.registrar.abuseContactEmail}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-md">
                        <div className="flex items-center gap-2 mb-3">
                          <Database className="h-5 w-5 text-green-500" />
                          <h3 className="font-medium">Domain Status</h3>
                        </div>
                        <div className="space-y-2">
                          {results.domainStatus.map((status, index) => (
                            <Badge 
                              key={index}
                              variant="outline" 
                              className="mr-2 mb-2"
                            >
                              {status}
                            </Badge>
                          ))}
                        </div>
                        <div className="mt-3">
                          <div className="flex justify-between">
                            <span className="text-sm">DNSSEC:</span>
                            <span className="text-sm font-medium">{results.dnssec}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-md">
                        <div className="flex items-center gap-2 mb-3">
                          <User className="h-5 w-5 text-yellow-500" />
                          <h3 className="font-medium">Registrant Information</h3>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Organization:</span>
                            <span className="text-sm font-medium">{results.registrant.organization}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Country:</span>
                            <span className="text-sm font-medium">{results.registrant.country}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">State/Province:</span>
                            <span className="text-sm font-medium">{results.registrant.state}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">City:</span>
                            <span className="text-sm font-medium">{results.registrant.city}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-md">
                        <div className="flex items-center gap-2 mb-3">
                          <Globe className="h-5 w-5 text-red-500" />
                          <h3 className="font-medium">Name Servers</h3>
                        </div>
                        <div className="space-y-1 font-mono text-xs">
                          {results.nameServers.map((ns, index) => (
                            <div key={index} className="bg-white p-2 rounded border">{ns}</div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 p-4 rounded-md">
                        <h3 className="text-sm font-medium text-blue-800 mb-2">What is WHOIS?</h3>
                        <p className="text-xs text-blue-700">
                          WHOIS (pronounced as "who is") is a query and response protocol that provides information about registered domain names. 
                          This information includes domain registration date, expiration date, registrant contact details, and technical details like name servers.
                          Due to privacy regulations like GDPR, some registrant information may be redacted.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {!isChecking && !results && (
              <div className="text-center p-8 bg-gray-50 rounded-md">
                <Database className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-700">WHOIS Domain Lookup</h3>
                <p className="text-sm text-gray-500 mt-2">
                  Enter a domain name above to check its registration information
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WhoisLookupTool;
