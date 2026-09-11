'use client';

import React, { useState } from 'react';
import { Star, Send, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { storefrontApi } from '@/lib/api/storefront';
import { useToast } from '@/components/common/Toast';

interface CakeReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  shopId: number | string;
  productId: number | string;
  productName: string;
  shopName: string;
  onReviewSubmitted?: (newReview: {
    id: number;
    customerDisplayName: string;
    rating: number;
    reviewText: string;
    createdAt: string;
    isVerifiedPurchase?: boolean;
  }) => void;
}

export const CakeReviewModal: React.FC<CakeReviewModalProps> = ({
  isOpen,
  onClose,
  shopId,
  productId,
  productName,
  shopName,
  onReviewSubmitted,
}) => {
  const toast = useToast();
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [customerName, setCustomerName] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [orderReference, setOrderReference] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError('Please share a few words about your experience with this cake.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await storefrontApi.submitFeedback(shopId, {
        customerDisplayName: customerName.trim() || 'Valued Customer',
        rating,
        comment: `[${productName}] ${comment.trim()}`,
        orderReference: orderReference.trim() || undefined,
      });

      const newReview = {
        id: Date.now(),
        customerDisplayName: customerName.trim() || 'Valued Customer',
        rating,
        reviewText: comment.trim(),
        createdAt: new Date().toISOString(),
        isVerifiedPurchase: Boolean(orderReference.trim()),
      };

      setIsSuccess(true);
      toast.success('Thank you! Your feedback has been shared with the baker.');
      if (onReviewSubmitted) {
        onReviewSubmitted(newReview);
      }

      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        setComment('');
        setOrderReference('');
        setCustomerName('');
      }, 1800);
    } catch (err: any) {
      setError(err.message || 'Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      title="Share Your Cake Experience"
      description={`Leave a review for ${productName} by ${shopName}`}
    >
      {isSuccess ? (
        <div className="py-8 text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-serif font-bold text-brand-espresso">Thank You!</h3>
          <p className="text-xs text-brand-muted max-w-sm mx-auto">
            Your review and rating have been posted. Your feedback helps {shopName} continue creating wonderful celebration cakes!
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Star Rating Selector */}
          <div className="space-y-1.5 text-center py-3 bg-[#FAF7F2] rounded-2xl border border-brand-border/60">
            <label className="text-xs font-bold text-brand-espresso uppercase tracking-wider block">
              How was your cake experience?
            </label>
            <div className="flex items-center justify-center gap-2 pt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(null)}
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-110 transition-transform cursor-pointer"
                >
                  <Star
                    className={`w-7 h-7 transition-colors ${
                      star <= (hoverRating ?? rating)
                        ? 'text-amber-500 fill-amber-500'
                        : 'text-brand-border fill-transparent'
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-xs font-semibold text-[#5C1D2E] block pt-0.5">
              {rating === 5 && '🌟 Exceptional! (5/5 Stars)'}
              {rating === 4 && '✨ Delicious & Beautiful! (4/5 Stars)'}
              {rating === 3 && '👍 Good Taste (3/5 Stars)'}
              {rating === 2 && '😐 Average Experience (2/5 Stars)'}
              {rating === 1 && '👎 Needs Improvement (1/5 Stars)'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Your Name"
              placeholder="e.g. Priya Sharma"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
            <Input
              label="Order Number (Optional)"
              placeholder="e.g. ORD-1024 or receipt #"
              value={orderReference}
              onChange={(e) => setOrderReference(e.target.value)}
            />
          </div>

          {/* Review Comments */}
          <Textarea
            label="Your Review / Feedback"
            required
            rows={4}
            placeholder="Tell us about the flavor, sponge texture, sweetness balance, and decoration..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <div className="p-3 rounded-xl bg-brand-cream/50 border border-brand-border/60 flex items-center gap-2 text-[11px] text-brand-muted">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Reviews help artisan bakers improve and guide other customers in choosing celebration cakes.</span>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-brand-border/60 flex items-center justify-end gap-2.5">
            <Button type="button" variant="ghost" size="sm" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="font-bold shadow-sm bg-[#5C1D2E] hover:bg-[#4a1525] text-white"
            >
              <Send className="w-3.5 h-3.5 mr-1.5" />
              <span>{isSubmitting ? 'Submitting...' : 'Post Review & Feedback'}</span>
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
