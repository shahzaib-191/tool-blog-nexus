
import { useState, useEffect } from 'react';
import ToolHeader from './ToolHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRightLeft } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Conversion category types
interface ConversionUnit {
  id: string;
  name: string;
  factor: number; // Conversion factor relative to base unit
  symbol?: string;
}

interface ConversionCategory {
  id: string;
  name: string;
  units: ConversionUnit[];
  baseUnit: string; // The unit that has a factor of 1
}

const UnitConverterTool = () => {
  const [value, setValue] = useState<string>('1');
  const [selectedCategory, setSelectedCategory] = useState<string>('length');
  const [fromUnit, setFromUnit] = useState<string>('');
  const [toUnit, setToUnit] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const { toast } = useToast();

  // Unit conversion categories and their units
  const conversionCategories: ConversionCategory[] = [
    {
      id: 'length',
      name: 'Length',
      baseUnit: 'meter',
      units: [
        { id: 'kilometer', name: 'Kilometers', factor: 0.001, symbol: 'km' },
        { id: 'meter', name: 'Meters', factor: 1, symbol: 'm' },
        { id: 'centimeter', name: 'Centimeters', factor: 100, symbol: 'cm' },
        { id: 'millimeter', name: 'Millimeters', factor: 1000, symbol: 'mm' },
        { id: 'mile', name: 'Miles', factor: 0.0006213712, symbol: 'mi' },
        { id: 'yard', name: 'Yards', factor: 1.0936133, symbol: 'yd' },
        { id: 'foot', name: 'Feet', factor: 3.280839895, symbol: 'ft' },
        { id: 'inch', name: 'Inches', factor: 39.37007874, symbol: 'in' }
      ]
    },
    {
      id: 'weight',
      name: 'Weight',
      baseUnit: 'kilogram',
      units: [
        { id: 'tonne', name: 'Tonnes', factor: 0.001, symbol: 't' },
        { id: 'kilogram', name: 'Kilograms', factor: 1, symbol: 'kg' },
        { id: 'gram', name: 'Grams', factor: 1000, symbol: 'g' },
        { id: 'milligram', name: 'Milligrams', factor: 1000000, symbol: 'mg' },
        { id: 'pound', name: 'Pounds', factor: 2.20462262, symbol: 'lb' },
        { id: 'ounce', name: 'Ounces', factor: 35.27396195, symbol: 'oz' },
        { id: 'stone', name: 'Stone', factor: 0.157473, symbol: 'st' }
      ]
    },
    {
      id: 'volume',
      name: 'Volume',
      baseUnit: 'liter',
      units: [
        { id: 'cubic_meter', name: 'Cubic Meters', factor: 0.001, symbol: 'm³' },
        { id: 'liter', name: 'Liters', factor: 1, symbol: 'L' },
        { id: 'milliliter', name: 'Milliliters', factor: 1000, symbol: 'mL' },
        { id: 'gallon_us', name: 'Gallons (US)', factor: 0.264172, symbol: 'gal' },
        { id: 'gallon_uk', name: 'Gallons (UK)', factor: 0.219969, symbol: 'gal UK' },
        { id: 'quart', name: 'Quarts', factor: 1.05669, symbol: 'qt' },
        { id: 'pint', name: 'Pints', factor: 2.11338, symbol: 'pt' },
        { id: 'fluid_ounce', name: 'Fluid Ounces', factor: 33.814, symbol: 'fl oz' },
        { id: 'cup', name: 'Cups', factor: 4.22675, symbol: 'cup' }
      ]
    },
    {
      id: 'temperature',
      name: 'Temperature',
      baseUnit: 'celsius',
      units: [
        { id: 'celsius', name: 'Celsius', factor: 1, symbol: '°C' },
        { id: 'fahrenheit', name: 'Fahrenheit', factor: 1, symbol: '°F' },
        { id: 'kelvin', name: 'Kelvin', factor: 1, symbol: 'K' }
      ]
    },
    {
      id: 'area',
      name: 'Area',
      baseUnit: 'square_meter',
      units: [
        { id: 'square_kilometer', name: 'Square Kilometers', factor: 0.000001, symbol: 'km²' },
        { id: 'square_meter', name: 'Square Meters', factor: 1, symbol: 'm²' },
        { id: 'square_centimeter', name: 'Square Centimeters', factor: 10000, symbol: 'cm²' },
        { id: 'hectare', name: 'Hectares', factor: 0.0001, symbol: 'ha' },
        { id: 'acre', name: 'Acres', factor: 0.000247105, symbol: 'ac' },
        { id: 'square_mile', name: 'Square Miles', factor: 3.861e-7, symbol: 'mi²' },
        { id: 'square_foot', name: 'Square Feet', factor: 10.7639, symbol: 'ft²' },
        { id: 'square_inch', name: 'Square Inches', factor: 1550, symbol: 'in²' }
      ]
    },
    {
      id: 'speed',
      name: 'Speed',
      baseUnit: 'meter_per_second',
      units: [
        { id: 'meter_per_second', name: 'Meters per Second', factor: 1, symbol: 'm/s' },
        { id: 'kilometer_per_hour', name: 'Kilometers per Hour', factor: 3.6, symbol: 'km/h' },
        { id: 'mile_per_hour', name: 'Miles per Hour', factor: 2.23694, symbol: 'mph' },
        { id: 'knot', name: 'Knots', factor: 1.94384, symbol: 'kn' },
        { id: 'foot_per_second', name: 'Feet per Second', factor: 3.28084, symbol: 'ft/s' }
      ]
    }
  ];

  // Set default units when category changes
  useEffect(() => {
    const category = conversionCategories.find(cat => cat.id === selectedCategory);
    if (category && category.units.length >= 2) {
      setFromUnit(category.units[0].id);
      setToUnit(category.units[1].id);
    }
  }, [selectedCategory]);

  // Convert units
  const convertUnits = () => {
    if (!value || isNaN(Number(value))) {
      toast({
        title: 'Invalid value',
        description: 'Please enter a valid number',
        variant: 'destructive'
      });
      return;
    }

    const category = conversionCategories.find(cat => cat.id === selectedCategory);
    if (!category) return;

    const from = category.units.find(unit => unit.id === fromUnit);
    const to = category.units.find(unit => unit.id === toUnit);

    if (!from || !to) return;

    // For temperature, we need special conversion formulas
    if (category.id === 'temperature') {
      setResult(convertTemperature(parseFloat(value), fromUnit, toUnit));
    } else {
      // For other units, we can use the conversion factor
      // First, convert from the source unit to the base unit
      const valueInBaseUnit = parseFloat(value) / from.factor;
      // Then, convert from the base unit to the target unit
      const convertedValue = valueInBaseUnit * to.factor;
      
      // Format the result based on the size of the number
      setResult(formatResult(convertedValue));
    }
  };

  // Special handling for temperature conversion
  const convertTemperature = (value: number, from: string, to: string): string => {
    let result: number;
    
    // First convert to Celsius as the intermediate step
    let tempInCelsius: number;
    
    switch (from) {
      case 'celsius':
        tempInCelsius = value;
        break;
      case 'fahrenheit':
        tempInCelsius = (value - 32) * (5/9);
        break;
      case 'kelvin':
        tempInCelsius = value - 273.15;
        break;
      default:
        tempInCelsius = value;
    }
    
    // Then convert from Celsius to the target unit
    switch (to) {
      case 'celsius':
        result = tempInCelsius;
        break;
      case 'fahrenheit':
        result = (tempInCelsius * (9/5)) + 32;
        break;
      case 'kelvin':
        result = tempInCelsius + 273.15;
        break;
      default:
        result = tempInCelsius;
    }
    
    return formatResult(result);
  };
  
  // Format the result based on the size of the number
  const formatResult = (value: number): string => {
    if (Math.abs(value) < 0.01 && value !== 0) {
      // For very small numbers, use scientific notation
      return value.toExponential(6);
    } else if (Math.abs(value) >= 1000000) {
      // For very large numbers, use scientific notation
      return value.toExponential(6);
    } else {
      // For regular numbers, show up to 6 significant digits
      return value.toPrecision(6).replace(/\.?0+$/, '');
    }
  };

  // Swap from and to units
  const handleSwapUnits = () => {
    const tempFromUnit = fromUnit;
    setFromUnit(toUnit);
    setToUnit(tempFromUnit);
    
    // Recalculate if we have a value
    if (value && result) {
      setValue(result);
      setResult(value);
    }
  };

  // Get unit symbol
  const getUnitSymbol = (categoryId: string, unitId: string): string => {
    const category = conversionCategories.find(cat => cat.id === categoryId);
    if (!category) return '';
    
    const unit = category.units.find(u => u.id === unitId);
    return unit?.symbol || '';
  };

  return (
    <>
      <ToolHeader
        title="Unit Converter"
        description="Convert between different units of measurement including length, weight, volume, temperature, and more."
      />

      <div className="container mx-auto px-4 py-6">
        <Card className="p-6">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-6">
              {conversionCategories.map(category => (
                <TabsTrigger key={category.id} value={category.id}>
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {conversionCategories.map(category => (
              <TabsContent key={category.id} value={category.id} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-end">
                  <div className="md:col-span-2">
                    <label htmlFor="value" className="block text-sm font-medium mb-2">Value</label>
                    <Input
                      id="value"
                      type="number"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      placeholder="Enter value"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="fromUnit" className="block text-sm font-medium mb-2">From</label>
                    <Select value={fromUnit} onValueChange={setFromUnit}>
                      <SelectTrigger id="fromUnit">
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        {category.units.map((unit) => (
                          <SelectItem key={`from-${unit.id}`} value={unit.id}>
                            {unit.name} {unit.symbol ? `(${unit.symbol})` : ''}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex justify-center items-center">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={handleSwapUnits}
                      className="rounded-full h-10 w-10 flex items-center justify-center"
                    >
                      <ArrowRightLeft size={18} />
                    </Button>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="toUnit" className="block text-sm font-medium mb-2">To</label>
                    <Select value={toUnit} onValueChange={setToUnit}>
                      <SelectTrigger id="toUnit">
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        {category.units.map((unit) => (
                          <SelectItem key={`to-${unit.id}`} value={unit.id}>
                            {unit.name} {unit.symbol ? `(${unit.symbol})` : ''}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    onClick={convertUnits} 
                  >
                    Convert
                  </Button>
                </div>
                
                {/* Result section */}
                {result && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="text-center">
                      <div className="mb-2 text-gray-500">Conversion Result:</div>
                      <div className="text-3xl font-bold">
                        {value} {getUnitSymbol(category.id, fromUnit)} = {result} {getUnitSymbol(category.id, toUnit)}
                      </div>
                      <div className="mt-4 text-sm text-gray-500">
                        <p>
                          {value} {category.units.find(u => u.id === fromUnit)?.name} equals {result} {category.units.find(u => u.id === toUnit)?.name}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Unit information */}
                <div className="bg-blue-50 p-4 rounded-md text-sm text-blue-800 mt-4">
                  <h3 className="font-medium mb-2">About {category.name} Units</h3>
                  <p>{getCategoryDescription(category.id)}</p>
                </div>

                {/* Common conversions */}
                <div>
                  <h3 className="font-medium text-lg mt-4 mb-2">Common {category.name} Conversions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {getCommonConversions(category.id).map((conv, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-md">
                        <div className="text-sm">{conv}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </Card>
      </div>
    </>
  );
};

// Helper functions to provide additional context for each category
const getCategoryDescription = (categoryId: string): string => {
  const descriptions: Record<string, string> = {
    'length': 'Length units measure distance between two points. The standard unit in the metric system is the meter, while the imperial system uses feet and inches.',
    'weight': 'Weight (mass) units measure how much matter is in an object. The standard unit in the metric system is the kilogram, while the imperial system uses pounds and ounces.',
    'volume': 'Volume units measure the amount of space an object or substance occupies. Common units include liters in the metric system and gallons in the imperial system.',
    'temperature': 'Temperature units measure the degree of heat or cold. Celsius is used in most countries, while Fahrenheit is common in the United States. Kelvin is used in scientific contexts.',
    'area': 'Area units measure the size of a surface. Square meters (m²) is the SI unit of area, while acres and square feet are common in the imperial system.',
    'speed': 'Speed units measure the rate of change in position. Meters per second (m/s) is the SI unit, while miles per hour (mph) is common in the US and UK.'
  };
  
  return descriptions[categoryId] || '';
};

const getCommonConversions = (categoryId: string): string[] => {
  const conversions: Record<string, string[]> = {
    'length': [
      '1 meter = 100 centimeters',
      '1 kilometer = 0.621371 miles',
      '1 inch = 2.54 centimeters',
      '1 foot = 0.3048 meters',
      '1 yard = 0.9144 meters',
      '1 mile = 1.60934 kilometers'
    ],
    'weight': [
      '1 kilogram = 1000 grams',
      '1 pound = 0.453592 kilograms',
      '1 ounce = 28.3495 grams',
      '1 stone = 6.35029 kilograms',
      '1 ton = 907.185 kilograms',
      '1 metric ton = 1000 kilograms'
    ],
    'volume': [
      '1 liter = 1000 milliliters',
      '1 gallon (US) = 3.78541 liters',
      '1 gallon (UK) = 4.54609 liters',
      '1 cup = 236.588 milliliters',
      '1 fluid ounce = 29.5735 milliliters',
      '1 cubic meter = 1000 liters'
    ],
    'temperature': [
      '0°C = 32°F = 273.15K',
      '100°C = 212°F = 373.15K',
      '37°C (body temperature) = 98.6°F',
      '20°C (room temperature) = 68°F',
      'F = C × (9/5) + 32',
      'C = (F - 32) × (5/9)'
    ],
    'area': [
      '1 square meter = 10.7639 square feet',
      '1 acre = 4046.86 square meters',
      '1 hectare = 10000 square meters',
      '1 square mile = 2.59 square kilometers',
      '1 square foot = 0.092903 square meters',
      '1 square kilometer = 100 hectares'
    ],
    'speed': [
      '1 meter/second = 3.6 kilometers/hour',
      '1 mile/hour = 1.60934 kilometers/hour',
      '1 knot = 1.852 kilometers/hour',
      '1 kilometer/hour = 0.277778 meters/second',
      '1 mile/hour = 0.44704 meters/second',
      '1 meter/second = 2.23694 miles/hour'
    ],
  };
  
  return conversions[categoryId] || [];
};

export default UnitConverterTool;
