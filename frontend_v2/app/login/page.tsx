'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Cake, Lock, Mail, ArrowRight } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { ErrorState } from '@/components/ui/ErrorState';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await login({ email, password });
      if (res.role === 'ROLE_ADMIN') {
        router.push('/admin');
      } else {
        router.push('/dashboard/owner');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please verify your email and password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-cream-light p-4 sm:p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-brand-plum text-white flex items-center justify-center shadow-soft">
              <Cake className="w-5 h-5" />
            </div>
            <span className="font-serif text-2xl font-bold text-brand-espresso">CakeStore</span>
          </Link>
          <h1 className="font-serif text-xl font-bold text-brand-espresso">Welcome Back</h1>
          <p className="text-xs text-brand-muted mt-1">Sign in to your bakery or admin management dashboard</p>
        </div>

        <Card className="p-8">
          {error && <ErrorState message={error} className="mb-6" />}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              required
              placeholder="owner@bakery.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              label="Password"
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
              Sign In <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-brand-border/60 text-center text-xs text-brand-muted">
            Don&apos;t have a bakery account yet?{' '}
            <Link href="/onboarding" className="font-semibold text-brand-plum hover:underline">
              Register Bakery
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
