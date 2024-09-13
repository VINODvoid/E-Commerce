import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <main className="w-full max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-8 text-black">Welcome to Our E-commerce Site</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Sign Up</CardTitle>
              <CardDescription>Create a new account as a buyer or seller.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Join our community and start shopping or selling  today!</p>
            </CardContent>
            <CardFooter>
              <Link href="/auth/signup" passHref>
                <Button className="w-full">Sign Up</Button>
              </Link>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>Access your existing account.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Already have an account? Sign in to continue your journey.</p>
            </CardContent>
            <CardFooter>
              <Link href="/auth/login" passHref>
                <Button className="w-full" variant="outline">Login</Button>
              </Link>
            </CardFooter>
          </Card>
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Browse Products</CardTitle>
              <CardDescription>Explore our wide range of products.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Discover amazing deals and unique items from our sellers.</p>
            </CardContent>
            <CardFooter>
              <Link href="/products" passHref>
                <Button className="w-full" variant="secondary">View Products</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  )
}