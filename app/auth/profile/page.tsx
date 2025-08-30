'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/auth-context';
import { createClient } from '@/lib/supabase/client';

export default function Profile() {
  const { user } = useAuth();
  const supabase = createClient();
  
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    avatar: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (user) {
      setUserData({
        name: user.user_metadata?.name || '',
        email: user.email || '',
        avatar: user.user_metadata?.avatar_url || ''
      });
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          name: userData.name,
          avatar_url: userData.avatar
        }
      });
      
      if (error) {
        setMessage({ text: error.message, type: 'error' });
      } else {
        setMessage({ text: 'Profile updated successfully', type: 'success' });
      }
    } catch (err) {
      setMessage({ text: 'An unexpected error occurred', type: 'error' });
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={userData.avatar} alt={userData.name} />
              <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>Your Profile</CardTitle>
              <CardDescription>
                View and update your profile information
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {message && (
            <div className={`p-3 mb-4 rounded ${message.type === 'success' ? 'bg-green-100 border border-green-400 text-green-700' : 'bg-red-100 border border-red-400 text-red-700'}`}>
              {message.text}
            </div>
          )}
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Name</label>
              <Input 
                id="name" 
                type="text" 
                value={userData.name}
                onChange={(e) => setUserData({...userData, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input 
                id="email" 
                type="email" 
                value={userData.email}
                onChange={(e) => setUserData({...userData, email: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="avatar" className="text-sm font-medium">Profile Picture URL</label>
              <Input 
                id="avatar" 
                type="text" 
                value={userData.avatar}
                onChange={(e) => setUserData({...userData, avatar: e.target.value})}
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Profile'}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            Your profile information is only visible to you and the administrators.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}