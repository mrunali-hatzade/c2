'use client';

import React, { useState } from 'react';
import {
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  MessageCircle,
} from 'lucide-react';
import { Shop } from '@/types/shop';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import { apiClient } from '@/lib/api/client';

interface StorefrontContactTabProps {
  shop: Shop;
}

export const StorefrontContactTab: React.FC<StorefrontContactTabProps> = ({ shop }) => {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [enquiryType, setEnquiryType] = useState('GENERAL_INQUIRY');
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const cleanPhone = (shop.phone || shop.businessPhone || '').replace(/\D/g, '');

  const addressParts = [
    shop.addressLine1 || shop.address,
    shop.area,
    shop.city,
    shop.district,
    shop.state,
  ].filter(Boolean);

  const fullAddress =
    addressParts.length > 0
      ? `${addressParts.join(', ')}${shop.pincode ? ` - ${shop.pincode}` : ''}`
      : `${shop.city || 'Pune'}, ${shop.state || 'Maharashtra'}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await apiClient.post(`/api/storefront/shops/${shop.id}/enquiries`, {
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        enquiryType,
        message: message.trim(),
      });
      setSuccess(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit enquiry. Please try again or contact via WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-10 pb-16 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-blush border border-brand-blush-border text-brand-plum text-xs font-semibold">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>We are here to assist</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-brand-espresso">
          Get in Touch with <span className="text-brand-plum italic">{shop.businessName}</span>
        </h1>
        <p className="text-xs sm:text-sm text-brand-muted max-w-md mx-auto leading-relaxed">
          Have a question about flavor customizations, bulk corporate orders, or delivery timing? Reach out directly.
        </p>
      </div>

      {/* Quick Contact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {cleanPhone && (
          <Card className="p-6 flex flex-col justify-between space-y-4 hover:border-brand-plum/40 transition-colors">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-[#25D366]/15 flex items-center justify-center text-[#25D366]">
                <MessageCircle className="w-6 h-6 fill-current" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-brand-espresso">WhatsApp Direct</h2>
                <p className="text-xs text-brand-muted mt-0.5">Instant chat with the chef</p>
              </div>
            </div>
            <a
              href={`https://wa.me/${cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`}?text=Hi%20${encodeURIComponent(shop.businessName)},%20I%20have%20an%20enquiry.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#25D366] text-white text-xs font-bold hover:bg-[#20bd5a] transition-all shadow-xs"
            >
              <span>Chat on WhatsApp</span>
            </a>
          </Card>
        )}

        {shop.phone && (
          <Card className="p-6 flex flex-col justify-between space-y-4 hover:border-brand-plum/40 transition-colors">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-brand-blush flex items-center justify-center text-brand-plum">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-brand-espresso">Phone Consultation</h2>
                <p className="text-xs text-brand-muted mt-0.5">Mon–Sat, 10 AM to 8 PM</p>
              </div>
            </div>
            <a
              href={`tel:${shop.phone}`}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-brand-plum text-white text-xs font-bold hover:bg-brand-plum-hover transition-all shadow-xs"
            >
              <span>Call {shop.phone}</span>
            </a>
          </Card>
        )}

        <Card className="p-6 flex flex-col justify-between space-y-4 hover:border-brand-plum/40 transition-colors">
          <div className="space-y-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-brand-espresso">Kitchen Address</h2>
              <p className="text-xs text-brand-muted mt-0.5 line-clamp-2">{fullAddress}</p>
            </div>
          </div>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shop.businessName + ' ' + fullAddress)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-brand-cream border border-brand-border text-brand-espresso text-xs font-semibold hover:bg-brand-border/40 transition-all"
          >
            <span>Open in Google Maps</span>
          </a>
        </Card>
      </div>

      {/* Direct In-Store Enquiry Form */}
      <Card className="p-6 sm:p-10 border border-brand-border/80 shadow-soft max-w-2xl mx-auto">
        {success ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-serif font-bold text-brand-espresso">Message Sent Successfully!</h2>
            <p className="text-xs text-brand-muted max-w-sm mx-auto">
              Thank you for reaching out. The team at {shop.businessName} will respond to your enquiry shortly.
            </p>
            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSuccess(false);
                  setMessage('');
                }}
              >
                Send Another Message
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="text-center pb-2 border-b border-brand-border/60">
              <h2 className="text-lg font-serif font-bold text-brand-espresso">
                Send a Message to the Kitchen
              </h2>
              <p className="text-xs text-brand-muted mt-0.5">
                We typically respond within 2 to 4 hours
              </p>
            </div>

            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Your Name"
                required
                placeholder="Rohit Verma"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
              <Input
                label="Email Address"
                type="email"
                required
                placeholder="rohit@example.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
              />
            </div>

            <Select
              label="Enquiry Subject"
              value={enquiryType}
              onChange={(e) => setEnquiryType(e.target.value)}
              options={[
                { value: 'GENERAL_INQUIRY', label: 'General Question' },
                { value: 'BULK_ORDER', label: 'Bulk & Corporate Catering' },
                { value: 'DIETARY_QUESTION', label: 'Dietary & Allergy Inquiries' },
                { value: 'DELIVERY_QUERY', label: 'Delivery Timings & Slots' },
                { value: 'OTHER', label: 'Other' },
              ]}
            />

            <Textarea
              label="Your Message"
              rows={4}
              required
              placeholder="Tell us how we can help with your cake order..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="w-full font-bold shadow-sm"
            >
              <Send className="w-4 h-4 mr-2" />
              <span>{isSubmitting ? 'Sending Message...' : 'Send Message'}</span>
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
};
