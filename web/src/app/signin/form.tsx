// app/components/SigninForm.tsx (Client Component)
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { signInWithGoogle } from '@/firebase/auth';
import { createSession } from '@/actions/auth-actions';
import Link from 'next/link';
import GoogleIcon from '@/constants/icons/google-icon.svg';
import Image from 'next/image';
import PasswordInput from '@/components/ui/password-input';
import Error from '@/components/ui/error';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@radix-ui/react-label';
import { Input } from '@/components/ui/input';


type SigninFormData = {
  email: string;
  password: string;
};

type SigninFormProps = {
  session: string | null;
};

const SigninForm = ({ session }: SigninFormProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<SigninFormData>();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSignInSubmitting, setIsGoogleSignInSubmitting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');

  const handleSignIn = async () => {
    setIsGoogleSignInSubmitting(true);
    try {
      const userUid = await signInWithGoogle();
      if (userUid) {
        await createSession(userUid);
        router.push('/dashboard'); // Redirect to a protected route after sign-in
      }
    } catch (err) {
      setError('Google sign-in failed');
    } finally {
      setIsGoogleSignInSubmitting(false);
    }
  };

  const onSubmit = async (data: SigninFormData) => {
    // Handle email/password sign-in here
    console.log(data);
  };

  if (!session) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <Card className='mx-6 sm:mx-auto max-w-sm md:min-w-md'>
          <CardHeader>
            <CardTitle className='text-xl'>Sign In</CardTitle>
            <CardDescription>
              Enter your email below to sign in to your account
            </CardDescription>
            {error && <Error text={error} />}
          </CardHeader>
          <CardContent>
            <div className='grid gap-4'>
              <div className='grid gap-2'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  autoComplete='off'
                  id='email'
                  type='email'
                  placeholder='iamironman@starkindustry.com'
                  {...register('email', { required: true })}
                />
                {errors.email && <Error text='Email is required.' />}
              </div>
              <div className='grid gap-2'>
                <div className='flex items-center'>
                  <Label htmlFor='password'>Password</Label>
                  <Link href='#' className='ml-auto inline-block text-sm underline'>
                    Forgot your password?
                  </Link>
                </div>
                <PasswordInput
                  id='password'
                  placeholder='Enter your password'
                  {...register('password', { required: true })}
                />
                {errors.password && <Error text='Password is required' />}
              </div>
              <Button
                className='w-full'
                disabled={isSubmitting}
                onClick={handleSubmit(onSubmit)}
                type='submit'>
                {isSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                Sign in
              </Button>
              <Button
                className='w-full'
                disabled={isGoogleSignInSubmitting}
                onClick={handleSignIn}
                variant='outline'>
                {isGoogleSignInSubmitting ? (
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                ) : (
                  <Image
                    src={GoogleIcon}
                    alt='Google Icon'
                    width={20}
                    height={20}
                    className='mr-2'
                  />
                )}
                Sign in with Google
              </Button>
            </div>
            <div className='mt-4 text-center text-sm'>
              Don&apos;t have an account?{' '}
              <Link href='/signup' className='underline'>
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null; // If session exists, you can redirect to a protected page
};

export default SigninForm;