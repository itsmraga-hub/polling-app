import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="container mx-auto py-16 px-4">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Create and Share Polls with Anyone
        </h1>
        
        <p className="text-xl text-muted-foreground">
          A simple and intuitive platform for creating polls, gathering opinions, and analyzing results.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button asChild size="lg">
            <Link href="/polls">Browse Polls</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/auth/sign-up">Create Account</Link>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
        <Card>
          <CardHeader>
            <CardTitle>Create Polls</CardTitle>
            <CardDescription>Design custom polls with multiple options</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Easily create polls with our intuitive interface. Add as many options as you need and customize your poll settings.</p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href="/polls/create">Create a Poll</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Vote on Polls</CardTitle>
            <CardDescription>Participate in community polls</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Browse and vote on polls created by the community. See real-time results and track how opinions evolve over time.</p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href="/polls">Browse Polls</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Analyze Results</CardTitle>
            <CardDescription>Get insights from poll data</CardDescription>
          </CardHeader>
          <CardContent>
            <p>View detailed analytics for your polls. Understand trends and patterns in the voting data to make informed decisions.</p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href="/auth/sign-in">Sign In</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
