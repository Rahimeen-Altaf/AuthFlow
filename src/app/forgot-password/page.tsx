'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from "@/hooks/use-toast"
import { sendOtp } from '@/lib/api';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AuthFormWrapper } from '@/components/auth-form-wrapper';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
});

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(values: z.infer<typeof forgotPasswordSchema>) {
    try {
      await sendOtp(values.email);
      toast({
        title: "OTP Sent",
        description: `An OTP has been sent to ${values.email}.`,
      })
      router.push(`/reset-password?email=${values.email}`);
    } catch (error: any) {
       console.error('OTP send failed:', error);
      const errorMessage = error.response?.data?.message || 'An unexpected error occurred.';
      toast({
        variant: 'destructive',
        title: 'Failed to send OTP',
        description: errorMessage,
      });
    }
  }
  
  return (
    <AuthFormWrapper
      title="Forgot Your Password?"
      description="No worries! Enter your email and we'll send you an OTP."
      footer={
        <Link href="/" className="font-semibold text-primary hover:underline">
          Back to Login
        </Link>
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="your@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Sending OTP...' : 'Send OTP'}
          </Button>
        </form>
      </Form>
    </AuthFormWrapper>
  );
}
