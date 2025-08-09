'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from "@/hooks/use-toast"
import { resetPassword } from '@/lib/api';
import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { sendOtp } from '@/lib/api';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const changePasswordSchema = z.object({
  email: z.string().email({ message: 'Valid email is required.' }),
  otp: z.string().min(6, { message: 'OTP must be 6 characters.' }),
  newPassword: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "New passwords don't match",
  path: ["confirmPassword"],
});

export default function ChangePasswordPage() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      email: '',
      otp: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  // Pre-fill email from JWT if available
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        if (decoded.email) {
          form.setValue('email', decoded.email);
        }
      } catch (e) {
        // ignore
      }
    }
  }, [form]);

  // Send OTP handler
  async function handleSendOtp() {
    const email = form.getValues('email');
    if (!email) {
      toast({
        variant: 'destructive',
        title: 'Email Required',
        description: 'Please enter your email to receive an OTP.',
      });
      return;
    }
    try {
      await sendOtp(email);
      toast({
        title: 'OTP Sent',
        description: `An OTP has been sent to ${email}.`,
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Failed to Send OTP',
        description: error.message || 'Could not send OTP.',
      });
    }
  }

  async function onSubmit(values: z.infer<typeof changePasswordSchema>) {
    try {
      await resetPassword(values.email, values.otp, values.newPassword);
      toast({
        title: "Success!",
        description: "Your password has been changed successfully.",
      });
      form.reset();
    } catch (error: any) {
      console.error('Password change failed:', error);
      const errorMessage = error.message || 'An unexpected error occurred.';
      toast({
        variant: 'destructive',
        title: 'Password Change Failed',
        description: errorMessage,
      });
    }
  }

  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Change Your Password</CardTitle>
          <CardDescription>Enter your email, click 'Send OTP', then enter the OTP and your new password.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input type="email" placeholder="you@example.com" {...field} />
                      </FormControl>
                      <Button type="button" variant="outline" onClick={handleSendOtp}>
                        Send OTP
                      </Button>
                    </div>
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
                      <Input type="text" placeholder="Enter OTP" {...field} />
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
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? 'Updating...' : 'Update Password'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
