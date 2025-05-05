
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Copy, RefreshCw, ShieldCheck } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const PasswordGeneratorTool = () => {
  const [password, setPassword] = useState<string>('');
  const [length, setLength] = useState<number>(12);
  const [useUppercase, setUseUppercase] = useState<boolean>(true);
  const [useNumbers, setUseNumbers] = useState<boolean>(true);
  const [useSymbols, setUseSymbols] = useState<boolean>(true);
  const [strength, setStrength] = useState<number>(0);
  
  // Generate password on initial load
  useState(() => {
    generatePassword();
  });
  
  const generatePassword = () => {
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    let availableChars = lowercaseChars;
    
    if (useUppercase) availableChars += uppercaseChars;
    if (useNumbers) availableChars += numberChars;
    if (useSymbols) availableChars += symbolChars;
    
    if (availableChars === lowercaseChars) {
      toast({
        title: "Warning",
        description: "Using only lowercase letters will create a weak password",
        variant: "warning",
      });
    }
    
    let generatedPassword = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * availableChars.length);
      generatedPassword += availableChars[randomIndex];
    }
    
    setPassword(generatedPassword);
    calculatePasswordStrength(generatedPassword);
  };
  
  const calculatePasswordStrength = (pass: string) => {
    // Simple password strength calculation
    let score = 0;
    
    // Length factor (up to 40 points)
    score += Math.min(40, pass.length * 2);
    
    // Character variety
    if (/[A-Z]/.test(pass)) score += 15;   // Has uppercase
    if (/[0-9]/.test(pass)) score += 15;   // Has numbers
    if (/[^A-Za-z0-9]/.test(pass)) score += 20;   // Has symbols
    
    // Variety of characters (up to 10 points)
    const uniqueChars = new Set(pass).size;
    score += Math.min(10, uniqueChars);
    
    setStrength(Math.min(100, score));
  };
  
  const getStrengthLabel = () => {
    if (strength < 40) return { label: "Very Weak", color: "bg-red-500" };
    if (strength < 60) return { label: "Weak", color: "bg-orange-500" };
    if (strength < 80) return { label: "Good", color: "bg-yellow-500" };
    return { label: "Strong", color: "bg-green-500" };
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    toast({
      title: "Copied!",
      description: "Password copied to clipboard",
    });
  };

  return (
    <div className="container max-w-md mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex justify-center items-center gap-2">
            <ShieldCheck className="h-5 w-5" />
            Password Generator
          </CardTitle>
          <p className="text-sm text-muted-foreground">Create strong, secure passwords</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center">
            <div className="w-full bg-slate-100 dark:bg-slate-800 p-3 rounded-l-md font-mono text-lg">
              {password}
            </div>
            <Button 
              variant="outline" 
              className="rounded-l-none" 
              onClick={copyToClipboard}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Password Strength:</span>
              <span>{getStrengthLabel().label}</span>
            </div>
            <Progress value={strength} className={getStrengthLabel().color} />
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Password Length: {length}</Label>
              </div>
              <Slider
                value={[length]}
                min={4}
                max={32}
                step={1}
                onValueChange={(values) => setLength(values[0])}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Options</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="uppercase" 
                    checked={useUppercase}
                    onCheckedChange={(checked) => setUseUppercase(!!checked)}
                  />
                  <Label htmlFor="uppercase">Include uppercase letters (A-Z)</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="numbers" 
                    checked={useNumbers}
                    onCheckedChange={(checked) => setUseNumbers(!!checked)}
                  />
                  <Label htmlFor="numbers">Include numbers (0-9)</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="symbols" 
                    checked={useSymbols}
                    onCheckedChange={(checked) => setUseSymbols(!!checked)}
                  />
                  <Label htmlFor="symbols">Include symbols (!@#$%...)</Label>
                </div>
              </div>
            </div>
            
            <Button className="w-full" onClick={generatePassword}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Generate New Password
            </Button>
          </div>
          
          <div className="text-xs text-muted-foreground text-center pt-2">
            All passwords are generated client-side and are not stored or transmitted.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PasswordGeneratorTool;
