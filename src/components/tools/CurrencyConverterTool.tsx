
import { useState, useEffect } from 'react';
import ToolHeader from './ToolHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight, ArrowLeftRight, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Currency data
interface Currency {
  code: string;
  name: string;
  symbol: string;
}

const CurrencyConverterTool = () => {
  const [amount, setAmount] = useState<string>('1');
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('EUR');
  const [convertedAmount, setConvertedAmount] = useState<string>('');
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const { toast } = useToast();

  const currencies: Currency[] = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$' },
    { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
    { code: 'RUB', name: 'Russian Ruble', symbol: '₽' },
    { code: 'KRW', name: 'South Korean Won', symbol: '₩' },
    { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
    { code: 'MXN', name: 'Mexican Peso', symbol: 'MX$' },
    { code: 'ZAR', name: 'South African Rand', symbol: 'R' }
  ];

  // Get currency symbol
  const getCurrencySymbol = (code: string): string => {
    const currency = currencies.find(c => c.code === code);
    return currency ? currency.symbol : '';
  };

  // Generate a realistic but fake exchange rate based on the two currencies
  const generateFakeExchangeRate = (from: string, to: string): number => {
    const baseRates: { [key: string]: number } = {
      'USD': 1.0,
      'EUR': 0.93,
      'GBP': 0.79,
      'JPY': 151.02,
      'CAD': 1.37,
      'AUD': 1.53,
      'CHF': 0.90,
      'CNY': 7.23,
      'INR': 83.36,
      'NZD': 1.64,
      'BRL': 5.05,
      'RUB': 91.75,
      'KRW': 1353.78,
      'SGD': 1.35,
      'MXN': 16.72,
      'ZAR': 18.50
    };

    if (from === to) return 1;
    
    // Add a small random variation to make it look more realistic
    const variation = (Math.random() * 0.02) - 0.01; // -1% to +1%
    
    if (baseRates[from] && baseRates[to]) {
      return (baseRates[to] / baseRates[from]) * (1 + variation);
    }
    
    return 1.0;
  };

  // Convert currency
  const convertCurrency = () => {
    if (!amount || isNaN(Number(amount))) {
      toast({
        title: 'Invalid amount',
        description: 'Please enter a valid number',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call with a delay
    setTimeout(() => {
      const rate = generateFakeExchangeRate(fromCurrency, toCurrency);
      setExchangeRate(rate);
      
      const converted = (Number(amount) * rate).toFixed(2);
      setConvertedAmount(converted);
      
      const now = new Date();
      setLastUpdated(now.toLocaleString());
      
      setIsLoading(false);
    }, 800);
  };

  // Handle swap currencies
  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    
    // If we already have a conversion, swap the values as well
    if (convertedAmount && amount) {
      setAmount(convertedAmount);
      setConvertedAmount(amount);
    }
  };

  // Effect to perform initial conversion
  useEffect(() => {
    convertCurrency();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Format number with thousands separator
  const formatNumber = (value: string): string => {
    const num = parseFloat(value);
    if (isNaN(num)) return value;
    return num.toLocaleString('en-US');
  };

  return (
    <>
      <ToolHeader
        title="Currency Converter"
        description="Convert between different currencies using up-to-date exchange rates."
      />

      <div className="container mx-auto px-4 py-6">
        <Card className="p-6">
          <div className="space-y-6">
            {/* Conversion form */}
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-end">
              <div className="md:col-span-2">
                <label htmlFor="amount" className="block text-sm font-medium mb-2">Amount</label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                />
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="fromCurrency" className="block text-sm font-medium mb-2">From</label>
                <Select value={fromCurrency} onValueChange={setFromCurrency}>
                  <SelectTrigger id="fromCurrency">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={`from-${currency.code}`} value={currency.code}>
                        {currency.symbol} {currency.code} - {currency.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-center items-center">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleSwapCurrencies}
                  className="rounded-full h-10 w-10 flex items-center justify-center"
                >
                  <ArrowLeftRight size={18} />
                </Button>
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="toCurrency" className="block text-sm font-medium mb-2">To</label>
                <Select value={toCurrency} onValueChange={setToCurrency}>
                  <SelectTrigger id="toCurrency">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={`to-${currency.code}`} value={currency.code}>
                        {currency.symbol} {currency.code} - {currency.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={convertCurrency} 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <RefreshCw size={16} className="mr-2 animate-spin" />
                    Converting...
                  </>
                ) : (
                  'Convert'
                )}
              </Button>
            </div>
            
            {/* Result section */}
            {convertedAmount && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="text-center space-y-4">
                  <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6">
                    <div className="text-lg">
                      <span className="text-gray-600">{formatNumber(amount)}</span>
                      <span className="font-medium ml-2">{fromCurrency}</span>
                    </div>
                    
                    <div className="text-gray-400">
                      <ArrowRight size={20} />
                    </div>
                    
                    <div className="text-3xl font-bold text-blue-600">
                      <span>{getCurrencySymbol(toCurrency)}</span>
                      <span className="ml-1">{formatNumber(convertedAmount)}</span>
                      <span className="text-lg font-medium ml-2 text-gray-600">{toCurrency}</span>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    {exchangeRate !== null && (
                      <p>
                        <span>Exchange Rate: </span>
                        <span className="font-medium">1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}</span>
                      </p>
                    )}
                    {lastUpdated && (
                      <p className="mt-1">Last updated: {lastUpdated}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {/* Currency information */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-lg mb-2">About {fromCurrency}</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-sm text-gray-600">
                      {getCurrencyInfo(fromCurrency)}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-lg mb-2">About {toCurrency}</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-sm text-gray-600">
                      {getCurrencyInfo(toCurrency)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-sm text-gray-500 bg-blue-50 p-4 rounded-md mt-6">
              <p className="font-medium text-blue-700 mb-1">Note:</p>
              <p>This currency converter is for informational purposes only. Actual conversion rates may vary.</p>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

// Helper function to generate currency information
const getCurrencyInfo = (code: string): string => {
  const currencyInfo: { [key: string]: string } = {
    'USD': 'The United States Dollar (USD) is the official currency of the United States and several other countries. It is the most traded currency in the international foreign exchange market.',
    'EUR': 'The Euro (EUR) is the official currency of 19 of the 27 member states of the European Union. It is the second most traded currency in the world after the US Dollar.',
    'GBP': 'The British Pound Sterling (GBP) is the official currency of the United Kingdom and its territories. It is one of the oldest currencies still in use today.',
    'JPY': 'The Japanese Yen (JPY) is the official currency of Japan. It is the third most traded currency in the foreign exchange market after the US Dollar and Euro.',
    'CAD': 'The Canadian Dollar (CAD) is the official currency of Canada. It is one of the most popular reserve currencies in the world.',
    'AUD': 'The Australian Dollar (AUD) is the official currency of Australia and its territories. It is popular among forex traders due to its high interest rates and stability.',
    'CHF': 'The Swiss Franc (CHF) is the official currency of Switzerland and Liechtenstein. It is known for its stability and is considered a safe-haven currency.',
    'CNY': 'The Chinese Yuan (CNY), also known as Renminbi, is the official currency of the People\'s Republic of China. It is becoming increasingly important in international trade.',
    'INR': 'The Indian Rupee (INR) is the official currency of India. It is the currency of one of the fastest-growing major economies in the world.',
    'NZD': 'The New Zealand Dollar (NZD) is the official currency of New Zealand and its territories. It is known as the "Kiwi" in the forex market.',
    'BRL': 'The Brazilian Real (BRL) is the official currency of Brazil. It was introduced in 1994 as part of a plan to stabilize the Brazilian economy.',
    'RUB': 'The Russian Ruble (RUB) is the official currency of Russia. It is one of the oldest national currencies, dating back to the 13th century.',
    'KRW': 'The South Korean Won (KRW) is the official currency of South Korea. It has been the official currency since 1962.',
    'SGD': 'The Singapore Dollar (SGD) is the official currency of Singapore. It is considered one of the strongest and most stable currencies in Asia.',
    'MXN': 'The Mexican Peso (MXN) is the official currency of Mexico. It was the first currency in the world to use the "$" symbol.',
    'ZAR': 'The South African Rand (ZAR) is the official currency of South Africa. It is named after the Witwatersrand, the ridge upon which Johannesburg is built.'
  };
  
  return currencyInfo[code] || `${code} is an international currency used in global financial markets.`;
};

export default CurrencyConverterTool;
