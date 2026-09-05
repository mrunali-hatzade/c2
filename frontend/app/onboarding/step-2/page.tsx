"use client";
import React, { useState } from 'react';
import { useOnboarding } from '@/app/onboarding/context';
import StepNavigator from '@/components/onboarding/StepNavigator';
import { z } from 'zod';
import { Store, ChevronDown, FileText, Phone } from 'lucide-react';
import { useRouter } from 'next/navigation';

const businessInfoSchema = z.object({
  bakeryName: z.string().min(1, 'Bakery name is required'),
  bakeryType: z.string().min(1, 'Bakery type is required'),
  description: z.string().optional(),
  phone: z.string().regex(/^\+?[0-9]{7,15}$/, 'Invalid phone number').optional(),
});

type Errors = Partial<Record<keyof z.infer<typeof businessInfoSchema>, string>>;

export default function BusinessInfoStep() {
  const router = useRouter();
  const { data, updateField } = useOnboarding();
  const [errors, setErrors] = useState<Errors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateField(name as any, value);
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleNext = () => {
    const result = businessInfoSchema.safeParse({
      bakeryName: data.bakeryName,
      bakeryType: data.bakeryType,
      description: data.description,
      phone: data.phone,
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
    router.push('/onboarding/step-3');
  };

  const handleBack = () => {
    router.push('/onboarding/step-1');
  };

  const bakeryTypes = [
    'Artisan Bread',
    'Pastry',
    'Custom Cakes',
    'Cupcakes',
    'Other',
  ];

  const inputCls = (field: keyof Errors) =>
    `w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-plum transition-colors ${
      errors[field] ? 'border-red-400 focus:ring-red-400' : 'border-gray-300'
    }`;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-1">Business Information</h2>
      <p className="text-sm text-gray-500 mb-6">Tell us about your bakery so customers can find you.</p>

      <form className="space-y-5" onSubmit={e => { e.preventDefault(); handleNext(); }}>
        {/* Bakery Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="bakeryName">Bakery Name</label>
          <div className="relative">
            <Store className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              id="bakeryName"
              name="bakeryName"
              type="text"
              placeholder="e.g. Sweet Delights Bakery"
              className={inputCls('bakeryName')}
              value={data.bakeryName || ''}
              onChange={handleChange}
            />
          </div>
          {errors.bakeryName && <p className="text-red-600 text-xs mt-1">{errors.bakeryName}</p>}
        </div>

        {/* Bakery Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="bakeryType">Bakery Type</label>
          <div className="relative">
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
            <select
              id="bakeryType"
              name="bakeryType"
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-plum transition-colors appearance-none bg-white ${
                errors.bakeryType ? 'border-red-400' : 'border-gray-300'
              }`}
              value={data.bakeryType || ''}
              onChange={handleChange}
            >
              <option value="" disabled>Select your bakery type</option>
              {bakeryTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          {errors.bakeryType && <p className="text-red-600 text-xs mt-1">{errors.bakeryType}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="description">
            Description <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 text-gray-400" size={18} />
            <textarea
              id="description"
              name="description"
              rows={3}
              placeholder="A short description of your bakery..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-plum transition-colors resize-none"
              value={data.description || ''}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="phone">
            Phone <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              id="phone"
              name="phone"
              type="text"
              placeholder="e.g. +919876543210"
              className={inputCls('phone')}
              value={data.phone || ''}
              onChange={handleChange}
            />
          </div>
          {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone}</p>}
        </div>

        <StepNavigator
          step={2}
          totalSteps={4}
          onBack={handleBack}
          onNext={handleNext}
          isNextEnabled={true}
        />
      </form>
    </div>
  );
}
