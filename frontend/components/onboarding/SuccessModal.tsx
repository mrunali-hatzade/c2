"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SuccessModal() {
  const router = useRouter();

  // Auto‑redirect after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/dashboard/owner');
    }, 3000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-4 text-brand-plum">
          🎉 Registration Complete!
        </h2>
        <p className="mb-6 text-gray-700">
          Your bakery has been successfully registered and is now pending verification.
          You will be redirected to the Owner Dashboard shortly.
        </p>
        <button
          onClick={() => router.push('/dashboard/owner')}
          className="px-5 py-2 bg-brand-plum text-white rounded-md hover:bg-brand-plum-dark focus:outline-none focus:ring-2 focus:ring-brand-plum"
        >
          Go to Dashboard now
        </button>
      </div>
    </div>
  );
}
