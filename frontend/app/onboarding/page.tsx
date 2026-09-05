import { redirect } from 'next/navigation';

export default function OnboardingRoot() {
  // Immediately redirect to the first step of the wizard
  redirect('/onboarding/step-1');
  return null; // This line never renders because of redirect
}
