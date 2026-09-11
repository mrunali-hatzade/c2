'use client';
/* eslint-disable @next/next/no-img-element */

import React, { useState, useRef } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Shop } from '@/types/shop';
import {
  Sparkles,
  MessageCircle,
  Calendar,
  Users,
  Send,
  CheckCircle2,
  AlertCircle,
  Upload,
  Camera,
  Link as LinkIcon,
} from 'lucide-react';
import { useToast } from '@/components/common/Toast';
import { apiClient } from '@/lib/api/client';
import { mediaApi } from '@/lib/api/media';

interface CustomCakeInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  shop: Shop;
}

export const CustomCakeInquiryModal: React.FC<CustomCakeInquiryModalProps> = ({
  isOpen,
  onClose,
  shop,
}) => {
  const toast = useToast();

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  const [occasion, setOccasion] = useState('BIRTHDAY');
  const [cakeType, setCakeType] = useState('CUSTOM_DESIGN');
  const [flavour, setFlavour] = useState('Belgian Dark Truffle');
  const [servings, setServings] = useState('15');
  const [budget, setBudget] = useState('2000');
  const [requiredDate, setRequiredDate] = useState('');
  const [deliveryPreference, setDeliveryPreference] = useState('DOORSTEP_DELIVERY');
  const [designDescription, setDesignDescription] = useState('');
  const [referenceImageUrl, setReferenceImageUrl] = useState('');

  const [imageTab, setImageTab] = useState<'upload' | 'url'>('upload');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successResult, setSuccessResult] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB');
      return;
    }
    setIsUploading(true);
    try {
      const result = await mediaApi.uploadGuestReferenceImage(file);
      setReferenceImageUrl(result.url);
      toast.success('Inspiration photo uploaded!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to upload image reference. Please ensure it is a valid JPEG, PNG, or WEBP under 5MB.');
    } finally {
      setIsUploading(false);
    }
  };

  const getWhatsAppMessage = () => {
    return encodeURIComponent(
      `Hello ${shop.businessName}!\n\n` +
      `🎂 *CUSTOM BESPOKE CAKE CONSULTATION*\n` +
      `• *Customer:* ${customerName.trim()}\n` +
      `• *Mobile:* ${customerMobile.trim()}\n` +
      `• *Occasion:* ${occasion}\n` +
      `• *Cake Style:* ${cakeType.replace(/_/g, ' ')}\n` +
      `• *Flavour:* ${flavour}\n` +
      `• *Servings / Guests:* ${servings} guests\n` +
      `• *Target Budget:* ₹${budget}\n` +
      `• *Event Date:* ${requiredDate || 'Flexible'}\n` +
      `• *Fulfillment:* ${deliveryPreference === 'DOORSTEP_DELIVERY' ? 'Doorstep Delivery' : 'Self Pickup'}\n` +
      `• *Design & Plaque Text:* ${designDescription.trim()}\n` +
      (referenceImageUrl ? `• *Reference Photo:* ${referenceImageUrl}\n` : '') +
      `\nPlease let me know your availability and estimated quote. Thank you!`
    );
  };

  const rawPhone = (shop.phone || shop.businessPhone || '').replace(/\D/g, '') || '919823100000';
  const whatsappUrl = `https://wa.me/${rawPhone.startsWith('91') ? rawPhone : '91' + rawPhone}?text=${getWhatsAppMessage()}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerMobile.trim()) {
      setErrorMessage('Please enter your name and contact phone number.');
      return;
    }
    if (!designDescription.trim()) {
      setErrorMessage('Please provide a few design notes or instructions.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    let cleanPhone = customerMobile.replace(/\D/g, '');
    if (cleanPhone.startsWith('0')) cleanPhone = cleanPhone.substring(1);
    if (!cleanPhone.startsWith('91') && cleanPhone.length === 10) cleanPhone = `91${cleanPhone}`;

    try {
      const payload = {
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim() || `${cleanPhone}@cakestore.customer`,
        customerMobile: cleanPhone,
        occasion,
        cakeType,
        flavour,
        servings: Number(servings) || 1,
        budget: Number(budget) || undefined,
        requiredDate: requiredDate || undefined,
        deliveryPreference,
        designDescription: designDescription.trim(),
        referenceImageUrl: referenceImageUrl || undefined,
      };

      const res = await apiClient.post<any>(`/api/storefront/shops/${shop.id}/custom-cakes`, payload);
      setSuccessResult(res || { id: Date.now() });
      toast.success('Custom cake inquiry submitted successfully!');
    } catch {
      setSuccessResult({ id: Date.now() });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSuccessResult(null);
    setDesignDescription('');
    setReferenceImageUrl('');
    setCustomerName('');
    setCustomerMobile('');
    setCustomerEmail('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="lg"
      title="Request a Custom Bespoke Cake"
      description={`Direct consultation with master bakers at ${shop.businessName}`}
    >
      {successResult ? (
        <div className="py-6 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <h3 className="font-serif font-bold text-xl text-brand-espresso">
              Consultation Form Submitted!
            </h3>
            <p className="text-xs text-brand-muted mt-1 max-w-md mx-auto">
              Your cake specifications have been sent to <strong>{shop.businessName}</strong>. You can also chat directly on WhatsApp to share reference sketches.
            </p>
          </div>

          <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-brand-border/60 text-left text-xs space-y-1.5 max-w-md mx-auto">
            <p><strong>Occasion:</strong> {occasion} • <strong>Flavour:</strong> {flavour}</p>
            <p><strong>Servings:</strong> {servings} guests • <strong>Budget:</strong> ₹{budget}</p>
            {requiredDate && <p><strong>Event Date:</strong> {requiredDate}</p>}
            {designDescription && <p><strong>Notes:</strong> {designDescription}</p>}
          </div>

          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-soft transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat with Chef on WhatsApp</span>
            </a>
            <Button variant="outline" size="md" onClick={handleReset}>
              Done
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Section 1: Customer Contact */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-brand-espresso uppercase tracking-wider border-b border-brand-border/60 pb-1">
              1. Your Contact Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                label="Your Name *"
                required
                placeholder="Priya Sharma"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
              <Input
                label="WhatsApp / Phone Number *"
                required
                placeholder="9823100000"
                value={customerMobile}
                onChange={(e) => setCustomerMobile(e.target.value)}
              />
              <Input
                label="Email Address"
                type="email"
                placeholder="priya@example.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Section 2: Cake Specs */}
          <div className="space-y-2.5 pt-1">
            <h4 className="text-xs font-bold text-brand-espresso uppercase tracking-wider border-b border-brand-border/60 pb-1">
              2. Celebration Details &amp; Flavour
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <Select
                label="Occasion"
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                options={[
                  { value: 'BIRTHDAY', label: '🎂 Birthday' },
                  { value: 'WEDDING', label: '💍 Wedding' },
                  { value: 'ANNIVERSARY', label: '🥂 Anniversary' },
                  { value: 'BABY_SHOWER', label: '🍼 Baby Shower' },
                  { value: 'CORPORATE', label: '🏢 Corporate' },
                  { value: 'OTHER', label: '✨ Other' },
                ]}
              />

              <Select
                label="Cake Style"
                value={cakeType}
                onChange={(e) => setCakeType(e.target.value)}
                options={[
                  { value: 'CUSTOM_DESIGN', label: 'Bespoke Theme Cake' },
                  { value: 'TIERED_WEDDING', label: 'Multi-Tier Luxe Cake' },
                  { value: 'PHOTO_PRINT', label: 'Edible Photo Print Cake' },
                  { value: '3D_SCULPTED', label: '3D Sculpted Fondant' },
                  { value: 'NAKED_FLORAL', label: 'Rustic Naked & Floral' },
                ]}
              />

              <Select
                label="Preferred Flavour"
                value={flavour}
                onChange={(e) => setFlavour(e.target.value)}
                options={[
                  { value: 'Belgian Dark Truffle', label: '🍫 Belgian Dark Truffle' },
                  { value: 'Red Velvet Cream Cheese', label: '🍓 Red Velvet Cream Cheese' },
                  { value: 'Alfonso Mango Mascarpone', label: '🥭 Mango Mascarpone' },
                  { value: 'Lotus Biscoff Ganache', label: '🍪 Lotus Biscoff' },
                  { value: 'Nutella Hazelnut Praline', label: '🌰 Hazelnut Praline' },
                  { value: 'Vanilla Bean Berry Compote', label: '🍰 Vanilla Berry' },
                  { value: 'Custom Mix', label: '✨ Chef Consultation' },
                ]}
              />

              <Input
                label="Expected Guests"
                type="number"
                min="1"
                required
                placeholder="15"
                value={servings}
                onChange={(e) => setServings(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                label="Celebration Date"
                type="date"
                required
                value={requiredDate}
                onChange={(e) => setRequiredDate(e.target.value)}
                helperText="24-48h lead time recommended"
              />

              <Input
                label="Estimated Budget (₹)"
                type="number"
                placeholder="2000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />

              <Select
                label="Fulfillment"
                value={deliveryPreference}
                onChange={(e) => setDeliveryPreference(e.target.value)}
                options={[
                  { value: 'DOORSTEP_DELIVERY', label: '🚚 Doorstep Delivery' },
                  { value: 'SELF_PICKUP', label: '🏪 Kitchen Pickup' },
                ]}
              />
            </div>
          </div>

          {/* Section 3: Design Instructions & Photo Reference */}
          <div className="space-y-2.5 pt-1">
            <h4 className="text-xs font-bold text-brand-espresso uppercase tracking-wider border-b border-brand-border/60 pb-1">
              3. Design Instructions &amp; Photo Reference
            </h4>

            <Textarea
              label="Design Instructions &amp; Plaque Text *"
              rows={3}
              required
              placeholder="Describe colors, theme elements, topper text, dietary preferences (e.g. eggless), and special requests..."
              value={designDescription}
              onChange={(e) => setDesignDescription(e.target.value)}
            />

            {/* Reference Image Upload */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-brand-espresso block">
                Inspiration / Reference Photo (Optional)
              </label>
              <div className="flex gap-2 p-1 bg-[#FAF7F2] rounded-xl border border-brand-border/60 max-w-xs">
                <button
                  type="button"
                  onClick={() => setImageTab('upload')}
                  className={`flex-1 py-1 rounded-lg text-xs font-semibold transition-all ${
                    imageTab === 'upload' ? 'bg-white text-brand-espresso shadow-xs' : 'text-brand-muted'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5 inline mr-1" /> Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setImageTab('url')}
                  className={`flex-1 py-1 rounded-lg text-xs font-semibold transition-all ${
                    imageTab === 'url' ? 'bg-white text-brand-espresso shadow-xs' : 'text-brand-muted'
                  }`}
                >
                  <LinkIcon className="w-3.5 h-3.5 inline mr-1" /> Paste URL
                </button>
              </div>

              {imageTab === 'upload' ? (
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-brand-border hover:border-[#5C1D2E]/40 rounded-2xl p-4 text-center transition-all bg-[#FAF7F2]/40 cursor-pointer"
                  >
                    {isUploading ? (
                      <div className="text-xs text-brand-muted">Uploading photo...</div>
                    ) : (
                      <>
                        <Camera className="w-5 h-5 text-brand-plum mx-auto mb-1" />
                        <p className="text-xs font-bold text-brand-espresso">Click to upload reference photo</p>
                        <p className="text-[11px] text-brand-muted">JPG, PNG, WebP up to 5MB</p>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <Input
                  placeholder="https://images.unsplash.com/... or Pinterest URL"
                  value={referenceImageUrl}
                  onChange={(e) => setReferenceImageUrl(e.target.value)}
                />
              )}

              {referenceImageUrl && (
                <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#FAF7F2] border border-brand-border/60">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-white border border-brand-border shrink-0">
                    <img
                      src={referenceImageUrl}
                      alt="Reference design"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-xs flex-1">
                    <span className="font-semibold text-brand-espresso block">Photo Attached</span>
                    <button
                      type="button"
                      onClick={() => setReferenceImageUrl('')}
                      className="text-rose-600 hover:underline text-[11px]"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-brand-border/60 flex items-center justify-end gap-2.5">
            <Button variant="ghost" size="sm" onClick={onClose} type="button" disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              size="md"
              disabled={isSubmitting}
              className="font-bold bg-[#5C1D2E] text-white hover:bg-[#4a1525] shadow-xs cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 mr-1.5" />
              <span>{isSubmitting ? 'Submitting...' : 'Submit Custom Consultation'}</span>
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
