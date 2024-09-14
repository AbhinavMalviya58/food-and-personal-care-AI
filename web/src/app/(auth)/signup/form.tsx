'use client';

import { useEffect, useState } from 'react';
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
import PasswordInput from '@/components/ui/password-input';

type SignupFormData = {
  confirmPassword: string;
  email: string;
  fullName: string;
  password: string;
};

const SignupForm = () => {
  const toast = useToast;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');
  const router = useRouter();

  useEffect(() => {
    if (watch('password') !== watch('confirmPassword')) {
      setError('Passwords do not match');
    } else {
      setError(null);
    }
  }, [watch('confirmPassword')]);

  const onSubmit = async (data: SignupFormData) => {
    console.log(data);
    // setIsSubmitting(true);
    // const { fullName, email, password, confirmPassword } = data;
    // if (password !== confirmPassword) {
    //   setError('Passwords do not match');
    //   setIsSubmitting(false);
    //   return;
    // }
    // const hashedPassword = await bcrypt.hash(password, 10);
    // const res = await fetch('/api/auth/signup', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ fullName, email, hashedPassword }),
    // });
    // if (res.ok) {
    //   const result = await signIn('credentials', {
    //     email,
    //     password,
    //     redirect: false,
    //   });
    //   if (result?.error) {
    //     setError(result.error);
    //   } else {
    //     if (redirect) {
    //       router.push(redirect);
    //     } else {
    //       router.push('/');
    //     }
    //     // toast({
    //     //   title: 'Sign in successful',
    //     //   description: 'You have successfully signed in to your account',
    //     //   variant: 'success',
    //     // });
    //   }
    // } else {
    //   const data = await res.json();
    //   setError(data.message);
    // }
    // setIsSubmitting(false);
  };

  return (
    
      <Card className='mx-6 sm:mx-auto max-w-sm md:min-w-md w-screen'>
        <CardHeader>
          <CardTitle className='text-xl'>Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
          {error && <Error text={error} />}
        </CardHeader>
        <CardContent>
          <div className='grid gap-4'>
            <div className='grid gap-2'>
              <Label htmlFor='fullName'>Full Name</Label>
              <Input
                autoComplete='off'
                id='fullName'
                placeholder='Tony Stark'
                {...register('fullName', { required: true })}
              />
              {errors.fullName && (
                <Error
                  text={errors.fullName.message || 'Full name is required.'}
                />
              )}
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                autoComplete='off'
                id='email'
                placeholder='iamironman@starkindustry.com'
                type='email'
                {...register('email', { required: true })}
              />
              {errors.email && (
                <Error text={errors.email.message || 'Email is required.'} />
              )}
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='password'>Password</Label>
              <PasswordInput
                id='password'
                placeholder='Min. 8 characters'
                {...register('password', {
                  required: true,
                  minLength: {
                    message: 'Password must be at least 8 characters long.',
                    value: 8,
                  },
                  // pattern: {
                  //   message: "Password must contain at least one letter, one number, one special character, and be at least 8 characters long.",
                  //   value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                  // },
                })}
              />
              {errors.password && <Error text={errors.password.message!} />}
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='confirmPassword'>Confirm Password</Label>
              <PasswordInput
                id='confirmPassword'
                placeholder='Re-enter your password'
                {...register('confirmPassword', {
                  required: true,
                })}
              />
              {errors.confirmPassword && (
                <Error
                  text={
                    errors.confirmPassword.message ||
                    'Please confirm your password.'
                  }
                />
              )}
            </div>
            <Button className='w-full' onClick={handleSubmit(onSubmit)}>
              {isSubmitting && (
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              )}
              Create an account
            </Button>
          </div>
          <div className='mt-4 text-center text-sm'>
            Already have an account?{' '}
            <Link href='/signin' className='underline'>
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
  );
};

export default SignupForm;