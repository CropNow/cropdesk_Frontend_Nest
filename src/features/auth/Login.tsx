import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { login } from './auth.api';

import { CenterHeading, Subheading } from '@/components/common/Heading';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = async (): Promise<void> => {
    const res = await login({
      email: 'test@test.com',
      password: '123456',
    });

    console.log(res.accessToken);
    console.log(res.user.email);
  };

  return (
    <div className="min-h-screen w-full flex relative">
      <div className="absolute inset-0 md:relative md:w-full">
        <img
          src="smart-farming.webp"
          alt="Smart Farming"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 md:hidden"></div>
      </div>

      <div
        className="abs-center  z-10  flex flex-col items-center justify-center 
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
                <CardDescription className={'text-xs'}>
                  Enter your email below to login to your account
                </CardDescription>
              </div>

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
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="forgot-password"
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
            <Button type="submit" className="w-full" onClick={handleLogin}>
              Login
            </Button>
            <Button variant="outline" className="w-full">
              Login with Google
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
