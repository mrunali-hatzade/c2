'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  MessageCircle,
  Star,
  Search,
  Filter,
  Check,
  CheckCheck,
  Store,
  User,
  Calendar,
  Sparkles,
  Inbox,
  RefreshCw,
  Eye,
  ExternalLink,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { LoadingState } from '@/components/ui/LoadingState';
import { communicationApi } from '@/lib/api/communication';
import { PlatformFeedback } from '@/types/communication';

export default function AdminPlatformFeedbackPage() {
  const [feedbackList, setFeedbackList] = useState<PlatformFeedback[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'UNREAD' | 'READ'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeModalFeedback, setActiveModalFeedback] = useState<PlatformFeedback | null>(null);

  const fetchFeedback = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await communicationApi.getPlatformFeedback();
      setFeedbackList(data || []);
    } catch {
      setFeedbackList([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback]);

  const handleMarkRead = async (id: string | number) => {
    await communicationApi.markPlatformFeedbackRead(id);
    setFeedbackList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isRead: true } : item))
    );
    if (activeModalFeedback?.id === id) {
      setActiveModalFeedback((prev) => (prev ? { ...prev, isRead: true } : null));
    }
  };

  const filteredFeedback = useMemo(() => {
    return feedbackList.filter((item) => {
      if (selectedFilter === 'UNREAD' && item.isRead) return false;
      if (selectedFilter === 'READ' && !item.isRead) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesShop = item.shopName?.toLowerCase().includes(q);
        const matchesOwner = item.ownerName?.toLowerCase().includes(q) || item.ownerEmail?.toLowerCase().includes(q);
        const matchesMsg = item.message.toLowerCase().includes(q);
        const matchesCat = item.category?.toLowerCase().includes(q);
        if (!matchesShop && !matchesOwner && !matchesMsg && !matchesCat) return false;
      }
      return true;
    });
  }, [feedbackList, selectedFilter, searchQuery]);

  const unreadCount = useMemo(() => {
    return feedbackList.filter((f) => !f.isRead).length;
  }, [feedbackList]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-serif font-bold text-2xl text-slate-900">
              Platform Feedback
            </h1>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Direct feedback from verified bakery owners about the CakeStore SaaS platform and tools
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchFeedback}
          className="text-xs gap-1.5 self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </Button>
      </div>

      {/* Filter and Search Toolbar */}
      <Card className="p-4 border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSelectedFilter('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                selectedFilter === 'ALL'
                  ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              All ({feedbackList.length})
            </button>
            <button
              onClick={() => setSelectedFilter('UNREAD')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 ${
                selectedFilter === 'UNREAD'
                  ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span>Unread</span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500 text-white font-bold">
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setSelectedFilter('READ')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                selectedFilter === 'READ'
                  ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Read
            </button>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by bakery, owner, or text..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>
      </Card>

      {/* Feedback List Table / Cards */}
      {isLoading ? (
        <LoadingState message="Loading platform feedback..." />
      ) : filteredFeedback.length === 0 ? (
        <Card className="p-12 text-center border-slate-200">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Inbox className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-sm">No Feedback Submissions</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {searchQuery
              ? 'No feedback matches your current search criteria.'
              : 'When shop owners submit suggestions from their dashboard, they will appear here.'}
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredFeedback.map((f) => (
            <Card
              key={f.id}
              className={`p-5 border transition-all ${
                !f.isRead
                  ? 'border-indigo-200 bg-indigo-50/15 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {/* Star Rating Display */}
                    <div className="flex items-center text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < f.rating ? 'fill-amber-400' : 'text-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                    {f.category && (
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {f.category.replace(/_/g, ' ')}
                      </span>
                    )}
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        f.isRead
                          ? 'bg-slate-100 text-slate-500'
                          : 'bg-indigo-100 text-indigo-700'
                      }`}
                    >
                      {f.isRead ? 'Read' : 'Unread'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-800 font-medium leading-relaxed mb-3">
                    &ldquo;{f.message}&rdquo;
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 font-semibold text-slate-600">
                      <Store className="w-3.5 h-3.5 text-indigo-500" />
                      {f.shopName || `Bakery #${f.shopId || '—'}`}
                    </span>
                    {(f.ownerName || f.ownerEmail) && (
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5" />
                        {f.ownerName || f.ownerEmail}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(f.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {!f.isRead && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMarkRead(f.id)}
                      className="text-xs text-slate-600 hover:text-slate-900"
                    >
                      <Check className="w-3.5 h-3.5 mr-1" />
                      Mark Read
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setActiveModalFeedback(f);
                      if (!f.isRead) handleMarkRead(f.id);
                    }}
                    className="text-xs gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Details</span>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Details Modal */}
      {activeModalFeedback && (
        <Modal
          isOpen={!!activeModalFeedback}
          onClose={() => setActiveModalFeedback(null)}
          title="Platform Feedback Details"
        >
          <div className="space-y-4 pt-1">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <p className="text-xs font-bold text-slate-900">
                  {activeModalFeedback.shopName || `Bakery #${activeModalFeedback.shopId || '—'}`}
                </p>
                <p className="text-[11px] text-slate-400">
                  {activeModalFeedback.ownerName || activeModalFeedback.ownerEmail || 'Owner'}
                </p>
              </div>
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < activeModalFeedback.rating ? 'fill-amber-400' : 'text-slate-200'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-xs text-slate-500 font-semibold mb-1">
                Category: {activeModalFeedback.category || 'General'}
              </p>
              <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">
                {activeModalFeedback.message}
              </p>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>
                Submitted on{' '}
                {new Date(activeModalFeedback.createdAt).toLocaleString('en-IN', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveModalFeedback(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
