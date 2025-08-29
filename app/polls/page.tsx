'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

// Mock data for polls
const MOCK_POLLS = [
  {
    id: '1',
    title: 'Favorite Programming Language',
    description: 'What is your favorite programming language?',
    options: ['JavaScript', 'Python', 'Java', 'C#', 'Go'],
    votes: 42,
    createdBy: 'John Doe',
    createdAt: '2023-05-15'
  },
  {
    id: '2',
    title: 'Best Frontend Framework',
    description: 'Which frontend framework do you prefer?',
    options: ['React', 'Vue', 'Angular', 'Svelte'],
    votes: 38,
    createdBy: 'Jane Smith',
    createdAt: '2023-05-20'
  },
  {
    id: '3',
    title: 'Database Preference',
    description: 'Which database do you use most often?',
    options: ['PostgreSQL', 'MySQL', 'MongoDB', 'SQLite', 'Redis'],
    votes: 27,
    createdBy: 'Alex Johnson',
    createdAt: '2023-05-25'
  }
];

export default function PollsPage() {
  const [polls, setPolls] = useState(MOCK_POLLS);

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Available Polls</h1>
        <Link href="/polls/create">
          <Button>Create New Poll</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {polls.map((poll) => (
          <Link href={`/polls/${poll.id}`} key={poll.id}>
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle>{poll.title}</CardTitle>
                <CardDescription>{poll.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {poll.options.length} options • {poll.votes} votes
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <p className="text-sm text-muted-foreground">By {poll.createdBy}</p>
                <p className="text-sm text-muted-foreground">{poll.createdAt}</p>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}