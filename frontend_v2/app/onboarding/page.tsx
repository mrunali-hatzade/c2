'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Cake,
  Store,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  MapPin,
  User,
  Mail,
  Lock,
  Phone,
  Building2,
  FileCheck,
} from 'lucide-react';
import { authApi } from '@/lib/api/auth';
import { useAuth } from '@/lib/auth/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import { ErrorState } from '@/components/ui/ErrorState';

export default function OnboardingPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Personal & Account
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');

  // Step 2: Bakery Identity
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('HOME_BAKER');
  const [businessDescription, setBusinessDescription] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');

  // Step 3: Location & License
  const [addressLine1, setAddressLine1] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Maharashtra');
  const [pincode, setPincode] = useState('');
  const [fssaiRegistration, setFssaiRegistration] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await authApi.register({
        fullName,
        email,
        password,
        mobile,
        businessName,
        businessType,
        businessDescription,
        businessPhone: businessPhone || mobile,
        addressLine1,
        city,
        state,
        pincode,
        fssaiRegistration,
      });

      // Direct auto-login with credentials
      try {
        await login({ email, password });
        setStep(4);
      } catch {
        router.push('/login');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please review your details.');
    } finally {
      setIsLoading(false);
    }
  };

  const stepsInfo = [
    { num: 1, label: 'Account', icon: User },
    { num: 2, label: 'Bakery Details', icon: Store },
    { num: 3, label: 'Location & FSSAI', icon: MapPin },
  ];

  return (
    <div className="min-h-screen bg-brand-cream-light font-sans flex flex-col justify-between">
      {/* Top Header */}
      <header className="border-b border-brand-border/60 bg-white/80 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-plum text-white flex items-center justify-center shadow-soft">
              <Cake className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif text-xl font-bold text-brand-espresso block leading-none">
                CakeStore
              </span>
              <span className="text-[10px] uppercase tracking-wider text-brand-muted font-medium">
                Baker Partner Program
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-brand-muted hidden sm:inline">Already registered?</span>
            <Link href="/login" className="font-bold text-brand-plum hover:underline">
              Owner Login &rarr;
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-10">
        {step < 4 && (
          <div className="text-center max-w-2xl mx-auto mb-8 space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-blush border border-brand-blush-border text-brand-plum text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Start Your Free 14-Day Trial • 0% Commission</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-brand-espresso tracking-tight">
              Launch Your Bakery <span className="text-brand-plum italic">Online</span>
            </h1>

            <p className="text-xs sm:text-sm text-brand-muted max-w-lg mx-auto leading-relaxed">
              Create your custom digital storefront, showcase artisanal cakes, and accept customer orders in 3 simple steps.
            </p>

            {/* Visual Stepper */}
            <div className="flex items-center justify-center gap-2 sm:gap-4 pt-4">
              {stepsInfo.map((s, idx) => {
                const Icon = s.icon;
                const isCompleted = step > s.num;
                const isCurrent = step === s.num;

                return (
                  <React.Fragment key={s.num}>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          isCompleted
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : isCurrent
                            ? 'bg-brand-plum text-white shadow-soft ring-4 ring-brand-plum/20'
                            : 'bg-white border border-brand-border text-brand-muted'
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-3.5 h-3.5" />}
                      </div>
                      <span
                        className={`text-xs font-semibold hidden sm:inline ${
                          isCurrent ? 'text-brand-espresso font-bold' : 'text-brand-muted'
                        }`}
                      >
                        {s.label}
                      </span>
                    </div>
                    {idx < stepsInfo.length - 1 && (
                      <div
                        className={`w-8 sm:w-12 h-0.5 transition-colors ${
                          step > s.num ? 'bg-emerald-600' : 'bg-brand-border'
                        }`}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        )}

        {/* Card Container */}
        <div className="max-w-2xl mx-auto">
          <Card className="p-6 sm:p-10 shadow-soft border-brand-border/80">
            {error && <ErrorState message={error} className="mb-6" />}

            {/* STEP 1: Personal Credentials */}
            {step === 1 && (
              <div className="space-y-5">
                <div className="pb-3 border-b border-brand-border/60">
                  <h2 className="text-lg font-serif font-bold text-brand-espresso">
                    Step 1: Account Credentials
                  </h2>
                  <p className="text-xs text-brand-muted mt-0.5">
                    Your login details for managing your bakery
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Your Full Name"
                    required
                    placeholder="Chef Anita Verma"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                  <Input
                    label="Mobile Phone"
                    required
                    placeholder="9876543210"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                  />
                </div>

                <Input
                  label="Email Address (Login ID)"
                  type="email"
                  required
                  placeholder="anita@bakes.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <Input
                  label="Create Password (min 8 characters)"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  helperText="Use a secure password to protect your kitchen orders and revenue."
                />

                <div className="pt-4 flex justify-between items-center border-t border-brand-border/60">
                  <Link href="/login" className="text-xs font-semibold text-brand-plum hover:underline">
                    Already have an account? Sign in
                  </Link>
                  <Button
                    onClick={() => {
                      if (!fullName || !email || !password || !mobile) {
                        setError('Please complete all required fields before continuing.');
                        return;
                      }
                      if (password.length < 8) {
                        setError('Password must be at least 8 characters long.');
                        return;
                      }
                      setError(null);
                      setStep(2);
                    }}
                    size="lg"
                  >
                    <span>Next: Bakery Details</span>
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 2: Bakery Identity */}
            {step === 2 && (
              <div className="space-y-5">
                <div className="pb-3 border-b border-brand-border/60">
                  <h2 className="text-lg font-serif font-bold text-brand-espresso">
                    Step 2: Bakery Brand & Concept
                  </h2>
                  <p className="text-xs text-brand-muted mt-0.5">
                    This information appears on your live customer storefront
                  </p>
                </div>

                <Input
                  label="Bakery / Brand Name"
                  required
                  placeholder="e.g. Vanilla Bean Confections"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                />

                <Select
                  label="Bakery Business Type"
                  options={[
                    { value: 'HOME_BAKER', label: '🏠 Home Baker / Artisan Kitchen' },
                    { value: 'PASTRY_SHOP', label: '🏬 Pastry Boutique / Retail Shop' },
                    { value: 'CUSTOM_CAKE_STUDIO', label: '🎂 Custom Cake Studio' },
                    { value: 'COMMERCIAL_BAKERY', label: '🏭 Commercial Bakery' },
                  ]}
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                />

                <Input
                  label="Bakery Bio / Story (Optional)"
                  placeholder="Specializing in handcrafted Belgian chocolate gateaux, French entremets, and birthday cakes."
                  value={businessDescription}
                  onChange={(e) => setBusinessDescription(e.target.value)}
                />

                <Input
                  label="Order WhatsApp / Contact Phone"
                  placeholder="9876543210 (Leave blank to use personal mobile)"
                  value={businessPhone}
                  onChange={(e) => setBusinessPhone(e.target.value)}
                />

                <div className="pt-4 flex justify-between items-center border-t border-brand-border/60">
                  <Button variant="ghost" onClick={() => setStep(1)}>
                    <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
                  </Button>
                  <Button
                    onClick={() => {
                      if (!businessName) {
                        setError('Please enter your bakery or brand name.');
                        return;
                      }
                      setError(null);
                      setStep(3);
                    }}
                    size="lg"
                  >
                    <span>Next: Location Details</span>
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 3: Location & License */}
            {step === 3 && (
              <form onSubmit={handleRegister} className="space-y-5">
                <div className="pb-3 border-b border-brand-border/60">
                  <h2 className="text-lg font-serif font-bold text-brand-espresso">
                    Step 3: Location & License
                  </h2>
                  <p className="text-xs text-brand-muted mt-0.5">
                    Helps local customers find your bakery on the marketplace
                  </p>
                </div>

                <Input
                  label="Kitchen / Street Address"
                  required
                  placeholder="Flat 204, Rosewood Apts / Shop 14, MG Road"
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="City"
                    required
                    placeholder="e.g. Mumbai, Pune, Bengaluru"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    list="onboarding-cities"
                  />
                  <Input
                    label="State"
                    required
                    placeholder="e.g. Maharashtra, Karnataka"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    list="onboarding-states"
                  />
                </div>

                <datalist id="onboarding-cities">
                  <option value="Mumbai" />
                  <option value="Pune" />
                  <option value="Bengaluru" />
                  <option value="Delhi NCR" />
                  <option value="Hyderabad" />
                  <option value="Chennai" />
                  <option value="Kolkata" />
                  <option value="Ahmedabad" />
                  <option value="Jaipur" />
                </datalist>

                <datalist id="onboarding-states">
                  <option value="Maharashtra" />
                  <option value="Karnataka" />
                  <option value="Delhi NCR" />
                  <option value="Telangana" />
                  <option value="Tamil Nadu" />
                  <option value="Gujarat" />
                </datalist>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Pincode (6 digits)"
                    required
                    placeholder="400050"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                  />
                  <Input
                    label="FSSAI Registration No. (Optional)"
                    placeholder="11520000000000"
                    value={fssaiRegistration}
                    onChange={(e) => setFssaiRegistration(e.target.value)}
                    helperText="Recommended to display verified trust badge."
                  />
                </div>

                <div className="pt-4 flex justify-between items-center border-t border-brand-border/60">
                  <Button variant="ghost" type="button" onClick={() => setStep(2)}>
                    <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
                  </Button>
                  <Button type="submit" size="lg" isLoading={isLoading} className="font-bold">
                    <CheckCircle2 className="w-4 h-4 mr-1.5" />
                    Complete Registration
                  </Button>
                </div>
              </form>
            )}

            {/* STEP 4: Celebratory Live Screen */}
            {step === 4 && (
              <div className="text-center py-8 space-y-6">
                <div className="w-20 h-20 rounded-3xl bg-emerald-50 border-2 border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-soft">
                  <Sparkles className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-brand-espresso">
                    Your Bakery is Live! 🎉
                  </h2>
                  <p className="text-sm text-brand-muted max-w-md mx-auto leading-relaxed">
                    Congratulations! <span className="font-semibold text-brand-espresso">{businessName || 'Your Bakery'}</span> is now registered on CakeStore. Your 14-day free trial has started.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-brand-blush/60 border border-brand-blush-border max-w-md mx-auto text-left space-y-2 text-xs">
                  <p className="font-bold text-brand-espresso">Next Recommended Steps:</p>
                  <p className="text-brand-muted">1. Add your first signature cake to your digital menu</p>
                  <p className="text-brand-muted">2. Set your daily delivery time windows</p>
                  <p className="text-brand-muted">3. Share your custom storefront link with customers!</p>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/dashboard/owner">
                    <Button size="lg" className="w-full sm:w-auto font-bold shadow-soft">
                      <span>Go to Owner Dashboard</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </Card>
        </div>
      </main>

      {/* Footer Perks Bar */}
      <footer className="border-t border-brand-border/60 bg-white/60 py-4 text-center text-xs text-brand-muted">
        <div className="max-w-4xl mx-auto px-4 flex flex-wrap items-center justify-center gap-6">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>0% Commission on all orders</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>No credit card required for trial</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Store className="w-4 h-4 text-brand-plum" />
            <span>Instant custom storefront link</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
