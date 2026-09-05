'use client';

import React, { useEffect, useState } from 'react';
import { Star, MessageSquare, Reply, CheckCircle2 } from 'lucide-react';
import { ownerApi } from '@/lib/api/owner';
import { BakeryReview } from '@/types/owner';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Textarea } from '@/components/ui/Textarea';
import { LoadingState } from '@/components/ui/LoadingState';
import { useToast } from '@/components/common/Toast';

export default function OwnerReviewsPage() {
  const [reviews, setReviews] = useState<BakeryReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyingId, setReplyingId] = useState<string | number | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  useEffect(() => {
    ownerApi.getReviews().then((data) => {
      setReviews(data);
      setLoading(false);
    });
  }, []);

  const handleSendReply = async (id: string | number) => {
    if (!replyText.trim()) return;
    setIsSubmitting(true);
    try {
      await ownerApi.replyToReview(id, replyText);
      setReviews((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, reply: replyText, replyDate: new Date().toISOString().split('T')[0] } : r
        )
      );
      toast.success('Reply published successfully!');
      setReplyingId(null);
      setReplyText('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : '5.0';

  if (loading) return <LoadingState message="Loading customer reviews & ratings..." />;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-owner-border shadow-soft">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif font-bold text-xl sm:text-2xl text-owner-heading">Customer Reviews</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-2xs font-bold uppercase tracking-wider border border-amber-200">
              Verified Orders
            </span>
          </div>
          <p className="text-xs sm:text-sm text-owner-muted mt-1">
            Read celebration feedback from patrons and reply directly to customer reviews.
          </p>
        </div>

        {/* Rating Summary Box */}
        <div className="flex items-center gap-3 bg-amber-50/60 border border-amber-200/80 px-4 py-2.5 rounded-2xl">
          <div className="text-2xl font-serif font-bold text-amber-900 leading-none">{avgRating}</div>
          <div>
            <div className="flex items-center gap-0.5 text-amber-500">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-2xs text-amber-800 font-medium mt-0.5">{reviews.length} Customer Reviews</p>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((rev) => (
          <Card key={rev.id} className="p-6 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-brand-blush text-brand-plum font-bold flex items-center justify-center text-sm">
                  {rev.customerName[0]}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-owner-heading">{rev.customerName}</h4>
                  <div className="flex items-center gap-2 text-2xs text-owner-muted mt-0.5">
                    <span>{rev.createdAt}</span>
                    {rev.cakeName && <span>• {rev.cakeName}</span>}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= rev.rating
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-gray-200 fill-gray-100'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Review Comment */}
            <p className="text-xs sm:text-sm text-owner-heading/90 leading-relaxed italic bg-owner-canvas/40 p-3 rounded-xl border border-owner-border/60">
              &quot;{rev.comment}&quot;
            </p>

            {/* Existing Owner Reply */}
            {rev.reply && (
              <div className="pl-4 border-l-2 border-brand-plum space-y-1 bg-brand-blush/30 p-3 rounded-r-xl">
                <div className="flex items-center justify-between text-2xs text-brand-plum font-bold">
                  <span>Bakery Owner Response</span>
                  <span className="text-owner-muted font-normal">{rev.replyDate || 'Recently'}</span>
                </div>
                <p className="text-xs text-owner-heading">{rev.reply}</p>
              </div>
            )}

            {/* Reply Composer Form */}
            {!rev.reply && (
              <div>
                {replyingId === rev.id ? (
                  <div className="space-y-3 pt-2">
                    <Textarea
                      placeholder="Write a sweet thank you note or reply to this review..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows={3}
                    />
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setReplyingId(null);
                          setReplyText('');
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        disabled={isSubmitting || !replyText.trim()}
                        onClick={() => handleSendReply(rev.id)}
                      >
                        Post Response
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setReplyingId(rev.id);
                      setReplyText('');
                    }}
                    className="text-xs"
                  >
                    <Reply className="w-3.5 h-3.5 mr-1 text-brand-plum" />
                    Reply to Review
                  </Button>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
