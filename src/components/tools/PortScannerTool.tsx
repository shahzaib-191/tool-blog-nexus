
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Shield, AlertTriangle, CheckCircle, Server } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import ToolHeader from './ToolHeader';

interface ScanResult {
  port: number;
  service: string;
  status: 'open' | 'closed' | 'filtered';
}

const PortScannerTool: React.FC = () => {
  const { toast } = useToast();
  const [host, setHost] = useState('');
  const [portRange, setPortRange] = useState('1-100');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [scanProgress, setScanProgress] = useState(0);
  
  const commonServices: Record<number, string> = {
    21: 'FTP',
    22: 'SSH',
    23: 'Telnet',
    25: 'SMTP',
    53: 'DNS',
    80: 'HTTP',
    110: 'POP3',
    143: 'IMAP',
    443: 'HTTPS',
    465: 'SMTPS',
    587: 'SMTP (submission)',
    993: 'IMAPS',
    995: 'POP3S',
    3306: 'MySQL',
    5432: 'PostgreSQL',
    8080: 'HTTP Alt',
    8443: 'HTTPS Alt'
  };
  
  const scanPorts = () => {
    // Validate host
    if (!host) {
      toast({
        title: "Host required",
        description: "Please enter a valid hostname or IP address",
        variant: "destructive",
      });
      return;
    }
    
    // Validate port range format
    const rangeRegex = /^\d+(-\d+)?$/;
    if (!rangeRegex.test(portRange)) {
      toast({
        title: "Invalid port range",
        description: "Please enter a valid port range (e.g., 1-100 or 80)",
        variant: "destructive",
      });
      return;
    }
    
    // Parse port range
    let startPort = 1;
    let endPort = 100;
    
    if (portRange.includes('-')) {
      const [start, end] = portRange.split('-').map(Number);
      startPort = start;
      endPort = end;
      
      // Validate port range values
      if (startPort < 1 || endPort > 65535 || startPort > endPort) {
        toast({
          title: "Invalid port range",
          description: "Ports must be between 1-65535, and start port must be less than end port",
          variant: "destructive",
        });
        return;
      }
      
      // Limit range for demo purposes
      if (endPort - startPort > 100) {
        toast({
          title: "Port range limited",
          description: "For demonstration purposes, please scan a maximum of 100 ports at once",
          variant: "destructive",
        });
        return;
      }
    } else {
      // Single port
      startPort = endPort = Number(portRange);
    }
    
    setIsScanning(true);
    setScanResults([]);
    setScanProgress(0);
    
    // Simulate scanning process
    let results: ScanResult[] = [];
    let currentPort = startPort;
    const totalPorts = endPort - startPort + 1;
    
    // Mock scan function that "scans" one port at a time
    const scanNextPort = () => {
      if (currentPort > endPort) {
        // Scanning complete
        setIsScanning(false);
        setScanProgress(100);
        
        // Sort results by port number
        results.sort((a, b) => a.port - b.port);
        setScanResults(results);
        
        toast({
          title: "Scan complete",
          description: `Scanned ${totalPorts} ports on ${host}`,
        });
        return;
      }
      
      // Calculate progress
      const progress = Math.floor(((currentPort - startPort + 1) / totalPorts) * 100);
      setScanProgress(progress);
      
      // Generate a random scan result (in a real app, this would be an actual network request)
      const portStatus: 'open' | 'closed' | 'filtered' = 
        currentPort in commonServices ? 
          (Math.random() > 0.7 ? 'open' : 'closed') : 
          (Math.random() > 0.95 ? 'open' : Math.random() > 0.8 ? 'filtered' : 'closed');
      
      // Only add open or filtered ports to results for cleaner output
      if (portStatus !== 'closed') {
        results.push({
          port: currentPort,
          service: commonServices[currentPort] || 'unknown',
          status: portStatus
        });
      }
      
      currentPort++;
      setTimeout(scanNextPort, Math.random() * 50 + 20); // Random delay for realism
    };
    
    // Start the scanning process
    scanNextPort();
  };
  
  const getStatusBadge = (status: 'open' | 'closed' | 'filtered') => {
    switch (status) {
      case 'open':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            Open
          </Badge>
        );
      case 'filtered':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <Shield className="h-3 w-3 mr-1" />
            Filtered
          </Badge>
        );
      case 'closed':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Closed
          </Badge>
        );
    }
  };

  return (
    <>
      <ToolHeader
        title="Port Scanner"
        description="Scan for open ports on a server to check for security vulnerabilities and available services."
      />
      
      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Host</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Server className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                      type="text"
                      placeholder="Enter hostname or IP address (e.g., example.com)"
                      value={host}
                      onChange={(e) => setHost(e.target.value)}
                      className="pl-10"
                      disabled={isScanning}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Port Range</label>
                  <Input
                    type="text"
                    placeholder="e.g., 1-100 or 80"
                    value={portRange}
                    onChange={(e) => setPortRange(e.target.value)}
                    disabled={isScanning}
                  />
                </div>
              </div>
              
              <div>
                <Button 
                  onClick={scanPorts}
                  disabled={isScanning}
                  className="w-full md:w-auto"
                >
                  {isScanning ? (
                    <>
                      <svg className="animate-spin mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Scanning... ({scanProgress}%)
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Scan Ports
                    </>
                  )}
                </Button>
                
                <p className="text-xs text-gray-500 mt-1">
                  Note: This is a simulated port scanner for demonstration purposes only.
                </p>
              </div>
              
              {isScanning && (
                <div className="bg-blue-50 p-4 rounded-md">
                  <div className="flex items-center">
                    <div className="w-full bg-blue-200 rounded-full h-2.5">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${scanProgress}%` }}></div>
                    </div>
                    <span className="ml-2 text-sm text-blue-600">{scanProgress}%</span>
                  </div>
                  <p className="text-sm text-blue-700 mt-2">
                    Scanning ports {portRange} on {host}...
                  </p>
                </div>
              )}
              
              {scanResults.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-4">Scan Results for {host}</h3>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                          <th className="px-4 py-3">Port</th>
                          <th className="px-4 py-3">Service</th>
                          <th className="px-4 py-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {scanResults.map((result) => (
                          <tr key={result.port} className="bg-white hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium">{result.port}</td>
                            <td className="px-4 py-3">{result.service}</td>
                            <td className="px-4 py-3">
                              {getStatusBadge(result.status)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {scanResults.length === 0 && !isScanning && (
                    <div className="text-center p-8 bg-gray-50 rounded-md">
                      <p className="text-gray-500">No open ports found on {host}.</p>
                    </div>
                  )}
                </div>
              )}
              
              {!isScanning && scanResults.length === 0 && (
                <div className="text-center p-8 bg-gray-50 rounded-md">
                  <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-700">Port Scanner</h3>
                  <p className="text-sm text-gray-500 mt-2">
                    Enter a hostname or IP address above to scan for open ports
                  </p>
                </div>
              )}
              
              <div className="bg-blue-50 p-4 rounded-md">
                <h3 className="text-sm font-medium text-blue-800 mb-2">What is a Port Scanner?</h3>
                <p className="text-xs text-blue-700">
                  A port scanner is a tool that checks a server or host for open ports. Open ports can indicate 
                  running services that might be vulnerable to attacks if not properly secured. Port scanning is 
                  commonly used by network administrators to verify security policies and by attackers to identify 
                  running services they can exploit.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default PortScannerTool;
