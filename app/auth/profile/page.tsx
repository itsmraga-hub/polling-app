'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function Profile() {
  // Placeholder user data
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: ''
  });

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // Update profile logic will go here
    console.log('Profile update attempted');
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
            <Button type="submit">Update Profile</Button>
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