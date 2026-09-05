"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { 
  Star, 
  Search, 
  RefreshCw, 
  MessageSquare, 
  Trash2, 
  Send, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  X,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { getOwnerFeedback, replyToFeedback, deleteFeedback, FeedbackRecord } from '@/lib/api/feedback';
import { RatingStars } from '@/components/ui/RatingStars';

export default function OwnerReviewsPage() {
  const [reviews, setReviews] = useState<FeedbackRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [ratingFilter, setRatingFilter] = useState<number | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Reply Modal State
  const [selectedReview, setSelectedReview] = useState<FeedbackRecord | null>(null);
  const [replyText, setReplyText] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);
  const [replySuccess, setReplySuccess] = useState<string | null>(null);
  const [replyError, setReplyError] = useState<string | null>(null);

  // Delete Dialog State
  const [reviewToDelete, setReviewToDelete] = useState<FeedbackRecord | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchReviews = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const data = await getOwnerFeedback();
      setReviews(data || []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load reviews';
      setError(msg);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Filtered reviews
  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      const matchesRating = ratingFilter === 'ALL' || r.rating === ratingFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        (r.customerDisplayName && r.customerDisplayName.toLowerCase().includes(q)) ||
        (r.comment && r.comment.toLowerCase().includes(q)) ||
        (r.orderReference && r.orderReference.toLowerCase().includes(q));
      return matchesRating && matchesSearch;
    });
  }, [reviews, ratingFilter, searchQuery]);

  // Derived KPIs
  const totalReviewsCount = reviews.length;
  const avgRating = totalReviewsCount > 0
    ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / totalReviewsCount).toFixed(1)
    : '0.0';
  const fiveStarCount = reviews.filter(r => r.rating === 5).length;
  const respondedCount = reviews.filter(r => !!r.ownerReply).length;

  const handleOpenReplyModal = (review: FeedbackRecord) => {
    setSelectedReview(review);
    setReplyText(review.ownerReply || '');
    setReplySuccess(null);
    setReplyError(null);
  };

  const handleCloseReplyModal = () => {
    setSelectedReview(null);
    setReplySuccess(null);
    setReplyError(null);
  };

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReview || !replyText.trim()) return;

    setSubmittingReply(true);
    setReplyError(null);
    setReplySuccess(null);

    try {
      const updated = await replyToFeedback(selectedReview.id, replyText);
      setReviews((prev) =>
        prev.map((r) => (r.id === updated.id ? updated : r))
      );
      setSelectedReview(updated);
      setReplySuccess('Official bakery reply published successfully!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to post reply';
      setReplyError(msg);
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!reviewToDelete) return;

    setDeleting(true);
    try {
      await deleteFeedback(reviewToDelete.id);
      setReviews((prev) => prev.filter((r) => r.id !== reviewToDelete.id));
      setReviewToDelete(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete review';
      alert(msg);
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (isoStr?: string) => {
    if (!isoStr) return '—';
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="space-y-6">

      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-7 rounded-2xl border border-gray-200/80 shadow-2xs">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 tracking-tight">
            Reviews & Feedback
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            View customer feedback, ratings, and submit official bakery responses.
          </p>
        </div>

        <button
          onClick={() => fetchReviews(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200/80 text-gray-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer self-start sm:self-auto disabled:opacity-60"
        >
          <RefreshCw size={14} className={refreshing ? 'animate-spin text-[#A35742]' : ''} />
          <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
        </button>
      </div>

      {/* 2. Four KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-2xs">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Average Rating</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Star size={16} className="fill-amber-500 text-amber-500" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
              <span>{avgRating}</span>
              <span className="text-xs text-amber-500">★</span>
            </div>
            <p className="text-3xs text-gray-400 mt-1 font-medium">Across all reviews</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-2xs">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Total Reviews</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <MessageSquare size={16} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">{totalReviewsCount}</div>
            <p className="text-3xs text-gray-400 mt-1 font-medium">Published feedbacks</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-2xs">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">5-Star Ratings</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">{fiveStarCount}</div>
            <p className="text-3xs text-gray-400 mt-1 font-medium">Top satisfaction score</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-2xs">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Responded</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Send size={16} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">{respondedCount}</div>
            <p className="text-3xs text-gray-400 mt-1 font-medium">Bakery replies sent</p>
          </div>
        </div>

      </div>

      {/* 3. Search & Rating Filters */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search reviews by customer, comment, or order..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-50 border border-gray-200/80 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#A35742] focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <span className="text-3xs font-bold text-gray-400 uppercase tracking-wider shrink-0 mr-1">
            Filter:
          </span>
          {(['ALL', 5, 4, 3, 2, 1] as const).map((star) => (
            <button
              key={star.toString()}
              onClick={() => setRatingFilter(star)}
              className={`px-3 py-1 rounded-lg text-3xs font-bold shrink-0 transition-colors cursor-pointer ${
                ratingFilter === star
                  ? 'bg-[#A35742] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {star === 'ALL' ? 'All Stars' : `${star} ★`}
            </button>
          ))}
        </div>

      </div>

      {/* 4. Reviews Feed */}
      <div className="space-y-4">
        
        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-200/80 py-24 flex flex-col items-center justify-center space-y-3 shadow-2xs">
            <div className="w-8 h-8 border-3 border-[#C56E56] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Loading customer reviews...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl border border-gray-200/80 p-8 text-center space-y-3 shadow-2xs">
            <AlertCircle size={32} className="mx-auto text-rose-500" />
            <p className="text-sm font-bold text-gray-900">Failed to load reviews</p>
            <p className="text-xs text-gray-500">{error}</p>
            <button
              onClick={() => fetchReviews()}
              className="px-4 py-2 rounded-xl bg-[#3D101E] text-white text-xs font-bold hover:bg-[#5B1C2E] transition-colors cursor-pointer"
            >
              Retry Connection
            </button>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200/80 py-20 text-center space-y-3 px-4 shadow-2xs">
            <Star size={36} className="mx-auto text-gray-300" />
            <h3 className="text-base font-bold text-gray-800">No customer reviews yet</h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              {searchQuery || ratingFilter !== 'ALL'
                ? "No reviews match your selected filter criteria."
                : "Customer reviews and ratings submitted after order completion will appear here."
              }
            </p>
          </div>
        ) : (
          filteredReviews.map((review) => {
            const initials = (review.customerDisplayName || 'C').slice(0, 2).toUpperCase();

            return (
              <div 
                key={review.id}
                className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-2xs space-y-3 hover:border-gray-300 transition-colors"
              >
                {/* Review Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#FAF0F2] text-[#5B1C2E] border border-[#5B1C2E]/20 flex items-center justify-center font-bold text-xs shadow-2xs">
                      {initials}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-gray-900">
                          {review.customerDisplayName || 'Verified Buyer'}
                        </span>
                        {review.orderReference && (
                          <span className="text-3xs font-mono font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                            {review.orderReference}
                          </span>
                        )}
                      </div>
                      <p className="text-3xs text-gray-400 mt-0.5">Reviewed on {formatDate(review.createdAt)}</p>
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div className="shrink-0">
                    <RatingStars rating={review.rating} showCount={false} size={16} />
                  </div>
                </div>

                {/* Comment Body */}
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed pl-1">
                  {review.comment || 'No written commentary provided.'}
                </p>

                {/* Owner Reply (if present) */}
                {review.ownerReply && (
                  <div className="mt-3 p-4 rounded-xl bg-[#FAF7F2] border border-[#EFE8EB] text-xs space-y-1">
                    <div className="flex items-center gap-1.5 text-[#A35742] font-bold text-3xs uppercase tracking-wider">
                      <Sparkles size={12} />
                      <span>Official Bakery Response</span>
                    </div>
                    <p className="text-gray-800 leading-relaxed">{review.ownerReply}</p>
                  </div>
                )}

                {/* Actions Footer */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => setReviewToDelete(review)}
                    className="p-2 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Delete review"
                  >
                    <Trash2 size={15} />
                  </button>
                  <button
                    onClick={() => handleOpenReplyModal(review)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#3D101E] hover:bg-[#5B1C2E] text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                  >
                    <Send size={12} />
                    <span>{review.ownerReply ? 'Edit Response' : 'Reply to Review'}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}

      </div>

      {/* 5. Reply Modal */}
      {selectedReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-gray-200 shadow-2xl p-6 sm:p-8 space-y-5 relative my-8">
            
            <div className="flex items-start justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-serif font-bold text-gray-900">
                  Reply to {selectedReview.customerDisplayName}
                </h3>
                <p className="text-3xs text-gray-400">Published review response</p>
              </div>
              <button 
                onClick={handleCloseReplyModal}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Customer Review Quote */}
            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-700 space-y-1">
              <div className="flex items-center justify-between text-3xs text-gray-400 font-semibold">
                <span>Customer Feedback</span>
                <RatingStars rating={selectedReview.rating} showCount={false} size={12} />
              </div>
              <p className="italic leading-relaxed">&ldquo;{selectedReview.comment}&rdquo;</p>
            </div>

            <form onSubmit={handleSubmitReply} className="space-y-4 pt-1">
              {replySuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  <span>{replySuccess}</span>
                </div>
              )}

              {replyError && (
                <div className="p-3 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 text-xs flex items-center gap-2">
                  <AlertCircle size={16} />
                  <span>{replyError}</span>
                </div>
              )}

              <div>
                <label className="text-3xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
                  Your Public Bakery Response
                </label>
                <textarea
                  rows={4}
                  required
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Thank the customer, address feedback, or invite them back for their next celebration..."
                  className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#A35742] focus:bg-white transition-all"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseReplyModal}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReply}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#3D101E] hover:bg-[#5B1C2E] text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer disabled:opacity-60"
                >
                  <Send size={13} />
                  <span>{submittingReply ? 'Publishing...' : 'Publish Response'}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* 6. Delete Confirmation Dialog */}
      {reviewToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full border border-gray-200 shadow-2xl p-6 space-y-4 relative">
            <h3 className="text-base font-bold text-gray-900">Delete Review?</h3>
            <p className="text-xs text-gray-500">
              Are you sure you want to remove this feedback from {reviewToDelete.customerDisplayName}? This action will hide the review from your bakery storefront.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setReviewToDelete(null)}
                className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors cursor-pointer disabled:opacity-60"
              >
                {deleting ? 'Removing...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
