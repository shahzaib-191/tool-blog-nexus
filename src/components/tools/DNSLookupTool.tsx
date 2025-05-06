
import React, { useState } from 'react';
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
      ["ns1.example-registrar.com", "ns2.example-registrar.com"],
      ["ns1.cloudflare.com", "ns2.cloudflare.com"],
      ["ns1.digitalocean.com", "ns2.digitalocean.com", "ns3.digitalocean.com"],
      ["ns1.vercel-dns.com", "ns2.vercel-dns.com"]
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
      value: `${selectedNsProvider[0]}. hostmaster.${domainName}. ${Math.floor(Math.random() * 1000000)} 10800 3600 604800 38400`,
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
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    
    toast({
      description: "Content copied to clipboard",
    });
  };
  
  const checkRecentLookup = (lookup: {domain: string, type: string}) => {
    setDomain(lookup.domain);
    setRecordType(lookup.type);
    setTimeout(() => checkDNS(), 100);
  };
  
  const getRecordTypeDescription = (type: string) => {
    const descriptions: Record<string, string> = {
      A: "Maps domain names to IPv4 addresses",
      AAAA: "Maps domain names to IPv6 addresses",
      CNAME: "Creates an alias pointing to another domain",
      MX: "Specifies mail servers for the domain",
      TXT: "Stores text information (SPF, DKIM, etc.)",
      NS: "Specifies authoritative name servers",
      SOA: "Start of Authority record with admin info"
    };
    
    return descriptions[type] || "DNS record type";
  };
  
  const formatSOARecord = (value: string) => {
    const parts = value.split(' ');
    if (parts.length < 7) return value;
    
    return (
      <div className="space-y-1">
        <div>Primary NS: {parts[0]}</div>
        <div>Admin Email: {parts[1]}</div>
        <div>Serial: {parts[2]}</div>
        <div>Refresh: {parts[3]}</div>
        <div>Retry: {parts[4]}</div>
        <div>Expire: {parts[5]}</div>
        <div>Min TTL: {parts[6]}</div>
      </div>
    );
  };

  return (
    <>
      <ToolHeader
        title="DNS Lookup"
        description="Look up DNS records for a domain name to check its configuration."
      />
      
      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Domain Name</label>
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="flex-1">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Globe className="h-4 w-4 text-gray-400" />
                      </div>
                      <Input
                        type="text"
                        placeholder="Enter domain name (e.g., example.com)"
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                        className="pl-10"
                        onKeyPress={(e) => e.key === 'Enter' && checkDNS()}
                      />
                    </div>
                  </div>
                  
                  <div className="w-full md:w-44">
                    <Select value={recordType} onValueChange={setRecordType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Record Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A">A Record</SelectItem>
                        <SelectItem value="AAAA">AAAA Record</SelectItem>
                        <SelectItem value="CNAME">CNAME Record</SelectItem>
                        <SelectItem value="MX">MX Record</SelectItem>
                        <SelectItem value="TXT">TXT Record</SelectItem>
                        <SelectItem value="NS">NS Record</SelectItem>
                        <SelectItem value="SOA">SOA Record</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button 
                    onClick={checkDNS}
                    disabled={isChecking}
                    className="w-full md:w-auto"
                  >
                    {isChecking ? (
                      <>
                        <svg className="animate-spin mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Checking...
                      </>
                    ) : "Lookup DNS"}
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Enter a domain name without http:// or www
                </p>
              </div>
              
              {recentLookups.length > 0 && (
                <div>
                  <div className="text-sm font-medium mb-2">Recent Lookups</div>
                  <div className="flex flex-wrap gap-2">
                    {recentLookups.map((lookup, index) => (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className="cursor-pointer hover:bg-gray-100"
                        onClick={() => checkRecentLookup(lookup)}
                      >
                        {lookup.domain} ({lookup.type})
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {isChecking && (
                <div className="text-center p-8 rounded-md bg-gray-50 animate-pulse">
                  <Server className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Looking up DNS records...</p>
                </div>
              )}
              
              {results && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">DNS Records for {results.domain}</h3>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => checkDNS()}
                      >
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Refresh
                      </Button>
                    </div>
                  </div>
                  
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="formatted">Formatted View</TabsTrigger>
                      <TabsTrigger value="table">Table View</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="formatted" className="mt-6">
                      <div className="bg-gray-50 p-4 rounded-md mb-6">
                        <div className="flex items-center gap-2 mb-3">
                          <Server className="h-5 w-5 text-blue-500" />
                          <h3 className="font-medium">
                            {recordType} Records
                            <span className="ml-2 text-xs text-gray-500">
                              {getRecordTypeDescription(recordType)}
                            </span>
                          </h3>
                        </div>
                        
                        {results.recordsByType[recordType as keyof typeof results.recordsByType]?.length > 0 ? (
                          <div className="space-y-2">
                            {results.recordsByType[recordType as keyof typeof results.recordsByType].map((record, index) => (
                              <div key={index} className="bg-white p-3 rounded-md border">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <div className="font-mono text-sm">
                                      {record.name}
                                    </div>
                                    <div className="mt-1 text-xs text-gray-500">
                                      TTL: {record.ttl} seconds
                                    </div>
                                    {record.priority !== undefined && (
                                      <div className="mt-1 text-xs text-gray-500">
                                        Priority: {record.priority}
                                      </div>
                                    )}
                                  </div>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => copyToClipboard(record.value)}
                                  >
                                    <Copy className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                                <div className="mt-2 pt-2 border-t">
                                  <div className="font-medium text-xs text-gray-500 mb-1">Value:</div>
                                  <div className="font-mono text-sm break-all">
                                    {recordType === 'SOA' ? formatSOARecord(record.value) : record.value}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="bg-white p-3 rounded-md border text-center">
                            <p className="text-gray-500">No {recordType} records found for {results.domain}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-md">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="font-medium">All DNS Record Types</h3>
                          <div className="text-xs text-gray-500">
                            View other record types
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {Object.keys(results.recordsByType).map((type) => (
                            <Badge 
                              key={type} 
                              variant={recordType === type ? "default" : "outline"}
                              className="cursor-pointer"
                              onClick={() => setRecordType(type)}
                            >
                              {type}: {results.recordsByType[type as keyof typeof results.recordsByType].length} records
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="table" className="mt-6">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 border rounded-lg">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TTL</th>
                              {recordType === 'MX' && (
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                              )}
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {results.recordsByType[recordType as keyof typeof results.recordsByType]?.map((record, index) => (
                              <tr key={index} className="hover:bg-gray-50">
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                                  <Badge variant="outline">{record.type}</Badge>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-mono">
                                  {record.name}
                                </td>
                                <td className="px-4 py-3 text-sm font-mono max-w-[300px] truncate">
                                  {record.value}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm">
                                  {record.ttl}
                                </td>
                                {recordType === 'MX' && (
                                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                                    {record.priority}
                                  </td>
                                )}
                                <td className="px-4 py-3 whitespace-nowrap text-sm">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => copyToClipboard(record.value)}
                                  >
                                    <Copy className="h-3.5 w-3.5" />
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </TabsContent>
                  </Tabs>
                  
                  <div className="bg-blue-50 p-4 rounded-md">
                    <h3 className="text-sm font-medium text-blue-800 mb-2">What are DNS Records?</h3>
                    <p className="text-xs text-blue-700">
                      DNS (Domain Name System) records are instructions that live in authoritative DNS servers and provide information about a domain including what IP address is associated with that domain and how to handle requests for that domain. These records consist of a series of text files written in what is known as DNS syntax. DNS syntax is just a string of characters used as commands that tell the DNS server what to do.
                    </p>
                  </div>
                </div>
              )}
              
              {!isChecking && !results && (
                <div className="text-center p-8 bg-gray-50 rounded-md">
                  <Server className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-700">DNS Record Lookup</h3>
                  <p className="text-sm text-gray-500 mt-2">
                    Enter a domain name above to check its DNS records
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default DNSLookupTool;
