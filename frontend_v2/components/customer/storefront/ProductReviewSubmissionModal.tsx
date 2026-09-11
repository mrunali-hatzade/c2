'use client';

import React, { useState } from 'react';
import { Star, Send, ShieldCheck, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { reviewsApi } from '@/lib/api/reviews';
import { useToast } from '@/components/common/Toast';

interface ProductReviewSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  shopId: number | string;
  productId: number | string;
  productName: string;
  orderNumber: string;
  customerPhone?: string;
  orderItemId: number;
  onSuccess?: () => void;
}

export const ProductReviewSubmissionModal: React.FC<ProductReviewSubmissionModalProps> = ({
  isOpen,
  onClose,
  shopId,
  productId,
  productName,
  orderNumber,
  customerPhone = '',
  orderItemId,
  onSuccess,
}) => {
  const toast = useToast();
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [reviewText, setReviewText] = useState<string>('');
  const [phone, setPhone] = useState<string>(customerPhone);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await reviewsApi.submitProductReview(shopId, productId, {
        orderNumber,
        customerPhone: phone || customerPhone,
        orderItemId,
        rating,
        reviewText: reviewText.trim(),
      });

      setIsSuccess(true);
      toast.success('Thank you! Your verified review has been published.');
      if (onSuccess) onSuccess();
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1800);
    } catch (err: any) {
      setError(err.message || 'Failed to submit review. Please verify your order phone number.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      title="Review Your Celebration Cake"
      description={`Share your feedback for ${productName} on Order #${orderNumber}`}
    >
      {isSuccess ? (
        <div className="py-8 text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-serif font-bold text-brand-espresso">Review Published!</h3>
          <p className="text-xs text-brand-muted">
            Your verified review is now live on the bakery storefront.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5 pt-1">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Star Rating Selector */}
          <div className="space-y-1.5 text-center py-2 bg-brand-cream-light/60 rounded-2xl border border-brand-border/60">
            <label className="text-xs font-bold text-brand-espresso uppercase tracking-wider block">
              Rate this Cake
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
                    className={`w-7 h-7 ${
                      star <= (hoverRating ?? rating)
                        ? 'text-amber-500 fill-amber-500'
                        : 'text-brand-border fill-transparent'
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-xs font-semibold text-brand-plum">
              {rating === 5 && '🌟 Exceptional! (5/5)'}
              {rating === 4 && '✨ Delicious! (4/5)'}
              {rating === 3 && '👍 Good (3/5)'}
              {rating === 2 && '😐 Average (2/5)'}
              {rating === 1 && '👎 Unsatisfactory (1/5)'}
            </span>
          </div>

          {/* Review Text */}
          <Textarea
            label="Your Review & Experience (Optional)"
            rows={4}
            placeholder="Tell us about the flavor, freshness, decoration, and delivery experience..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          />

          {/* Verification Phone Number */}
          <div className="space-y-1">
            <Input
              label="Order Phone Number (for Purchase Verification)"
              required
              placeholder="e.g. 9823100000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <div className="flex items-center gap-1.5 text-[11px] text-brand-muted">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Only verified customers who received this order can submit reviews.</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-brand-border/60 flex items-center justify-end gap-2.5">
            <Button type="button" variant="ghost" size="sm" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={isSubmitting} className="font-bold shadow-sm">
              <Send className="w-3.5 h-3.5 mr-1.5" />
              <span>{isSubmitting ? 'Submitting...' : 'Submit Verified Review'}</span>
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
