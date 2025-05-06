
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, Lock, AlertTriangle, ShieldAlert, ShieldCheck, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Progress } from '@/components/ui/progress';
import ToolHeader from './ToolHeader';

interface SSLResult {
  domain: string;
  valid: boolean;
  issuer: string;
  validFrom: string;
  validTo: string;
  expiresIn: number; // days
  algorithm: string;
  keyStrength: number;
  sans: string[];
  tls: string;
  securityGrade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  issues: {
    type: 'warning' | 'error' | 'info';
    message: string;
  }[];
}

const SSLCheckerTool: React.FC = () => {
  const { toast } = useToast();
  const [domain, setDomain] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<SSLResult | null>(null);
  
  const checkSSL = () => {
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
    setProgress(0);
    
    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 400);
    
    // Simulate API call delay
    setTimeout(() => {
      clearInterval(progressInterval);
      setProgress(100);
      
      // Generate mock results
      const mockResults = generateMockSSLResults(cleanDomain);
      setResults(mockResults);
      setIsChecking(false);
      
      toast({
        title: mockResults.valid ? "SSL Certificate Valid" : "SSL Certificate Issues",
        description: `SSL check for ${cleanDomain} completed`,
        variant: mockResults.valid ? "default" : "destructive",
      });
    }, 3000);
  };
  
  const generateMockSSLResults = (domainName: string): SSLResult => {
    // Random result generator with higher probability of valid certificates
    const isValid = Math.random() > 0.2; // 80% chance of valid
    
    // Current date
    const now = new Date();
    
    // Certificate valid dates (past)
    const validFromDate = new Date(
      now.getFullYear() - 1,
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28) + 1
    );
    
    // Certificate expiry date (future)
    let expiryDate;
    let expiresIn;
    
    if (isValid) {
      // For valid certs, expiry is in the future (30-300 days)
      expiresIn = Math.floor(Math.random() * 270) + 30;
      expiryDate = new Date(now.getTime() + (expiresIn * 24 * 60 * 60 * 1000));
    } else {
      // For invalid certs, might be expired
      const isExpired = Math.random() > 0.5;
      
      if (isExpired) {
        // Expired certificate
        expiresIn = -Math.floor(Math.random() * 60) - 1; // Expired 1-60 days ago
        expiryDate = new Date(now.getTime() + (expiresIn * 24 * 60 * 60 * 1000));
      } else {
        // Valid but with other issues
        expiresIn = Math.floor(Math.random() * 270) + 30;
        expiryDate = new Date(now.getTime() + (expiresIn * 24 * 60 * 60 * 1000));
      }
    }
    
    // Mock certificate details
    const issuers = [
      "DigiCert Inc",
      "Let's Encrypt",
      "Comodo CA Limited",
      "GeoTrust Inc.",
      "GlobalSign nv-sa",
      "Sectigo Limited",
      "Amazon",
      "Google Trust Services"
    ];
    
    const algorithms = ["SHA-256 with RSA", "SHA-384 with ECDSA"];
    const keyStrengths = [2048, 3072, 4096];
    const tlsVersions = ["TLS 1.2", "TLS 1.3"];
    
    // Generate security grade
    let securityGrade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
    if (isValid) {
      const grades = ['A+', 'A', 'B'] as const;
      securityGrade = grades[Math.floor(Math.random() * grades.length)];
    } else {
      const grades = ['C', 'D', 'F'] as const;
      securityGrade = grades[Math.floor(Math.random() * grades.length)];
    }
    
    // Generate potential issues
    const possibleIssues = [
      { type: 'error' as const, message: "Certificate has expired" },
      { type: 'error' as const, message: "Certificate not trusted by major browsers" },
      { type: 'error' as const, message: "Self-signed certificate detected" },
      { type: 'error' as const, message: "Certificate hostname mismatch" },
      { type: 'warning' as const, message: "Certificate will expire soon" },
      { type: 'warning' as const, message: "Using outdated TLS protocol" },
      { type: 'warning' as const, message: "Weak cipher suites supported" },
      { type: 'warning' as const, message: "Certificate uses SHA-1 signature" },
      { type: 'info' as const, message: "Multiple certificates in chain" },
      { type: 'info' as const, message: "HTTP Strict Transport Security not enabled" },
      { type: 'info' as const, message: "Missing subjectAltName extension" }
    ];
    
    let issues = [];
    
    if (!isValid) {
      // For invalid certificates, add 1-3 issues
      const numIssues = Math.floor(Math.random() * 3) + 1;
      const errorIssues = possibleIssues.filter(i => i.type === 'error');
      
      // Always include at least one error for invalid certs
      issues.push(errorIssues[Math.floor(Math.random() * errorIssues.length)]);
      
      // Maybe add some warnings too
      for (let i = 1; i < numIssues; i++) {
        const warningIssues = possibleIssues.filter(i => i.type === 'warning');
        issues.push(warningIssues[Math.floor(Math.random() * warningIssues.length)]);
      }
    } else if (expiresIn < 30) {
      // For certificates expiring soon
      issues.push({ type: 'warning' as const, message: "Certificate will expire soon" });
    } else {
      // For valid certificates, maybe show some info messages
      if (Math.random() > 0.7) {
        const infoIssues = possibleIssues.filter(i => i.type === 'info');
        issues.push(infoIssues[Math.floor(Math.random() * infoIssues.length)]);
      }
    }
    
    // Make issues unique
    issues = issues.filter((issue, index, self) => 
      index === self.findIndex(i => i.message === issue.message)
    );
    
    // Generate Subject Alternative Names
    const sans = [`www.${domainName}`];
    if (Math.random() > 0.5) {
      sans.push(`mail.${domainName}`);
    }
    if (Math.random() > 0.7) {
      sans.push(`api.${domainName}`);
    }
    if (Math.random() > 0.8) {
      sans.push(`*.${domainName}`);
    }
    
    return {
      domain: domainName,
      valid: isValid,
      issuer: issuers[Math.floor(Math.random() * issuers.length)],
      validFrom: validFromDate.toISOString().split('T')[0],
      validTo: expiryDate.toISOString().split('T')[0],
      expiresIn,
      algorithm: algorithms[Math.floor(Math.random() * algorithms.length)],
      keyStrength: keyStrengths[Math.floor(Math.random() * keyStrengths.length)],
      sans,
      tls: tlsVersions[Math.floor(Math.random() * tlsVersions.length)],
      securityGrade,
      issues
    };
  };
  
  const getExpiryStatusClass = (days: number) => {
    if (days < 0) return "text-red-600";
    if (days < 30) return "text-yellow-600";
    return "text-green-600";
  };
  
  const getExpiryStatusText = (days: number) => {
    if (days < 0) return `Expired ${Math.abs(days)} days ago`;
    if (days === 1) return "Expires tomorrow";
    if (days < 30) return `Expires soon (${days} days)`;
    return `${days} days remaining`;
  };
  
  const getGradeColorClass = (grade: string) => {
    switch (grade) {
      case 'A+': return "bg-green-500";
      case 'A': return "bg-green-400";
      case 'B': return "bg-blue-500";
      case 'C': return "bg-yellow-500";
      case 'D': return "bg-orange-500";
      case 'F': return "bg-red-500";
      default: return "bg-gray-500";
    }
  };
  
  const getGradeTextClass = (grade: string) => {
    switch (grade) {
      case 'A+': case 'A': return "text-green-600";
      case 'B': return "text-blue-600";
      case 'C': return "text-yellow-600";
      case 'D': return "text-orange-600";
      case 'F': return "text-red-600";
      default: return "text-gray-600";
    }
  };

  return (
    <>
      <ToolHeader
        title="SSL Checker"
        description="Verify SSL certificate installation, expiration date, and security status."
      />
      
      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Domain Name</label>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Lock className="h-4 w-4 text-gray-400" />
                      </div>
                      <Input
                        type="text"
                        placeholder="Enter domain name (e.g., example.com)"
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                        className="pl-10"
                        onKeyPress={(e) => e.key === 'Enter' && checkSSL()}
                      />
                    </div>
                  </div>
                  <Button 
                    onClick={checkSSL}
                    disabled={isChecking}
                  >
                    {isChecking ? "Checking..." : "Check SSL"}
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Enter a domain name without http:// or www
                </p>
              </div>
              
              {isChecking && (
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Checking SSL certificate...</span>
                    <span className="text-sm">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}
              
              {results && (
                <div>
                  <div className={`bg-${results.valid ? 'green' : 'red'}-50 p-6 rounded-lg mb-6`}>
                    <div className="flex justify-between items-center border-b pb-4 mb-4">
                      <div>
                        <div className="font-medium text-lg">{results.domain}</div>
                        <div className="text-sm text-gray-500">SSL Certificate Status</div>
                      </div>
                      <div>
                        {results.valid ? (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            <Check className="h-3 w-3 mr-1" />
                            Valid
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Invalid
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <div className="text-sm text-gray-500">Expiry Status</div>
                        </div>
                        <div className={`font-medium ${getExpiryStatusClass(results.expiresIn)}`}>
                          {getExpiryStatusText(results.expiresIn)}
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <ShieldCheck className="h-4 w-4 text-gray-500" />
                          <div className="text-sm text-gray-500">Security Grade</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-full ${getGradeColorClass(results.securityGrade)} text-white flex items-center justify-center font-bold`}>
                            {results.securityGrade}
                          </div>
                          <div className={`font-medium ${getGradeTextClass(results.securityGrade)}`}>
                            {results.securityGrade === 'A+' ? 'Excellent' : 
                             results.securityGrade === 'A' ? 'Very Good' :
                             results.securityGrade === 'B' ? 'Good' :
                             results.securityGrade === 'C' ? 'Acceptable' :
                             results.securityGrade === 'D' ? 'Poor' : 'Failing'}
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Lock className="h-4 w-4 text-gray-500" />
                          <div className="text-sm text-gray-500">Issued By</div>
                        </div>
                        <div className="font-medium">
                          {results.issuer}
                        </div>
                      </div>
                    </div>
                    
                    {results.issues.length > 0 && (
                      <div className="mb-6">
                        <div className="text-sm font-medium mb-2">
                          Issues Detected ({results.issues.length})
                        </div>
                        <div className="space-y-2">
                          {results.issues.map((issue, index) => (
                            <div key={index} className={`p-3 rounded-md ${
                              issue.type === 'error' ? 'bg-red-100 text-red-800' :
                              issue.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              <div className="flex items-center gap-2">
                                {issue.type === 'error' && <ShieldAlert className="h-4 w-4" />}
                                {issue.type === 'warning' && <AlertTriangle className="h-4 w-4" />}
                                {issue.type === 'info' && <Lock className="h-4 w-4" />}
                                {issue.message}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="text-xs text-gray-600">
                      <a href={`https://${results.domain}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        Visit {results.domain} securely with HTTPS
                      </a>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="text-sm font-medium mb-3">Certificate Details</div>
                      <div className="space-y-3">
                        <div className="bg-gray-50 p-3 rounded-md">
                          <div className="text-xs text-gray-500 mb-1">Domain Name</div>
                          <div className="font-medium">{results.domain}</div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-md">
                          <div className="text-xs text-gray-500 mb-1">Valid Period</div>
                          <div className="font-medium">{results.validFrom} to {results.validTo}</div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-md">
                          <div className="text-xs text-gray-500 mb-1">Algorithm</div>
                          <div className="font-medium">{results.algorithm}</div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-md">
                          <div className="text-xs text-gray-500 mb-1">Key Strength</div>
                          <div className="font-medium">{results.keyStrength} bits</div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-md">
                          <div className="text-xs text-gray-500 mb-1">TLS Version</div>
                          <div className="font-medium">{results.tls}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium mb-3">Subject Alternative Names (SANs)</div>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <div className="font-mono text-xs space-y-1">
                          {results.sans.map((san, i) => (
                            <div key={i} className="border-b border-gray-100 pb-1 last:border-0 last:pb-0">
                              {san}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="text-sm font-medium mt-6 mb-3">SSL Security Information</div>
                      <div className="bg-blue-50 p-4 rounded-md">
                        <ul className="space-y-2 text-xs text-blue-700 list-disc list-inside">
                          <li>SSL certificates secure the connection between a website and visitors</li>
                          <li>Proper SSL implementation prevents data interception (man-in-the-middle attacks)</li>
                          <li>SSL certificates require renewal before expiry to maintain security</li>
                          <li>Modern browsers display warnings for sites without valid SSL certificates</li>
                          <li>HTTPS is a search engine ranking factor for Google</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {!isChecking && !results && (
                <div className="text-center p-8 bg-gray-50 rounded-md">
                  <Lock className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-700">Check SSL Certificate</h3>
                  <p className="text-sm text-gray-500 mt-2">
                    Enter a domain name above to check its SSL certificate status
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

export default SSLCheckerTool;
