import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

import {
  CenterHeading,
  MainHeading,
  Subheading,
} from '@/components/common/Heading'

const Login = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen w-full flex relative">
      {/* Background image (mobile: full screen, desktop: left half) */}

      <div className="absolute inset-0 md:relative md:w-1/2">
        <img
          src="smart-farming.webp"
          alt="Smart Farming"
          className="w-full h-full object-cover"
        />
        {/* Overlay only on mobile for readability */}
        <div className="absolute inset-0 bg-black/50 md:hidden"></div>
      </div>

      {/* Form Section */}
      <div
        className="relative z-10 w-full md:w-1/2 flex flex-col items-center justify-center 
                      bg-transparent md:bg-green-900 p-8"
      >
        <Card className="w-full max-w-sm flex flex-col gap-6">
          <div className="text-center">
            <CenterHeading>CropNow</CenterHeading>
          </div>
          <CardHeader className="space-y-2">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-xl">Login</CardTitle>
                <CardDescription>
                  Enter your email below to login to your account
                </CardDescription>
              </div>

              {/* Place Sign Up to the right; make it small and aligned */}
              <Subheading>
                <CardAction>
                  <Button
                    variant="link"
                    className="p-0 text-sm"
                    onClick={() => navigate('/register')}
                  >
                    Sign Up
                  </Button>
                </CardAction>
              </Subheading>
            </div>
          </CardHeader>

          <CardContent>
            <form className="space-y-5">
              {/* Email field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>

              {/* Password + forgot link row */}
              <div className="space-y-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" type="password" required />
              </div>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" className="w-full">
              Login
            </Button>
            <Button variant="outline" className="w-full">
              Login with Google
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default Login
