'use client';

import React, { useState } from 'react';
import { AlertTriangle, Trash2, X, Lock, ShieldAlert } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ownerApi } from '@/lib/api/owner';
import { useAuth } from '@/lib/auth/AuthContext';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  shopName?: string;
}

export default function DeleteAccountModal({ isOpen, onClose, shopName }: DeleteAccountModalProps) {
  const { logout } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmationText, setConfirmationText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const REQUIRED_PHRASE = 'DELETE MY ACCOUNT';
  const isPhraseMatched = confirmationText.trim() === REQUIRED_PHRASE;
  const canSubmit = isPhraseMatched && password.length > 0 && !isDeleting;

  const handleClose = () => {
    if (isDeleting) return;
    setPassword('');
    setConfirmationText('');
    setErrorMsg(null);
    onClose();
  };

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setIsDeleting(true);
    setErrorMsg(null);

    try {
      await ownerApi.deleteAccount({
        password,
        confirmationText: confirmationText.trim(),
      });

      // Clear authentication state and tokens
      logout();
      if (typeof window !== 'undefined') {
        localStorage.removeItem('cakestore_user');
        window.location.href = '/login?deleted=true';
      }
    } catch (err: any) {
      const message =
        err?.response?.data?.error ||
        err?.message ||
        'Failed to delete account. Please verify your password and ensure there are no active customer orders.';
      setErrorMsg(message);
      setIsDeleting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Delete CakeStore Account"
      maxWidth="md"
    >
      <form onSubmit={handleDelete} className="space-y-5">
        {/* Warning Banner */}
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 space-y-2">
          <div className="flex items-center gap-2 text-red-700 font-bold text-sm">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>Permanent Deletion Warning</span>
          </div>
          <p className="text-xs text-red-800 leading-relaxed">
            This action is <strong>permanent and irreversible</strong>. Proceeding will completely erase your account and bakery data from CakeStore.
          </p>
        </div>

        {/* Consequence Bullet Points */}
        <div className="p-4 rounded-2xl bg-owner-canvas/60 border border-owner-border text-xs text-owner-muted space-y-2">
          <p className="font-semibold text-owner-heading">What will happen when you confirm:</p>
          <ul className="list-disc list-inside space-y-1 pl-1">
            <li>Your bakery <strong>{shopName ? `(${shopName})` : ''}</strong> and live storefront will be removed.</li>
            <li>All catalog cakes, pricing, custom categories, and variants will be deleted.</li>
            <li>Bakery coupons, delivery slots, documents, and enquiries will be deleted.</li>
            <li>You will be immediately logged out and unable to access this account.</li>
            <li className="text-emerald-700 font-medium">
              Note: Global customer accounts of buyers who ordered from you remain safe and untouched.
            </li>
          </ul>
        </div>

        {/* Error Banner */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-100/90 border border-red-300 text-red-900 text-xs flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <p className="leading-snug">{errorMsg}</p>
          </div>
        )}

        {/* Password Re-authentication */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-owner-heading">
            Account Password <span className="text-red-500">*</span>
          </label>
          <Input
            type="password"
            placeholder="Enter your current password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isDeleting}
            required
          />
        </div>

        {/* Confirmation Phrase */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-owner-heading">
            To confirm, type <span className="font-mono text-red-600 font-bold select-all">{REQUIRED_PHRASE}</span> below:
          </label>
          <Input
            type="text"
            placeholder="Type DELETE MY ACCOUNT"
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
            disabled={isDeleting}
            required
            className="font-mono"
          />
        </div>

        {/* Actions */}
        <div className="pt-2 flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={handleClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white font-bold"
            disabled={!canSubmit}
            isLoading={isDeleting}
          >
            <Trash2 className="w-4 h-4 mr-1.5" />
            Permanently Delete Account
          </Button>
        </div>
      </form>
    </Modal>
  );
}
