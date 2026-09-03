import { renderHook, act } from '@testing-library/react';
import { OnboardingProvider, useOnboarding } from '@/app/onboarding/layout';
import React from 'react';

describe('OnboardingContext', () => {
  it('provides default data', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <OnboardingProvider>{children}</OnboardingProvider>
    );

    const { result } = renderHook(() => useOnboarding(), { wrapper });

    expect(result.current.data.name).toBe('');
    expect(result.current.data.email).toBe('');
  });

  it('updates fields correctly', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <OnboardingProvider>{children}</OnboardingProvider>
    );

    const { result } = renderHook(() => useOnboarding(), { wrapper });

    act(() => {
      result.current.updateField('name', 'John Doe');
      result.current.updateField('bakeryName', 'Sweet Bakery');
    });

    expect(result.current.data.name).toBe('John Doe');
    expect(result.current.data.bakeryName).toBe('Sweet Bakery');
  });

  it('resets data correctly', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <OnboardingProvider>{children}</OnboardingProvider>
    );

    const { result } = renderHook(() => useOnboarding(), { wrapper });

    act(() => {
      result.current.updateField('name', 'John Doe');
    });

    expect(result.current.data.name).toBe('John Doe');

    act(() => {
      result.current.reset();
    });

    expect(result.current.data.name).toBe('');
  });
});
