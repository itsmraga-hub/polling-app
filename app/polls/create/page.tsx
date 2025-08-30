'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useProtectedRoute } from '@/lib/auth-utils';
import { useAuth } from '@/context/auth-context';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { clientPollsApi } from '@/lib/supabase/polls';

// Define form schema with Zod
const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  options: z.array(z.string().min(1, 'Option is required')).min(2, 'At least 2 options are required')
});

export default function CreatePollPage() {
  // Protect this route - redirect to sign-in if not authenticated
  const { user, isLoading } = useProtectedRoute();
  const router = useRouter();
  const [options, setOptions] = useState(['', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      options: ['', '']
    }
  });

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length <= 2) return; // Minimum 2 options required
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    setSuccessMessage(null);
    
    try {
      // Create poll in Supabase using our client API
      const { data, error } = await clientPollsApi.createPoll(
        values.title,
        values.description,
        values.options.filter(option => option.trim() !== '')
      );
      
      if (error) {
        throw error;
      }
      
      // Show success message
      setSuccessMessage('Poll created successfully!');
      
      // Wait a moment before redirecting
      setTimeout(() => {
        router.push('/polls');
      }, 2000);
    } catch (error) {
      console.error('Error creating poll:', error);
      alert('Failed to create poll. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Create a New Poll</CardTitle>
          <CardDescription>
            Fill in the details below to create your poll
          </CardDescription>
        </CardHeader>
        <CardContent>
          {successMessage && (
            <div className="p-3 mb-4 bg-green-100 border border-green-400 text-green-700 rounded">
              {successMessage}
            </div>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Poll Title</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., What's your favorite programming language?"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Provide some context for your poll"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="space-y-4">
                <FormLabel>Poll Options</FormLabel>
                {options.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input 
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      required
                    />
                    {options.length > 2 && (
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleRemoveOption(index)}
                      >
                        ✕
                      </Button>
                    )}
                  </div>
                ))}
                
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleAddOption}
                  className="w-full"
                >
                  Add Option
                </Button>
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting || isLoading}
              >
                {isSubmitting ? 'Creating...' : 'Create Poll'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}