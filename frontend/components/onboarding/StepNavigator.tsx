import React from 'react';
import Link from 'next/link';

type StepNavigatorProps = {
  /** Current step index (1‑based) */
  step: number;
  /** Total number of steps in the wizard */
  totalSteps: number;
  /** Callback when Back is clicked */
  onBack?: () => void;
  /** Callback when Next is clicked */
  onNext: () => void;
  /** Whether the Next button should be enabled */
  isNextEnabled?: boolean;
  /** Show Back button – defaults to true */
  showBack?: boolean;
};

export default function StepNavigator({
  step,
  totalSteps,
  onBack,
  onNext,
  isNextEnabled = true,
  showBack = true,
}: StepNavigatorProps) {
  return (
    <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
      <div className="flex-1">
        {showBack && onBack && (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-plum"
          >
            ← Back
          </button>
        )}
      </div>
      <div className="flex-1 text-center text-sm text-gray-600">
        Step {step} of {totalSteps}
      </div>
      <div className="flex-1 text-right">
        <button
          type="button"
          onClick={onNext}
          disabled={!isNextEnabled}
          className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isNextEnabled ? 'bg-brand-plum hover:bg-brand-plum-dark focus:ring-2 focus:ring-brand-plum' : 'bg-gray-300 cursor-not-allowed'}`}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
