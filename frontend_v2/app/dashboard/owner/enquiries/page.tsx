'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  MessageSquareQuote,
  Calendar,
  DollarSign,
  Sparkles,
  Phone,
  MessageCircle,
  Eye,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { ownerApi } from '@/lib/api/owner';
import { CustomCakeEnquiry, EnquiryStatus } from '@/types/owner';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { LoadingState } from '@/components/ui/LoadingState';
import { useToast } from '@/components/common/Toast';

export default function OwnerEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<CustomCakeEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [quoteEnquiry, setQuoteEnquiry] = useState<CustomCakeEnquiry | null>(null);
  const [quoteAmount, setQuoteAmount] = useState<number>(3000);
  const toast = useToast();

  const loadEnquiries = async () => {
    setLoading(true);
    try {
      const data = await ownerApi.getEnquiries();
      setEnquiries(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiries();
  }, []);

  const handleUpdateStatus = async (id: string | number, status: EnquiryStatus, quote?: number) => {
    setEnquiries((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status, ...(quote ? { quotedPrice: quote } : {}) } : item
      )
    );
    await ownerApi.updateEnquiryStatus(id, status, quote);
    toast.success(`Enquiry updated to ${status}`);
  };

  const handleSendQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteEnquiry) return;
    await handleUpdateStatus(quoteEnquiry.id, 'QUOTED', quoteAmount);
    setQuoteEnquiry(null);
  };

  const getStatusBadge = (status: EnquiryStatus) => {
    switch (status) {
      case 'NEW':
        return <Badge variant="warning">New Request</Badge>;
      case 'QUOTED':
        return <Badge variant="info">Quote Sent</Badge>;
      case 'IN_PROGRESS':
        return <Badge variant="plum">Baking In Progress</Badge>;
      case 'FULFILLED':
        return <Badge variant="success">Completed</Badge>;
      case 'DECLINED':
        return <Badge variant="error">Declined</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  if (loading) return <LoadingState message="Loading custom cake enquiries..." />;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-owner-border shadow-soft">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif font-bold text-xl sm:text-2xl text-owner-heading">
              Custom Cake Enquiries
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-brand-blush text-brand-plum text-2xs font-bold uppercase tracking-wider">
              {enquiries.filter((e) => e.status === 'NEW').length} Pending Quotes
            </span>
          </div>
          <p className="text-xs sm:text-sm text-owner-muted mt-1">
            Review custom celebration cake briefs, preview reference designs, and send price quotes directly to customers.
          </p>
        </div>
      </div>

      {/* Enquiries Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {enquiries.map((enq) => {
          const cleanPhone = enq.customerPhone.replace(/[^0-9]/g, '');
          const waMessage = encodeURIComponent(
            `Hi ${enq.customerName}, this is Artisan Oven Bakery regarding your custom cake enquiry for ${enq.occasion} on ${enq.eventDate}. We would love to bake this for you!`
          );

          return (
            <Card key={enq.id} className="p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                {/* Header: Customer Name, Status & Date */}
                <div className="flex items-start justify-between gap-2 border-b border-owner-border pb-3">
                  <div>
                    <h3 className="font-serif font-bold text-base text-owner-heading">
                      {enq.customerName}
                    </h3>
                    <p className="text-xs text-owner-muted mt-0.5">{enq.customerPhone}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {getStatusBadge(enq.status)}
                    <span className="text-[10px] text-owner-muted flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Event: {enq.eventDate}
                    </span>
                  </div>
                </div>

                {/* Cake Specifications Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-owner-canvas p-3 rounded-xl border border-owner-border text-xs">
                  <div>
                    <span className="text-2xs uppercase tracking-wider text-owner-muted font-bold block">Occasion</span>
                    <span className="font-semibold text-owner-heading">{enq.occasion}</span>
                  </div>
                  <div>
                    <span className="text-2xs uppercase tracking-wider text-owner-muted font-bold block">Flavor</span>
                    <span className="font-semibold text-owner-heading">{enq.flavor || 'Baker’s Choice'}</span>
                  </div>
                  <div>
                    <span className="text-2xs uppercase tracking-wider text-owner-muted font-bold block">Weight</span>
                    <span className="font-semibold text-owner-heading">{enq.weightKg ? `${enq.weightKg} kg` : 'Standard'}</span>
                  </div>
                  <div>
                    <span className="text-2xs uppercase tracking-wider text-owner-muted font-bold block">Budget</span>
                    <span className="font-serif font-bold text-owner-heading">
                      {enq.budget ? `₹${enq.budget}` : 'Flexible'}
                    </span>
                  </div>
                  <div>
                    <span className="text-2xs uppercase tracking-wider text-owner-muted font-bold block">Quoted Price</span>
                    <span className="font-serif font-bold text-emerald-700">
                      {enq.quotedPrice ? `₹${enq.quotedPrice}` : 'Pending'}
                    </span>
                  </div>
                </div>

                {/* Customer Notes */}
                {enq.notes && (
                  <div className="bg-amber-50/60 border border-amber-100 p-3 rounded-xl text-xs text-amber-900/90 leading-relaxed">
                    <strong className="font-bold block mb-0.5">Design Requirements:</strong>
                    {enq.notes}
                  </div>
                )}

                {/* Reference Image Thumbnail */}
                {enq.referenceImageUrl && (
                  <div className="flex items-center gap-3 pt-1">
                    <div
                      onClick={() => setPreviewImage(enq.referenceImageUrl || null)}
                      className="relative w-16 h-16 rounded-xl overflow-hidden border border-owner-border cursor-pointer group shrink-0"
                    >
                      <Image
                        src={enq.referenceImageUrl}
                        alt="Reference design"
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                        <Eye className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-xs text-owner-muted">
                      <span className="font-semibold text-owner-heading block">Reference Photo Uploaded</span>
                      Click thumbnail to inspect full design
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons Toolbar */}
              <div className="pt-4 border-t border-owner-border flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <a
                    href={`https://wa.me/${cleanPhone}?text=${waMessage}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-semibold transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    WhatsApp
                  </a>
                  <a
                    href={`tel:${enq.customerPhone}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-owner-canvas text-owner-heading hover:bg-white border border-owner-border text-xs font-medium transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    Call
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  {enq.status === 'NEW' && (
                    <Button size="sm" onClick={() => setQuoteEnquiry(enq)}>
                      Submit Quote
                    </Button>
                  )}
                  {enq.status === 'QUOTED' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUpdateStatus(enq.id, 'IN_PROGRESS')}
                    >
                      Start Baking
                    </Button>
                  )}
                  {enq.status === 'IN_PROGRESS' && (
                    <Button
                      size="sm"
                      onClick={() => handleUpdateStatus(enq.id, 'FULFILLED')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                      Mark Fulfilled
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Reference Image Modal */}
      {previewImage && (
        <Modal isOpen={!!previewImage} onClose={() => setPreviewImage(null)} title="Reference Cake Design">
          <div className="relative w-full h-80 rounded-2xl overflow-hidden bg-black/5">
            <Image src={previewImage} alt="Enquiry reference" fill className="object-contain" />
          </div>
        </Modal>
      )}

      {/* Quote Submission Modal */}
      {quoteEnquiry && (
        <Modal
          isOpen={!!quoteEnquiry}
          onClose={() => setQuoteEnquiry(null)}
          title={`Quote Custom Cake for ${quoteEnquiry.customerName}`}
        >
          <form onSubmit={handleSendQuote} className="space-y-4">
            <p className="text-xs text-owner-muted">
              Occasion: <strong className="text-owner-heading">{quoteEnquiry.occasion}</strong> | Event Date:{' '}
              <strong className="text-owner-heading">{quoteEnquiry.eventDate}</strong>
            </p>

            <Input
              label="Quotation Price (₹)"
              type="number"
              min={100}
              value={quoteAmount}
              onChange={(e) => setQuoteAmount(Number(e.target.value))}
              required
            />

            <div className="pt-3 flex items-center justify-end gap-2 border-t border-owner-border">
              <Button type="button" variant="ghost" onClick={() => setQuoteEnquiry(null)}>
                Cancel
              </Button>
              <Button type="submit">Submit & Send Quote</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
