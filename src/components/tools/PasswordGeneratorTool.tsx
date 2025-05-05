
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Copy, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import ToolHeader from './ToolHeader';

const PasswordGeneratorTool: React.FC = () => {
  const { toast } = useToast();
  const [password, setPassword] = useState('');
  const [passwordLength, setPasswordLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | 'very-strong'>('medium');

  useEffect(() => {
    generatePassword();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generatePassword = () => {
    // Ensure at least one character type is selected
    if (!includeUppercase && !includeLowercase && !includeNumbers && !includeSymbols) {
      toast({
        title: "Error",
        description: "Please select at least one character type",
        variant: "destructive",
      });
      return;
    }

    // Define character sets
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()-_=+[]{}|;:,.<>?';

    // Create character pool based on selected options
    let charPool = '';
    if (includeUppercase) charPool += uppercaseChars;
    if (includeLowercase) charPool += lowercaseChars;
    if (includeNumbers) charPool += numberChars;
    if (includeSymbols) charPool += symbolChars;

    // Generate password
    let newPassword = '';
    const charPoolLength = charPool.length;
    
    // Ensure we include at least one character from each selected type
    if (includeUppercase) 
      newPassword += uppercaseChars.charAt(Math.floor(Math.random() * uppercaseChars.length));
    if (includeLowercase) 
      newPassword += lowercaseChars.charAt(Math.floor(Math.random() * lowercaseChars.length));
    if (includeNumbers) 
      newPassword += numberChars.charAt(Math.floor(Math.random() * numberChars.length));
    if (includeSymbols) 
      newPassword += symbolChars.charAt(Math.floor(Math.random() * symbolChars.length));
    
    // Fill rest of password length with random characters from the pool
    for (let i = newPassword.length; i < passwordLength; i++) {
      newPassword += charPool.charAt(Math.floor(Math.random() * charPoolLength));
    }

    // Shuffle the password characters
    newPassword = newPassword.split('').sort(() => 0.5 - Math.random()).join('');
    
    setPassword(newPassword);
    calculatePasswordStrength(newPassword);
  };

  const calculatePasswordStrength = (pwd: string) => {
    let strength = 0;
    
    // Length check
    if (pwd.length >= 8) strength += 1;
    if (pwd.length >= 12) strength += 1;
    if (pwd.length >= 16) strength += 1;
    
    // Character variety check
    if (/[A-Z]/.test(pwd)) strength += 1;
    if (/[a-z]/.test(pwd)) strength += 1;
    if (/[0-9]/.test(pwd)) strength += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) strength += 1;
    
    // Set strength category
    if (strength <= 3) setPasswordStrength('weak');
    else if (strength <= 5) setPasswordStrength('medium');
    else if (strength <= 7) setPasswordStrength('strong');
    else setPasswordStrength('very-strong');
  };

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case 'weak': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'strong': return 'bg-green-500';
      case 'very-strong': return 'bg-green-600';
      default: return 'bg-gray-300';
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    toast({
      title: "Copied!",
      description: "Password copied to clipboard",
    });
  };

  return (
    <>
      <ToolHeader 
        title="Password Generator" 
        description="Create strong, secure passwords for your accounts."
      />

      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-6">
              {/* Password Display */}
              <div>
                <Label>Generated Password</Label>
                <div className="flex mt-1">
                  <Input
                    value={password}
                    readOnly
                    className="font-mono text-base"
                  />
                  <Button variant="outline" onClick={copyToClipboard} className="ml-2 whitespace-nowrap">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
                
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Strength:</span>
                    <Badge variant={passwordStrength === 'weak' ? 'destructive' : 'default'} className="capitalize">
                      {passwordStrength}
                    </Badge>
                  </div>
                  
                  <div className="w-1/2 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getStrengthColor()}`} 
                      style={{ 
                        width: passwordStrength === 'weak' ? '25%' : 
                               passwordStrength === 'medium' ? '50%' : 
                               passwordStrength === 'strong' ? '75%' : '100%' 
                      }} 
                    />
                  </div>
                </div>
              </div>
              
              {/* Settings */}
              <div className="bg-gray-50 p-4 rounded-md">
                <Label className="mb-3 block">Password Settings</Label>
                
                <div className="mb-6">
                  <div className="flex justify-between mb-1">
                    <span>Length: {passwordLength}</span>
                  </div>
                  <Slider 
                    value={[passwordLength]} 
                    min={6} 
                    max={32} 
                    step={1} 
                    onValueChange={(value) => setPasswordLength(value[0])} 
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>6</span>
                    <span>16</span>
                    <span>32</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="include-uppercase" className="cursor-pointer">Include Uppercase Letters (A-Z)</Label>
                    <Switch 
                      id="include-uppercase" 
                      checked={includeUppercase} 
                      onCheckedChange={setIncludeUppercase} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="include-lowercase" className="cursor-pointer">Include Lowercase Letters (a-z)</Label>
                    <Switch 
                      id="include-lowercase" 
                      checked={includeLowercase} 
                      onCheckedChange={setIncludeLowercase} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="include-numbers" className="cursor-pointer">Include Numbers (0-9)</Label>
                    <Switch 
                      id="include-numbers" 
                      checked={includeNumbers} 
                      onCheckedChange={setIncludeNumbers} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="include-symbols" className="cursor-pointer">Include Symbols (!@#$%)</Label>
                    <Switch 
                      id="include-symbols" 
                      checked={includeSymbols} 
                      onCheckedChange={setIncludeSymbols} 
                    />
                  </div>
                </div>
              </div>
              
              {/* Generate Button */}
              <Button onClick={generatePassword} className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Generate New Password
              </Button>
              
              {/* Tips */}
              <div className="text-sm text-gray-600 space-y-2 bg-blue-50 p-4 rounded-md">
                <p className="font-medium">Password Security Tips:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Use a different password for each account</li>
                  <li>Never share your passwords with others</li>
                  <li>Consider using a password manager</li>
                  <li>Enable two-factor authentication when available</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default PasswordGeneratorTool;
