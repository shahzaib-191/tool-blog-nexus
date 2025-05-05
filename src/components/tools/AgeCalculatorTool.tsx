
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { format, differenceInYears, differenceInMonths, differenceInDays } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  birthDate: z.date({
    required_error: "Please select your birth date.",
  }),
});

type AgeResult = {
  years: number;
  months: number;
  days: number;
  totalMonths: number;
  totalDays: number;
};

const AgeCalculatorTool = () => {
  const [ageResult, setAgeResult] = useState<AgeResult | null>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  
  const calculateAge = (data: z.infer<typeof formSchema>) => {
    const today = new Date();
    const birthDate = new Date(data.birthDate);
    
    // Calculate the differences
    const years = differenceInYears(today, birthDate);
    
    // Calculate remaining months after years are accounted for
    const dateWithYearsSubtracted = new Date(birthDate);
    dateWithYearsSubtracted.setFullYear(birthDate.getFullYear() + years);
    const months = differenceInMonths(today, dateWithYearsSubtracted);
    
    // Calculate remaining days after years and months are accounted for
    const dateWithMonthsSubtracted = new Date(dateWithYearsSubtracted);
    dateWithMonthsSubtracted.setMonth(dateWithYearsSubtracted.getMonth() + months);
    const days = differenceInDays(today, dateWithMonthsSubtracted);
    
    // Calculate total months and days
    const totalMonths = differenceInMonths(today, birthDate);
    const totalDays = differenceInDays(today, birthDate);
    
    setAgeResult({ years, months, days, totalMonths, totalDays });
  };
  
  return (
    <div className="container max-w-xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Age Calculator</CardTitle>
          <p className="text-sm text-muted-foreground">Calculate your exact age from birthdate to today</p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(calculateAge)} className="space-y-6">
              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of Birth</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full">Calculate Age</Button>
            </form>
          </Form>
          
          {ageResult && (
            <div className="mt-8 space-y-4">
              <h3 className="text-lg font-semibold mb-2 text-center">Age Calculation Results</h3>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-100 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold">{ageResult.years}</div>
                  <div className="text-sm text-muted-foreground">Years</div>
                </div>
                <div className="bg-gray-100 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold">{ageResult.months}</div>
                  <div className="text-sm text-muted-foreground">Months</div>
                </div>
                <div className="bg-gray-100 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold">{ageResult.days}</div>
                  <div className="text-sm text-muted-foreground">Days</div>
                </div>
              </div>
              
              <div className="bg-gray-100 rounded-lg p-4">
                <h4 className="font-medium mb-2">Total:</h4>
                <ul className="space-y-1">
                  <li className="flex justify-between">
                    <span>Age in Years:</span>
                    <span>{ageResult.years} years, {ageResult.months} months, {ageResult.days} days</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Age in Months:</span>
                    <span>{ageResult.totalMonths} months, {ageResult.days} days</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Age in Days:</span>
                    <span>{ageResult.totalDays} days</span>
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

export default AgeCalculatorTool;
