'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Shop } from '@/types/shop';
import { Sparkles, MessageCircle, Calendar, Users, Send, CheckCircle2, Heart } from 'lucide-react';
import { useToast } from '@/components/common/Toast';

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
  const [customerPhone, setCustomerPhone] = useState('');
  const [occasion, setOccasion] = useState('Birthday');
  const [estimatedGuests, setEstimatedGuests] = useState('10-15 guests (~1.5 kg)');
  const [eventDate, setEventDate] = useState('');
  const [dietary, setDietary] = useState('100% Eggless');
  const [designNotes, setDesignNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const occasions = ['Birthday', 'Anniversary', 'Wedding', 'Baby Shower', 'Farewell', 'Festive Celebration'];
  const guestOptions = [
    '4-6 guests (~0.5 kg)',
    '8-12 guests (~1.0 kg)',
    '14-18 guests (~1.5 kg)',
    '20-25 guests (~2.0 kg)',
    '30+ guests (Tiered Custom Cake)',
  ];

  const handleReset = () => {
    setCustomerName('');
    setCustomerPhone('');
    setOccasion('Birthday');
    setEstimatedGuests('10-15 guests (~1.5 kg)');
    setEventDate('');
    setDietary('100% Eggless');
    setDesignNotes('');
    setIsSubmitted(false);
  };

  const getWhatsAppMessage = () => {
    return encodeURIComponent(
      `Hello ${shop.businessName}!\n\n` +
      `🎂 *CUSTOM CAKE INQUIRY VIA CAKESTORE*\n` +
      `• *Customer:* ${customerName || 'Customer'}\n` +
      `• *Phone:* ${customerPhone || 'Not provided'}\n` +
      `• *Occasion:* ${occasion}\n` +
      `• *Target Size:* ${estimatedGuests}\n` +
      `• *Dietary:* ${dietary}\n` +
      `• *Event Date:* ${eventDate || 'Flexible'}\n` +
      `• *Special Design Notes:* ${designNotes || 'None specified'}\n\n` +
      `Please let me know your availability and estimated quote. Thank you!`
    );
  };

  const rawPhone = shop.phone ? shop.phone.replace(/[^0-9]/g, '') : '919876543210';
  const whatsappUrl = `https://wa.me/${rawPhone.startsWith('91') ? rawPhone : '91' + rawPhone}?text=${getWhatsAppMessage()}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      toast.error('Please enter your name and contact phone number.');
      return;
    }
    setIsSubmitted(true);
    toast.success('Inquiry logged! You can now send it to the baker on WhatsApp.');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="lg" title="Request a Custom Bespoke Cake">
      {isSubmitted ? (
        <div className="py-6 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <h3 className="font-serif font-bold text-xl text-brand-espresso">
              Inquiry Drafted for {shop.businessName}!
            </h3>
            <p className="text-xs text-brand-muted mt-1 max-w-md mx-auto">
              We have formatted your celebration requirements. Tap the button below to connect with Chef directly on WhatsApp to finalize design sketches, reference photos, and final quote.
            </p>
          </div>

          {/* Quick Summary Card */}
          <div className="bg-brand-cream-light p-4 rounded-2xl border border-brand-border text-left text-xs space-y-1.5 max-w-md mx-auto">
            <p><strong>Occasion:</strong> {occasion}</p>
            <p><strong>Size:</strong> {estimatedGuests}</p>
            <p><strong>Dietary:</strong> {dietary}</p>
            {eventDate && <p><strong>Event Date:</strong> {eventDate}</p>}
            {designNotes && <p><strong>Design Notes:</strong> {designNotes}</p>}
          </div>

          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-soft transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Send to Baker on WhatsApp</span>
            </a>
            <Button
              variant="outline"
              size="md"
              onClick={() => {
                handleReset();
                onClose();
              }}
            >
              Close
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-brand-blush/60 p-3.5 rounded-2xl border border-brand-border flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-brand-plum shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-bold text-brand-espresso">Direct Consultation with {shop.businessName}</p>
              <p className="text-brand-muted mt-0.5">
                Need a multi-tier wedding cake, customized theme, or photo cake? Share your requirements and receive a personalized quote without marketplace markup.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Input
              label="Your Full Name *"
              placeholder="e.g. Priya Sharma"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
            <Input
              label="WhatsApp / Phone Number *"
              placeholder="e.g. 9876543210"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-brand-espresso mb-1">
                Occasion / Celebration
              </label>
              <select
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                className="w-full text-xs rounded-xl border border-brand-border bg-white px-3 py-2 text-brand-espresso focus:outline-none focus:ring-2 focus:ring-brand-plum/20"
              >
                {occasions.map((occ) => (
                  <option key={occ} value={occ}>
                    {occ}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-espresso mb-1">
                Estimated Size & Serving
              </label>
              <select
                value={estimatedGuests}
                onChange={(e) => setEstimatedGuests(e.target.value)}
                className="w-full text-xs rounded-xl border border-brand-border bg-white px-3 py-2 text-brand-espresso focus:outline-none focus:ring-2 focus:ring-brand-plum/20"
              >
                {guestOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Input
              type="date"
              label="Celebration / Event Date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              helperText="Most custom cakes require 24-48h lead time"
            />

            <div>
              <label className="block text-xs font-bold text-brand-espresso mb-1">
                Dietary Preference
              </label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {['100% Eggless', 'Regular (Contains Egg)', 'Vegan', 'Gluten-Free'].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDietary(d)}
                    className={`py-1.5 px-2 rounded-xl text-2xs font-semibold border transition-all ${
                      dietary === d
                        ? 'bg-brand-plum text-white border-brand-plum'
                        : 'bg-white text-brand-espresso border-brand-border hover:bg-brand-cream/40'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Textarea
            label="Design Theme & Flavor Ideas"
            placeholder="e.g. Pastel lavender aesthetic, fresh strawberries & dark chocolate ganache, 2 tiers with golden butterfly toppers..."
            value={designNotes}
            onChange={(e) => setDesignNotes(e.target.value)}
            rows={3}
            helperText="You can share reference Instagram photos or Pinterest pins directly in WhatsApp next."
          />

          <div className="pt-3 border-t border-brand-border/60 flex items-center justify-end gap-3">
            <Button variant="ghost" size="sm" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button type="submit" size="md" className="gap-2">
              <Send className="w-3.5 h-3.5" />
              <span>Review & WhatsApp Quote</span>
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
