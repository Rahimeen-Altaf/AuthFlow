'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { KeyRound, ShieldCheck, User, LineChart, LogOut, BadgeCheck } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useCallback } from 'react';
import { getUsers } from '@/lib/api';

interface DecodedToken {
  name?: string;
  email?: string;
  username?: string;
  exp: number;
}

function stringToColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    color += ('00' + ((hash >> (i * 8)) & 0xff).toString(16)).slice(-2);
  }
  return color;
}

function getInitials(name?: string, email?: string) {
  if (name && name.trim().length > 0) {
    return name.trim().charAt(0).toUpperCase();
  }
  if (email && email.trim().length > 0) {
    return email.trim().charAt(0).toUpperCase();
  }
  return 'U';
}

export default function DashboardPage() {
  const [userInfo, setUserInfo] = useState<DecodedToken | null>(null);
  const [fullUser, setFullUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const storedUsername = localStorage.getItem('authUsername') || undefined;
    if (token) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        if (decodedToken.exp * 1000 > Date.now()) {
          setUserInfo({ ...decodedToken, username: decodedToken.username || storedUsername });
        } else {
          localStorage.removeItem('authToken');
          router.push('/');
        }
      } catch (error) {
        localStorage.removeItem('authToken');
        router.push('/');
      }
    } else {
      router.push('/');
    }
  }, [router]);

  useEffect(() => {
    const fetchUser = async () => {
      if (!userInfo) return;
      try {
        const users = await getUsers();
        const current = users?.find((u: any) => u.username === userInfo.username || u.email === userInfo.email);
        setFullUser(current || null);
      } catch (e) {
        setFullUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userInfo]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('authToken');
    router.push('/');
  }, [router]);

  // Resolved username/email for display
  const resolvedUsername = fullUser?.username || userInfo?.username || (userInfo?.email?.split('@')[0]) || 'User';
  const resolvedEmail = fullUser?.email || userInfo?.email;
  const avatarColor = stringToColor(resolvedUsername);
  const initials = (resolvedUsername.charAt(0) || 'U').toUpperCase();
  console.debug('Dashboard user -> username:', resolvedUsername, 'email:', resolvedEmail);

  if (loading) {
    return (
      <div className="grid gap-8">
        <div className="text-center">
          <Skeleton className="h-10 w-3/4 mx-auto" />
          <Skeleton className="h-6 w-1/2 mx-auto mt-2" />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-36 w-full" />
          <Skeleton className="h-36 w-full" />
          <Skeleton className="h-36 w-full md:col-span-2 lg:col-span-1" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background p-4 animate-fade-in">
      <div className="w-full max-w-3xl mx-auto grid gap-8">
        <div className="relative rounded-3xl shadow-2xl bg-card/50 backdrop-blur-lg border border-border/20 p-8 flex flex-col md:flex-row items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-4 w-full md:w-1/3">
            <div
              className="rounded-full w-20 h-20 flex items-center justify-center text-3xl font-bold shadow-lg border-4 border-white/10"
              style={{ background: avatarColor, color: '#fff', textShadow: '0 2px 8px #0003' }}
            >
              {initials}
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-semibold">{resolvedUsername}</span>
              {resolvedEmail && (
                <span className="text-sm text-muted-foreground">{resolvedEmail}</span>
              )}
            </div>
            <p className="text-muted-foreground text-sm">Welcome, manage your profile here.</p>
          </div>
          <div className="flex-1 w-full grid gap-6">
            <div className="flex flex-col md:flex-row gap-4 w-full">
              <Button asChild className="flex-1">
                <a href="/dashboard/change-password">Change Password</a>
              </Button>
              <Button type="button" onClick={handleLogout} variant="secondary" className="flex-1">
                <LogOut className="mr-2 h-5 w-5" /> Log Out
              </Button>
            </div>
          </div>
        </div>
      </div>
      <style jsx global>{`
        .animate-fade-in { animation: fadeIn 0.6s ease; }
        @keyframes fadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }
      `}</style>
    </div>
  );
}
