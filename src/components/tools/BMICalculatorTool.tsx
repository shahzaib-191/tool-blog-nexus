
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const formSchema = z.object({
  height: z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: "Height must be a positive number"
  }),
  weight: z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: "Weight must be a positive number"
  }),
});

const BMICalculatorTool = () => {
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState<string>("");
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      height: "",
      weight: "",
    }
  });
  
  const calculateBMI = (data: z.infer<typeof formSchema>) => {
    const height = parseFloat(data.height) / 100; // Convert cm to meters
    const weight = parseFloat(data.weight);
    
    if (height <= 0 || weight <= 0) {
      toast({
        title: "Error",
        description: "Height and weight must be positive numbers.",
        variant: "destructive",
      });
      return;
    }
    
    const bmiValue = weight / (height * height);
    setBmi(parseFloat(bmiValue.toFixed(2)));
    
    // Determine BMI category
    let bmiCategory = "";
    let badgeVariant: "default" | "warning" | "destructive" | "success" = "default";
    
    if (bmiValue < 18.5) {
      bmiCategory = "Underweight";
      badgeVariant = "warning";
    } else if (bmiValue >= 18.5 && bmiValue < 25) {
      bmiCategory = "Normal weight";
      badgeVariant = "success";
    } else if (bmiValue >= 25 && bmiValue < 30) {
      bmiCategory = "Overweight";
      badgeVariant = "warning";
    } else {
      bmiCategory = "Obesity";
      badgeVariant = "destructive";
    }
    
    setCategory(bmiCategory);
    
    toast({
      title: "BMI Calculated",
      description: `Your BMI is ${bmiValue.toFixed(2)} (${bmiCategory})`,
    });
  };
  
  return (
    <div className="container max-w-xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle>BMI Calculator</CardTitle>
          <p className="text-sm text-muted-foreground">Calculate your Body Mass Index</p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(calculateBMI)} className="space-y-6">
              <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Height (cm)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 175" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight (kg)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 70" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full">Calculate BMI</Button>
            </form>
          </Form>
          
          {bmi !== null && (
            <div className="mt-8 text-center">
              <h3 className="text-lg font-semibold mb-2">Your BMI Result</h3>
              <div className="text-3xl font-bold mb-2">{bmi}</div>
              <Badge variant={
                category === "Normal weight" ? "success" :
                category === "Underweight" || category === "Overweight" ? "warning" : "destructive"
              }>
                {category}
              </Badge>
              
              <div className="mt-6 bg-gray-100 rounded-lg p-4">
                <h4 className="font-medium mb-2">BMI Categories:</h4>
                <ul className="space-y-1 text-sm">
                  <li className="flex justify-between">
                    <span>Underweight</span>
                    <span>&lt; 18.5</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Normal weight</span>
                    <span>18.5 - 24.9</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Overweight</span>
                    <span>25 - 29.9</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Obesity</span>
                    <span>&ge; 30</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BMICalculatorTool;
