'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Cake, Store, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
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

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');

  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('HOME_BAKER');
  const [businessDescription, setBusinessDescription] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');

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
        router.push('/dashboard/owner');
      } catch {
        router.push('/login');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please review your details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream-light py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-plum text-white flex items-center justify-center shadow-soft">
              <Cake className="w-5 h-5" />
            </div>
            <span className="font-serif text-2xl font-bold text-brand-espresso">CakeStore</span>
          </Link>
          <h1 className="font-serif text-2xl font-bold text-brand-espresso">Register Your Bakery</h1>
          <p className="text-xs text-brand-muted mt-1">
            Launch your independent digital cake storefront in 3 simple steps
          </p>

          {/* Stepper indicator */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${step >= 1 ? 'bg-brand-plum text-white' : 'bg-brand-cream text-brand-muted'}`}>
              1. Account
            </span>
            <div className="w-6 h-0.5 bg-brand-border" />
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${step >= 2 ? 'bg-brand-plum text-white' : 'bg-brand-cream text-brand-muted'}`}>
              2. Bakery Details
            </span>
            <div className="w-6 h-0.5 bg-brand-border" />
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${step >= 3 ? 'bg-brand-plum text-white' : 'bg-brand-cream text-brand-muted'}`}>
              3. Location & License
            </span>
          </div>
        </div>

        <Card className="p-8">
          {error && <ErrorState message={error} className="mb-6" />}

          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-base font-serif font-bold text-brand-espresso pb-2 border-b border-brand-border/60">
                Personal & Account Credentials
              </h2>
              <Input
                label="Full Name"
                required
                placeholder="Chef Anita Verma"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <Input
                label="Email Address"
                type="email"
                required
                placeholder="anita@bakes.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                label="Password (min 8 characters)"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Input
                label="Mobile Number (10 digits)"
                required
                placeholder="9876543210"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />

              <div className="pt-4 flex justify-end">
                <Button
                  onClick={() => {
                    if (!fullName || !email || !password || !mobile) {
                      setError('Please fill in all required personal credentials.');
                      return;
                    }
                    setError(null);
                    setStep(2);
                  }}
                >
                  Continue to Bakery Details <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-base font-serif font-bold text-brand-espresso pb-2 border-b border-brand-border/60">
                Bakery Identity
              </h2>
              <Input
                label="Bakery Name"
                required
                placeholder="Vanilla Bean Confections"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
              />
              <Select
                label="Bakery Type"
                options={[
                  { value: 'HOME_BAKER', label: 'Home Baker / Artisan Kitchen' },
                  { value: 'PASTRY_SHOP', label: 'Pastry Boutique / Retail Shop' },
                  { value: 'CUSTOM_CAKE_STUDIO', label: 'Custom Cake Studio' },
                  { value: 'COMMERCIAL_BAKERY', label: 'Commercial Bakery' },
                ]}
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
              />
              <Input
                label="Bakery Description"
                placeholder="Specializing in handcrafted Belgian chocolate gateaux and French entremets."
                value={businessDescription}
                onChange={(e) => setBusinessDescription(e.target.value)}
              />
              <Input
                label="Business Phone (Optional)"
                placeholder="9876543210"
                value={businessPhone}
                onChange={(e) => setBusinessPhone(e.target.value)}
              />

              <div className="pt-4 flex justify-between">
                <Button variant="ghost" onClick={() => setStep(1)}>
                  <ArrowLeft className="w-4 h-4 mr-1" /> Back
                </Button>
                <Button
                  onClick={() => {
                    if (!businessName) {
                      setError('Please enter your bakery name.');
                      return;
                    }
                    setError(null);
                    setStep(3);
                  }}
                >
                  Continue to Location <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <form onSubmit={handleRegister} className="space-y-4">
              <h2 className="text-base font-serif font-bold text-brand-espresso pb-2 border-b border-brand-border/60">
                Location & FSSAI Details
              </h2>
              <Input
                label="Street Address / Kitchen Location"
                required
                placeholder="Shop 14, Heritage Square, MG Road"
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

              {/* Datalists for Indian Locations */}
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
                <option value="Chandigarh" />
                <option value="Lucknow" />
                <option value="Kochi" />
              </datalist>

              <datalist id="onboarding-states">
                <option value="Maharashtra" />
                <option value="Karnataka" />
                <option value="Delhi NCR" />
                <option value="Telangana" />
                <option value="Tamil Nadu" />
                <option value="West Bengal" />
                <option value="Gujarat" />
                <option value="Rajasthan" />
                <option value="Punjab" />
                <option value="Kerala" />
                <option value="Uttar Pradesh" />
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
                />
              </div>

              <div className="pt-4 flex justify-between items-center">
                <Button variant="ghost" type="button" onClick={() => setStep(2)}>
                  <ArrowLeft className="w-4 h-4 mr-1" /> Back
                </Button>
                <Button type="submit" isLoading={isLoading}>
                  <CheckCircle className="w-4 h-4 mr-1.5" />
                  Complete Registration
                </Button>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
