"use client";
import React, { ReactNode } from 'react';
import { OnboardingProvider } from './context';
import { usePathname } from 'next/navigation';

const steps = [
  { label: 'Account', path: '/onboarding/step-1' },
  { label: 'Business', path: '/onboarding/step-2' },
  { label: 'Location', path: '/onboarding/step-3' },
  { label: 'Verify', path: '/onboarding/step-4' },
];

function ProgressBar() {
  const pathname = usePathname();
  const currentStep = steps.findIndex(s => s.path === pathname) + 1;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        {steps.map((step, i) => {
          const stepNum = i + 1;
          const isCompleted = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;
          return (
            <div key={step.path} className="flex flex-col items-center flex-1">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                isCompleted
                  ? 'bg-brand-plum border-brand-plum text-white'
                  : isCurrent
                    ? 'border-brand-plum text-brand-plum bg-brand-plum-light'
                    : 'border-gray-300 text-gray-400 bg-white'
              }`}>
                {isCompleted ? '✓' : stepNum}
              </div>
              <span className={`text-xs mt-1.5 font-medium ${
                isCurrent ? 'text-brand-plum' : isCompleted ? 'text-brand-plum' : 'text-gray-400'
              }`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
      {/* Progress line */}
      <div className="relative h-1 bg-gray-200 rounded-full mx-6 -mt-1">
        <div 
          className="absolute top-0 left-0 h-full bg-brand-plum rounded-full transition-all duration-500"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />
      </div>
    </div>
  );
}

export default function OnboardingLayout({ children }: { children: ReactNode }) {
  return (
    <OnboardingProvider>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-cream via-white to-brand-plum-light p-4">
        <div className="w-full max-w-2xl">
          {/* Logo */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-brand-plum">
              🎂 CakeStore
            </h1>
            <p className="text-sm text-brand-muted mt-1">Launch your bakery business online</p>
          </div>
          
          {/* Card */}
          <div className="bg-white rounded-2xl shadow-card border border-brand-border p-8">
            <ProgressBar />
            {children}
          </div>
          
          {/* Footer */}
          <p className="text-center text-xs text-brand-muted mt-4">
            Already have an account?{' '}
            <a href="/login" className="text-brand-plum hover:underline font-medium">Sign in</a>
          </p>
        </div>
      </div>
    </OnboardingProvider>
  );
}
