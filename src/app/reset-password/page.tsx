'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from "@/hooks/use-toast"
import { resetPassword } from '@/lib/api';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AuthFormWrapper } from '@/components/auth-form-wrapper';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useEffect } from 'react';
import { Suspense } from 'react';

const resetPasswordSchema = z.object({
  email: z.string().email(),
  otp: z.string().min(6, { message: 'OTP must be 6 characters.' }),
  newPassword: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

function ResetPasswordInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const { toast } = useToast();

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: email || '',
      otp: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (!email) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No email address provided. Please go back to the forgot password page.',
      });
      router.push('/forgot-password');
    } else {
      form.setValue('email', email);
    }
  }, [email, router, toast, form]);

  async function onSubmit(values: z.infer<typeof resetPasswordSchema>) {
    try {
      await resetPassword(values.email, values.otp, values.newPassword);
      toast({
        title: "Password Reset Successful",
        description: "You can now log in with your new password.",
      });
      router.push('/');
    } catch (error: any) {
      console.error('Password reset failed:', error);
      const errorMessage = error.response?.data?.message || 'An unexpected error occurred.';
      toast({
        variant: 'destructive',
        title: 'Password Reset Failed',
        description: errorMessage,
      });
    }
  }

  return (
    <AuthFormWrapper
      title="Reset Your Password"
      description="Enter the OTP from your email and your new password."
      footer={
        <Link href="/forgot-password" className="font-semibold text-primary hover:underline">
          Didn't receive an OTP? Resend
        </Link>
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>OTP</FormLabel>
                <FormControl>
                  <Input placeholder="123456" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">Reset Password</Button>
        </form>
      </Form>
    </AuthFormWrapper>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordInner />
    </Suspense>
  );
}
