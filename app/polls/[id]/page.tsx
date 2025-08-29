'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

// Mock data for a single poll
const MOCK_POLL = {
  id: '1',
  title: 'Favorite Programming Language',
  description: 'What is your favorite programming language?',
  options: [
    { id: '1', text: 'JavaScript', votes: 15 },
    { id: '2', text: 'Python', votes: 12 },
    { id: '3', text: 'Java', votes: 8 },
    { id: '4', text: 'C#', votes: 5 },
    { id: '5', text: 'Go', votes: 2 }
  ],
  totalVotes: 42,
  createdBy: 'John Doe',
  createdAt: '2023-05-15'
};

export default function PollDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [poll, setPoll] = useState(MOCK_POLL);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

  // In a real app, this would fetch the poll data from an API
  useEffect(() => {
    // Simulate fetching poll data
    console.log(`Fetching poll with ID: ${params.id}`);
    // setPoll(fetchedPoll);
  }, [params.id]);

  const handleVote = () => {
    if (!selectedOption) return;
    
    // In a real app, this would send the vote to an API
    console.log(`Voted for option: ${selectedOption} in poll: ${params.id}`);
    
    // Update local state to reflect the vote
    setPoll(prev => {
      const updatedOptions = prev.options.map(option => {
        if (option.id === selectedOption) {
          return { ...option, votes: option.votes + 1 };
        }
        return option;
      });
      
      return {
        ...prev,
        options: updatedOptions,
        totalVotes: prev.totalVotes + 1
      };
    });
    
    setHasVoted(true);
  };

  // Calculate percentages for the progress bars
  const getPercentage = (votes: number) => {
    return poll.totalVotes > 0 ? Math.round((votes / poll.totalVotes) * 100) : 0;
  };

  return (
    <div className="container mx-auto py-10">
      <Button variant="outline" onClick={() => router.back()} className="mb-6">
        Back to Polls
      </Button>
      
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">{poll.title}</CardTitle>
          <CardDescription>{poll.description}</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {poll.options.map((option) => (
              <div key={option.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {!hasVoted && (
                      <input
                        type="radio"
                        id={option.id}
                        name="poll-option"
                        value={option.id}
                        checked={selectedOption === option.id}
                        onChange={() => setSelectedOption(option.id)}
                        className="h-4 w-4"
                      />
                    )}
                    <label htmlFor={option.id} className="text-sm font-medium">
                      {option.text}
                    </label>
                  </div>
                  <span className="text-sm font-medium">
                    {option.votes} votes ({getPercentage(option.votes)}%)
                  </span>
                </div>
                
                <div className="w-full bg-secondary rounded-full h-2.5">
                  <div 
                    className="bg-primary h-2.5 rounded-full" 
                    style={{ width: `${getPercentage(option.votes)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          
          {!hasVoted && (
            <Button 
              onClick={handleVote} 
              disabled={!selectedOption}
              className="w-full"
            >
              Submit Vote
            </Button>
          )}
          
          <div className="text-sm text-muted-foreground">
            <p>Total votes: {poll.totalVotes}</p>
            <p>Created by: {poll.createdBy}</p>
            <p>Created on: {poll.createdAt}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}