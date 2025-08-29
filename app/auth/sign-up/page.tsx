'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

export default function SignUp() {
  const router = useRouter();
  
  // This is a placeholder for the actual registration logic
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    // Registration logic will go here
    console.log('Sign up attempted');
    // Redirect to sign in page after registration
    router.push('/auth/sign-in');
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create an Account</CardTitle>
          <CardDescription>
            Enter your details to create a new account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <FormLabel htmlFor="name">Name</FormLabel>
              <Input id="name" type="text" placeholder="John Doe" required />
            </div>
            <div className="space-y-2">
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input id="email" type="email" placeholder="email@example.com" required />
            </div>
            <div className="space-y-2">
              <FormLabel htmlFor="password">Password</FormLabel>
              <Input id="password" type="password" required />
            </div>
            <div className="space-y-2">
              <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
              <Input id="confirmPassword" type="password" required />
            </div>
            <Button type="submit" className="w-full">Sign Up</Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-center">
            Already have an account?{' '}
            <Link href="/auth/sign-in" className="underline underline-offset-4 hover:text-primary">
              Sign In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}