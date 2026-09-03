"use client";
import React, { useState } from 'react';
import { useOnboarding } from '@/app/onboarding/context';
import StepNavigator from '@/components/onboarding/StepNavigator';
import { registerOwner } from '@/lib/api';
import SuccessModal from '@/components/onboarding/SuccessModal';
import { Upload, FileCheck, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function VerificationStep() {
  const router = useRouter();
  const { data, updateField, reset } = useOnboarding();
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateField('verificationFile', file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      updateField('verificationFile', file);
    }
  };

  const handleBack = () => {
    router.push('/onboarding/step-3');
  };

  const handleSubmit = async () => {
    setError('');
    if (!data.verificationFile) {
      setError('Please upload a verification document.');
      return;
    }
    setLoading(true);
    try {
      await registerOwner(data);
      setShowSuccess(true);
      reset();
    } catch (e: any) {
      setError(e.message ?? 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const file = data.verificationFile as File | undefined;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-1">Verification Document</h2>
      <p className="text-sm text-gray-500 mb-6">
        Upload a government-issued document (e.g., FSSAI certificate, business license) to verify your bakery.
      </p>

      {/* Drag & Drop Upload Area */}
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
          dragActive
            ? 'border-brand-plum bg-brand-plum-light'
            : file
              ? 'border-green-400 bg-green-50'
              : 'border-gray-300 hover:border-brand-plum hover:bg-brand-plum-light'
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById('fileInput')?.click()}
      >
        {file ? (
          <div className="flex flex-col items-center gap-2">
            <FileCheck className="text-green-600" size={40} />
            <p className="text-sm font-medium text-green-800">{file.name}</p>
            <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB — Click to change</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="text-gray-400" size={40} />
            <p className="text-sm font-medium text-gray-700">Drag & drop your file here</p>
            <p className="text-xs text-gray-400">or click to browse — PDF, JPG, PNG accepted</p>
          </div>
        )}
        <input
          id="fileInput"
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
          <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={16} />
          <p className="text-red-700 text-sm font-medium">{error.slice(0, 200)}</p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="mt-4 flex items-center justify-center gap-2 text-brand-plum">
          <div className="w-5 h-5 border-2 border-brand-plum border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium">Submitting your application...</span>
        </div>
      )}

      <div className="mt-6">
        <StepNavigator
          step={4}
          totalSteps={4}
          onBack={handleBack}
          onNext={handleSubmit}
          isNextEnabled={!loading}
        />
      </div>

      {showSuccess && <SuccessModal />}
    </div>
  );
}
