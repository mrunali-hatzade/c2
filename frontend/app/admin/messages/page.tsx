"use client";

import React, { useState } from 'react';
import { 
  Bell, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Users, 
  Mail, 
  Sparkles 
} from 'lucide-react';
import { sendAdminMessage } from '@/lib/api/admin';

export default function AdminMessagesPage() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [sendEmail, setSendEmail] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    setSubmitting(true);
    setSuccessNotice(null);
    setErrorNotice(null);

    try {
      const res = await sendAdminMessage({
        title: title.trim(),
        message: message.trim(),
        sendEmail,
      });
      setSuccessNotice(typeof res === 'string' ? res : 'Broadcast dispatched successfully to all bakery owners!');
      setTitle('');
      setMessage('');
      setSendEmail(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send broadcast';
      setErrorNotice(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">

      {/* 1. Header Banner */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Merchant Broadcasts & Notifications
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          Dispatch critical platform updates, holiday schedules, and service advisories to bakery merchants.
        </p>
      </div>

      {successNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 size={16} className="shrink-0" />
          <span>{successNotice}</span>
        </div>
      )}

      {errorNotice && (
        <div className="p-4 rounded-2xl bg-rose-50 text-rose-800 border border-rose-200 text-xs font-semibold flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" />
          <span>{errorNotice}</span>
        </div>
      )}

      {/* 2. Broadcast Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-2xs space-y-5 text-xs">
        
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 text-slate-500">
          <Users size={16} className="text-indigo-600" />
          <span className="font-bold text-slate-900">Audience: All Verified Bakery Owners</span>
        </div>

        <div>
          <label className="text-3xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Announcement Title *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Upcoming Platform Maintenance & New Custom Cake Features"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all font-semibold"
          />
        </div>

        <div>
          <label className="text-3xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Message Content *
          </label>
          <textarea
            rows={5}
            required
            placeholder="Detailed instructions or platform notice..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all leading-relaxed"
          ></textarea>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="sendEmail"
            checked={sendEmail}
            onChange={(e) => setSendEmail(e.target.checked)}
            className="rounded text-indigo-600 focus:ring-indigo-600"
          />
          <label htmlFor="sendEmail" className="text-xs font-medium text-slate-700 cursor-pointer flex items-center gap-1.5">
            <Mail size={13} className="text-slate-400" />
            <span>Also dispatch email notification to merchant primary inbox</span>
          </label>
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-100">
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer disabled:opacity-60"
          >
            <Send size={14} />
            <span>{submitting ? 'Dispatching Broadcast...' : 'Publish Announcement'}</span>
          </button>
        </div>

      </form>

    </div>
  );
}
