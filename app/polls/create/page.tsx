'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useProtectedRoute } from '@/lib/auth-utils';
import { useAuth } from '@/context/auth-context';

export default function CreatePollPage() {
  // Protect this route - redirect to sign-in if not authenticated
  const { user, isLoading } = useProtectedRoute();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!title.trim() || !description.trim() || options.some(opt => !opt.trim())) {
      alert('Please fill in all fields and provide at least 2 options');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, this would send the poll data to an API with the user's ID
      console.log('Creating poll:', { 
        title, 
        description, 
        options,
        userId: user?.id // Include the user ID from auth context
      });
      
      // Redirect to polls page
      router.push('/polls');
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
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <FormLabel htmlFor="title">Poll Title</FormLabel>
              <Input 
                id="title" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., What's your favorite programming language?"
                required
              />
            </div>
            
            <div className="space-y-2">
              <FormLabel htmlFor="description">Description</FormLabel>
              <Input 
                id="description" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide some context for your poll"
                required
              />
            </div>
            
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
        </CardContent>
      </Card>
    </div>
  );
}