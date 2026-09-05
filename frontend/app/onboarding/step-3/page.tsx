"use client";
import React, { useState } from 'react';
import { useOnboarding } from '@/app/onboarding/context';
import StepNavigator from '@/components/onboarding/StepNavigator';
import { z } from 'zod';
import { MapPin, Building2, Map } from 'lucide-react';
import { useRouter } from 'next/navigation';

const locationSchema = z.object({
  addressLine1: z.string().min(1, 'Address Line 1 is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  pincode: z.string().min(5, 'Pincode is required').regex(/^\d{5,6}$/, 'Invalid pincode'),
});

type Errors = Partial<Record<keyof z.infer<typeof locationSchema>, string>>;

export default function LocationStep() {
  const router = useRouter();
  const { data, updateField } = useOnboarding();
  const [errors, setErrors] = useState<Errors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateField(name as any, value);
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleNext = () => {
    const result = locationSchema.safeParse({
      addressLine1: data.addressLine1,
      addressLine2: data.addressLine2,
      city: data.city,
      state: data.state,
      pincode: data.pincode,
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
    router.push('/onboarding/step-4');
  };

  const handleBack = () => {
    router.push('/onboarding/step-2');
  };

  const inputCls = (field: keyof Errors) =>
    `w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-plum transition-colors ${
      errors[field] ? 'border-red-400 focus:ring-red-400' : 'border-gray-300'
    }`;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-1">Shop Location</h2>
      <p className="text-sm text-gray-500 mb-6">Where is your bakery located? Customers will find you here.</p>

      <form className="space-y-5" onSubmit={e => { e.preventDefault(); handleNext(); }}>
        {/* Address Line 1 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="addressLine1">Address Line 1</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              id="addressLine1"
              name="addressLine1"
              type="text"
              placeholder="e.g. 42, MG Road"
              className={inputCls('addressLine1')}
              value={data.addressLine1 || ''}
              onChange={handleChange}
            />
          </div>
          {errors.addressLine1 && <p className="text-red-600 text-xs mt-1">{errors.addressLine1}</p>}
        </div>

        {/* Address Line 2 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="addressLine2">
            Address Line 2 <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              id="addressLine2"
              name="addressLine2"
              type="text"
              placeholder="e.g. Near City Mall, Floor 2"
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-plum transition-colors"
              value={data.addressLine2 || ''}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* City + State */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="city">City</label>
            <input
              id="city"
              name="city"
              type="text"
              placeholder="e.g. Pune"
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-plum transition-colors ${
                errors.city ? 'border-red-400' : 'border-gray-300'
              }`}
              value={data.city || ''}
              onChange={handleChange}
            />
            {errors.city && <p className="text-red-600 text-xs mt-1">{errors.city}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="state">State</label>
            <input
              id="state"
              name="state"
              type="text"
              placeholder="e.g. Maharashtra"
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-plum transition-colors ${
                errors.state ? 'border-red-400' : 'border-gray-300'
              }`}
              value={data.state || ''}
              onChange={handleChange}
            />
            {errors.state && <p className="text-red-600 text-xs mt-1">{errors.state}</p>}
          </div>
        </div>

        {/* Pincode */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="pincode">Pincode</label>
          <div className="relative">
            <Map className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              id="pincode"
              name="pincode"
              type="text"
              placeholder="e.g. 411044"
              className={inputCls('pincode')}
              value={data.pincode || ''}
              onChange={handleChange}
            />
          </div>
          {errors.pincode && <p className="text-red-600 text-xs mt-1">{errors.pincode}</p>}
        </div>

        <StepNavigator
          step={3}
          totalSteps={4}
          onBack={handleBack}
          onNext={handleNext}
          isNextEnabled={true}
        />
      </form>
    </div>
  );
}
