'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
// import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Error from '@/components/ui/error';

import GoogleIcon from '@/constants/icons/google-icon.svg';
import Image from 'next/image';
import PasswordInput from '@/components/ui/password-input';

type SigninFormData = {
  email: string;
  password: string;
};

const SigninForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninFormData>();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSignInSubmitting, setIsGoogleSignInSubmitting] =
    useState(false);

  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');
  const router = useRouter();

  const onSubmit = async (data: SigninFormData) => {
    console.log(data);
    //     setIsSubmitting(true);
    //     const { email, password } = data;
    //     const result = await signIn('credentials', {
    //       redirect: false,
    //       email,
    //       password,
    //     });
    //     if (result?.error) {
    //       setError(result.error);
    //     } else {
    //       if (redirect) {
    //         router.push(redirect);
    //       } else {
    //         router.push('/');
    //       }
    //     //   toast({
    //     //     title: 'Sign in successful',
    //     //     description: 'You have successfully signed in to your account',
    //     //     variant: 'success',
    //     //   });
    //     }
    //     setIsSubmitting(false);
    //   };
    //   const onGoogleSignin = async () => {
    //     setIsGoogleSignInSubmitting(true);
    //     setError('');
    //     const result = await signIn('google', {
    //       callbackUrl: '/products',
    //       redirect: false,
    //     });
    //     if (result?.error) {
    //       setError(result.error);
    //     }
    //     setIsGoogleSignInSubmitting(false);
  };

  return (
    <div className='flex items-center justify-center min-h-screen '>
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
                <Link
                  href='#'
                  className='ml-auto inline-block text-sm underline'
                >
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
              type='submit'
            >
              {isSubmitting && (
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              )}
              Sign in
            </Button>
            <Button
              className='w-full'
              disabled={isGoogleSignInSubmitting}
              // onClick={onGoogleSignin}
              onClick={() => {}}
              variant='outline'
            >
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
};

export default SigninForm;
