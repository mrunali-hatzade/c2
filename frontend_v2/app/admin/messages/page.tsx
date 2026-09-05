'use client';

import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Users,
  UserCheck,
  Mail,
  Clock,
  CheckCircle2,
  AlertCircle,
  Megaphone,
} from 'lucide-react';
import { sendAdminMessage } from '@/lib/api/admin';
import { SentBroadcastRecord } from '@/types/admin';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { useToast } from '@/components/common/Toast';

const INITIAL_BROADCASTS: SentBroadcastRecord[] = [
  {
    id: 'bcast-1',
    title: 'Platform Maintenance Notice',
    message: 'CakeStore infrastructure will undergo automated database indexing this Sunday at 2:00 AM IST for approximately 15 minutes. Storefront checkout will remain operational.',
    target: 'All Bakery Owners',
    sentAt: '2026-09-02T14:30:00Z',
    recipientCount: 18,
  },
  {
    id: 'bcast-2',
    title: 'FSSAI License Verification Mandate',
    message: 'Please ensure your valid FSSAI registration certificate is uploaded in your Store Settings to maintain active marketplace search placement.',
    target: 'All Bakery Owners',
    sentAt: '2026-08-20T10:00:00Z',
    recipientCount: 16,
  },
];

export default function AdminMessagesPage() {
  const [broadcasts, setBroadcasts] = useState<SentBroadcastRecord[]>([]);
  const [isSending, setIsSending] = useState(false);
  const toast = useToast();

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetType, setTargetType] = useState<'ALL' | 'SPECIFIC'>('ALL');
  const [specificOwnerId, setSpecificOwnerId] = useState<string>('');
  const [sendEmail, setSendEmail] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('cakestore_admin_broadcasts');
      if (saved) {
        setBroadcasts(JSON.parse(saved));
      } else {
        setBroadcasts(INITIAL_BROADCASTS);
      }
    } catch {
      setBroadcasts(INITIAL_BROADCASTS);
    }
  }, []);

  const saveBroadcasts = (newRecords: SentBroadcastRecord[]) => {
    setBroadcasts(newRecords);
    try {
      localStorage.setItem('cakestore_admin_broadcasts', JSON.stringify(newRecords));
    } catch {
      // Ignore quota error
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !message.trim()) {
      toast.error('Please complete both the title and message fields');
      return;
    }

    if (targetType === 'SPECIFIC' && !specificOwnerId) {
      toast.error('Please specify a valid Owner User ID');
      return;
    }

    setIsSending(true);
    try {
      const response = await sendAdminMessage({
        title,
        message,
        specificOwnerId: targetType === 'SPECIFIC' ? Number(specificOwnerId) : null,
        sendEmail,
      });

      const newRecord: SentBroadcastRecord = {
        id: `bcast-${Date.now()}`,
        title,
        message,
        target: targetType === 'SPECIFIC' ? `Owner User #${specificOwnerId}` : 'All Bakery Owners',
        sentAt: new Date().toISOString(),
        recipientCount: targetType === 'SPECIFIC' ? 1 : 18,
      };

      saveBroadcasts([newRecord, ...broadcasts]);
      toast.success(response || 'Broadcast sent successfully');

      // Reset form
      setTitle('');
      setMessage('');
      setSpecificOwnerId('');
    } catch (err: any) {
      toast.error(err.message || 'Failed to dispatch broadcast');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="font-serif font-bold text-2xl sm:text-3xl text-slate-900">
          System Broadcasts & Announcements
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Dispatch in-app notifications and email alerts directly to tenant bakery owners
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 1-col: Composer */}
        <div className="lg:col-span-1">
          <Card className="p-6 border-slate-200 shadow-soft space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Megaphone className="w-5 h-5 text-indigo-600" />
              <h2 className="font-serif font-bold text-base text-slate-900">
                Compose Broadcast
              </h2>
            </div>

            <form onSubmit={handleSend} className="space-y-4">
              <Input
                label="Announcement Title"
                required
                placeholder="e.g. Festival Surge Orders Preparation"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Target Audience
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTargetType('ALL')}
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                      targetType === 'ALL'
                        ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>All Owners</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTargetType('SPECIFIC')}
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                      targetType === 'SPECIFIC'
                        ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Specific Owner</span>
                  </button>
                </div>
              </div>

              {targetType === 'SPECIFIC' && (
                <Input
                  label="Owner User ID"
                  type="number"
                  required
                  placeholder="e.g. 5"
                  value={specificOwnerId}
                  onChange={(e) => setSpecificOwnerId(e.target.value)}
                  helperText="User ID of the bakery owner registered in the database."
                />
              )}

              <Textarea
                label="Broadcast Message Body"
                required
                rows={4}
                placeholder="Write your platform announcement or operational alert here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="sendEmail"
                  checked={sendEmail}
                  onChange={(e) => setSendEmail(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="sendEmail" className="text-xs font-semibold text-slate-700 cursor-pointer flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>Dispatch Email Copy to Owner Inbox</span>
                </label>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={isSending}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 border-indigo-700 gap-2"
                >
                  <Send className={`w-4 h-4 ${isSending ? 'animate-pulse' : ''}`} />
                  <span>{isSending ? 'Dispatching Broadcast...' : 'Send Broadcast'}</span>
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Right 2-col: Sent Broadcast Archive */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-base text-slate-900">
              Dispatched Broadcast Log
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              {broadcasts.length} messages dispatched
            </span>
          </div>

          <div className="space-y-3">
            {broadcasts.map((bcast) => (
              <Card key={bcast.id} className="p-5 border-slate-200/80 shadow-soft space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                      <Megaphone className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{bcast.title}</h4>
                      <p className="text-[11px] text-slate-400">
                        Target: <span className="font-medium text-slate-600">{bcast.target}</span> ({bcast.recipientCount} recipients)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" />
                      Delivered
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {new Date(bcast.sentAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                  {bcast.message}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
