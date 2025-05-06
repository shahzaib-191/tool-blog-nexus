import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Globe, Server, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import ToolHeader from './ToolHeader';

interface DNSRecord {
  type: string;
  name: string;
  value: string;
  ttl: number;
  priority?: number;
  class?: string;
}

interface DNSResult {
  domain: string;
  recordsByType: {
    A: DNSRecord[];
    AAAA: DNSRecord[];
    MX: DNSRecord[];
    CNAME: DNSRecord[];
    TXT: DNSRecord[];
    NS: DNSRecord[];
    SOA: DNSRecord[];
  };
}

const DNSLookupTool: React.FC = () => {
  const { toast } = useToast();
  const [domain, setDomain] = useState('');
  const [recordType, setRecordType] = useState('A');
  const [isChecking, setIsChecking] = useState(false);
  const [results, setResults] = useState<DNSResult | null>(null);
  const [activeTab, setActiveTab] = useState('formatted');
  const [recentLookups, setRecentLookups] = useState<{domain: string, type: string}[]>([]);
  
  // Add network connections for animation
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
    for (let i = 0; i < 10; i++) {
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
      line.style.animationDelay = `${i * 0.3}s`;
      
      container.appendChild(line);
    }
  };

  const removeNetworkConnections = () => {
    const connections = document.querySelectorAll('.network-node-connection');
    connections.forEach(connection => connection.remove());
  };
  
  const checkDNS = () => {
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
      const mockResults = generateMockDNSResults(cleanDomain);
      setResults(mockResults);
      setIsChecking(false);
      
      // Add to recent lookups
      const newLookup = {domain: cleanDomain, type: recordType};
      if (!recentLookups.some(l => l.domain === cleanDomain && l.type === recordType)) {
        setRecentLookups([newLookup, ...recentLookups.slice(0, 4)]);
      }
      
      toast({
        title: "DNS lookup complete",
        description: `Found ${mockResults.recordsByType[recordType as keyof typeof mockResults.recordsByType]?.length || 0} ${recordType} records for ${cleanDomain}`,
      });
    }, 1000);
  };
  
  const generateMockDNSResults = (domainName: string): DNSResult => {
    // Random IP generator
    const generateIpv4 = () => {
      return `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
    };
    
    const generateIpv6 = () => {
      let ipv6 = "";
      for (let i = 0; i < 8; i++) {
        ipv6 += Math.floor(Math.random() * 65536).toString(16).padStart(4, '0');
        if (i < 7) ipv6 += ":";
      }
      return ipv6;
    };
    
    // Generate A records
    const aRecords = Array(Math.floor(Math.random() * 3) + 1).fill(null).map((_, i) => ({
      type: "A",
      name: i === 0 ? domainName : (i === 1 ? `www.${domainName}` : `server${i}.${domainName}`),
      value: generateIpv4(),
      ttl: 3600,
      class: "IN"
    }));
    
    // Generate AAAA records
    const aaaaRecords = Array(Math.floor(Math.random() * 2)).fill(null).map((_, i) => ({
      type: "AAAA",
      name: domainName,
      value: generateIpv6(),
      ttl: 3600,
      class: "IN"
    }));
    
    // Generate MX records
    const mxProviders = ["google.com", "outlook.com", "zoho.com", "mail.protection.outlook.com"];
    const mxRecords = Array(Math.floor(Math.random() * 3) + 1).fill(null).map((_, i) => ({
      type: "MX",
      name: domainName,
      value: `alt${i+1}.aspmx.l.${mxProviders[Math.floor(Math.random() * mxProviders.length)]}`,
      ttl: 3600,
      priority: (i + 1) * 10,
      class: "IN"
    }));
    
    // Generate CNAME records
    const cnameRecords = Array(Math.floor(Math.random() * 3)).fill(null).map((_, i) => {
      const subdomains = ["mail", "blog", "shop", "app", "cdn", "api"];
      return {
        type: "CNAME",
        name: `${subdomains[Math.floor(Math.random() * subdomains.length)]}.${domainName}`,
        value: `${domainName.split('.')[0]}.${Math.random() > 0.5 ? 'netlify.app' : 'vercel.app'}`,
        ttl: 3600,
        class: "IN"
      };
    });
    
    // Generate TXT records
    const txtRecordTemplates = [
      `v=spf1 include:_spf.${mxProviders[Math.floor(Math.random() * mxProviders.length)]} ~all`,
      `google-site-verification=${Math.random().toString(36).substring(2, 15)}`,
      `MS=${Math.random().toString(36).substring(2, 15)}`,
      `stripe-verification=${Math.random().toString(36).substring(2, 15)}`,
      `apple-domain-verification=${Math.random().toString(36).substring(2, 15)}`
    ];
    const txtRecords = Array(Math.floor(Math.random() * 3) + 1).fill(null).map((_, i) => ({
      type: "TXT",
      name: domainName,
      value: txtRecordTemplates[Math.floor(Math.random() * txtRecordTemplates.length)],
      ttl: 3600,
      class: "IN"
    }));
    
    // Generate NS records
    const nsProviders = [
      ["ns1.example.com", "ns2.example.com"],
      ["ns-1.awsdns.com", "ns-2.awsdns.net"],
      ["ns1.cloudflare.com", "ns2.cloudflare.com"],
      ["ns1.google.com", "ns2.google.com"]
    ];
    const selectedNsProvider = nsProviders[Math.floor(Math.random() * nsProviders.length)];
    const nsRecords = selectedNsProvider.map(ns => ({
      type: "NS",
      name: domainName,
      value: ns,
      ttl: 86400,
      class: "IN"
    }));
    
    // Generate SOA record
    const soaRecord = {
      type: "SOA",
      name: domainName,
      value: `${selectedNsProvider[0]} hostmaster.${domainName}. ${Math.floor(Date.now() / 1000)} 10800 3600 604800 38400`,
      ttl: 86400,
      class: "IN"
    };
    
    return {
      domain: domainName,
      recordsByType: {
        A: aRecords,
        AAAA: aaaaRecords,
        MX: mxRecords,
        CNAME: cnameRecords,
        TXT: txtRecords,
        NS: nsRecords,
        SOA: [soaRecord]
      }
    };
  };
  
  const getDNSRecordsForType = (type: string) => {
    if (!results) return [];
    return results.recordsByType[type as keyof typeof results.recordsByType] || [];
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    
    toast({
      description: "Copied to clipboard",
    });
  };
  
  const recordTypes = [
    { value: 'A', label: 'A (IPv4 Address)' },
    { value: 'AAAA', label: 'AAAA (IPv6 Address)' },
    { value: 'MX', label: 'MX (Mail Exchange)' },
    { value: 'CNAME', label: 'CNAME (Canonical Name)' },
    { value: 'TXT', label: 'TXT (Text)' },
    { value: 'NS', label: 'NS (Name Server)' },
    { value: 'SOA', label: 'SOA (Start of Authority)' }
  ];
  
  const getDigFormattedOutput = () => {
    if (!results) return "";
    
    const records = getDNSRecordsForType(recordType);
    let output = `;; ANSWER SECTION:\n`;
    
    records.forEach(record => {
      if (record.type === 'MX') {
        output += `${record.name}.\t\t${record.ttl}\tIN\t${record.type}\t${record.priority}\t${record.value}.\n`;
      } else {
        output += `${record.name}.\t\t${record.ttl}\tIN\t${record.type}\t${record.value}${['A', 'AAAA'].includes(record.type) ? '' : '.'}\n`;
      }
    });
    
    return output;
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="tool-header">
        <h1>DNS Lookup</h1>
      </div>

      <div className="search-container mb-6">
        <input
          type="text"
          className="search-input"
          placeholder="Enter a domain name..."
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && checkDNS()}
        />
        <button 
          className="search-button"
          onClick={checkDNS}
          disabled={isChecking}
        >
          {isChecking ? "Searching..." : "Search"}
        </button>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-6">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Record Type</label>
                <Select value={recordType} onValueChange={setRecordType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select record type" />
                  </SelectTrigger>
                  <SelectContent>
                    {recordTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {recentLookups.length > 0 && (
              <div className="flex items-center gap-2 overflow-x-auto">
                <span className="text-xs text-gray-500 whitespace-nowrap">Recent:</span>
                {recentLookups.map((lookup, index) => (
                  <Badge 
                    key={index}
                    variant="outline"
                    className="cursor-pointer whitespace-nowrap"
                    onClick={() => {
                      setDomain(lookup.domain);
                      setRecordType(lookup.type);
                      setTimeout(checkDNS, 100);
                    }}
                  >
                    {lookup.domain} ({lookup.type})
                  </Badge>
                ))}
              </div>
            )}
            
            {isChecking && (
              <div className="text-center p-8 bg-gray-50 rounded-md animate-pulse">
                <Server className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Looking up DNS records...</p>
              </div>
            )}
            
            {results && (
              <div>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="formatted">Formatted</TabsTrigger>
                    <TabsTrigger value="dig">Dig Format</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="formatted" className="pt-4">
                    <div className="mb-4 flex justify-between items-center">
                      <h3 className="font-medium">
                        {recordType} Records for {results.domain}
                      </h3>
                    </div>
                    
                    {getDNSRecordsForType(recordType).length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left">Name</th>
                              <th className="px-4 py-3 text-left">Type</th>
                              <th className="px-4 py-3 text-left">Value</th>
                              {recordType === 'MX' && (
                                <th className="px-4 py-3 text-left">Priority</th>
                              )}
                              <th className="px-4 py-3 text-left">TTL</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {getDNSRecordsForType(recordType).map((record, index) => (
                              <tr key={index} className="bg-white hover:bg-gray-50">
                                <td className="px-4 py-3">{record.name}</td>
                                <td className="px-4 py-3">
                                  <Badge variant="outline">{record.type}</Badge>
                                </td>
                                <td className="px-4 py-3 font-mono text-xs">
                                  {record.value}
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => copyToClipboard(record.value)}
                                    className="ml-2 h-6 w-6 p-0"
                                  >
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                </td>
                                {recordType === 'MX' && (
                                  <td className="px-4 py-3">{record.priority}</td>
                                )}
                                <td className="px-4 py-3">{record.ttl}s</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center p-8 bg-gray-50 rounded-md">
                        <p className="text-gray-500">No {recordType} records found for {results.domain}.</p>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="dig" className="pt-4">
                    <div className="mb-4 flex justify-between items-center">
                      <h3 className="font-medium">Dig Format Output</h3>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => copyToClipboard(getDigFormattedOutput())}
                      >
                        <Copy className="mr-1 h-4 w-4" />
                        Copy
                      </Button>
                    </div>
                    
                    <div className="bg-black text-green-400 font-mono text-xs p-4 rounded-md overflow-auto">
                      <pre>
                        {`; <<>> DiG 9.10.6 <<>> ${recordType} ${results.domain}
;; QUESTION SECTION:
;${results.domain}.			IN	${recordType}

${getDigFormattedOutput()}
`}
                      </pre>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
            
            {!isChecking && !results && (
              <div className="text-center p-8 bg-gray-50 rounded-md">
                <Server className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-700">DNS Lookup Tool</h3>
                <p className="text-sm text-gray-500 mt-2">
                  Enter a domain name above to query its DNS records
                </p>
              </div>
            )}
            
            <div className="bg-blue-50 p-4 rounded-md">
              <h3 className="text-sm font-medium text-blue-800 mb-2">DNS Record Types Explained</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-blue-700">
                <div>
                  <Badge variant="outline" className="mb-1 bg-blue-100">A</Badge>
                  <p>Maps a domain to an IPv4 address</p>
                </div>
                <div>
                  <Badge variant="outline" className="mb-1 bg-blue-100">AAAA</Badge>
                  <p>Maps a domain to an IPv6 address</p>
                </div>
                <div>
                  <Badge variant="outline" className="mb-1 bg-blue-100">MX</Badge>
                  <p>Specifies mail servers responsible for receiving email</p>
                </div>
                <div>
                  <Badge variant="outline" className="mb-1 bg-blue-100">CNAME</Badge>
                  <p>Creates an alias pointing to another domain name</p>
                </div>
                <div>
                  <Badge variant="outline" className="mb-1 bg-blue-100">TXT</Badge>
                  <p>Stores text information (often used for verification)</p>
                </div>
                <div>
                  <Badge variant="outline" className="mb-1 bg-blue-100">NS</Badge>
                  <p>Specifies authoritative name servers for the domain</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DNSLookupTool;
