"use client";
import React, { useState } from 'react';
import { useOnboarding } from '@/app/onboarding/context';
import StepNavigator from '@/components/onboarding/StepNavigator';
import { z } from 'zod';
import { User, Mail, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';

const registrationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type Errors = Partial<Record<keyof z.infer<typeof registrationSchema>, string>>;

export default function RegistrationStep() {
  const router = useRouter();
  const { data, updateField } = useOnboarding();
  const [errors, setErrors] = useState<Errors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateField(name as any, value);
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleNext = () => {
    const result = registrationSchema.safeParse({
      name: data.name,
      email: data.email,
      password: data.password,
    });
    if (!result.success) {
      const fieldErrors: Errors = {};
      result.error.issues.forEach(err => {
        if (err.path && err.path[0]) {
          fieldErrors[err.path[0] as keyof Errors] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }
    router.push('/onboarding/step-2');
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-1">Create your account</h2>
      <p className="text-sm text-gray-500 mb-6">Enter your personal details to get started.</p>

      <form className="space-y-5" onSubmit={e => { e.preventDefault(); handleNext(); }}>
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="name">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              id="name"
              name="name"
              type="text"
              placeholder="e.g. Priya Sharma"
              className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-plum transition-colors ${
                errors.name ? 'border-red-400 focus:ring-red-400' : 'border-gray-300'
              }`}
              value={data.name}
              onChange={handleChange}
            />
          </div>
          {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="email">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-plum transition-colors ${
                errors.email ? 'border-red-400 focus:ring-red-400' : 'border-gray-300'
              }`}
              value={data.email}
              onChange={handleChange}
            />
          </div>
          {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="password">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Min. 6 characters"
              className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-plum transition-colors ${
                errors.password ? 'border-red-400 focus:ring-red-400' : 'border-gray-300'
              }`}
              value={data.password}
              onChange={handleChange}
            />
          </div>
          {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password}</p>}
        </div>

        <StepNavigator
          step={1}
          totalSteps={4}
          showBack={false}
          onNext={handleNext}
        />
      </form>
    </div>
  );
}
