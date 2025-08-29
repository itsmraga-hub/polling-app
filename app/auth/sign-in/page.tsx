'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

export default function SignIn() {
  const router = useRouter();
  
  // This is a placeholder for the actual authentication logic
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    // Authentication logic will go here
    console.log('Sign in attempted');
    // Redirect to polls page after sign in
    router.push('/polls');
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input id="email" type="email" placeholder="email@example.com" required />
            </div>
            <div className="space-y-2">
              <FormLabel htmlFor="password">Password</FormLabel>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full">Sign In</Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-center">
            Don't have an account?{' '}
            <Link href="/auth/sign-up" className="underline underline-offset-4 hover:text-primary">
              Sign Up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}