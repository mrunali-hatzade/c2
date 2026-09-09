'use client';
/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import {
  Globe, Image as ImageIcon, ExternalLink, Save, RefreshCw,
  CheckCircle2, AlertCircle, Sparkles, Eye, Store, Upload, Link as LinkIcon,
  ShieldCheck, MapPin
} from 'lucide-react';
import { ownerApi } from '@/lib/api/owner';
import { mediaApi } from '@/lib/api/media';
import { ShopSettings } from '@/types/owner';
import { useOwner } from '@/context/OwnerContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { LoadingState } from '@/components/ui/LoadingState';

const PRESET_COVERS = [
  { label: 'Warm Artisan Oven', url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Pastry Boutique', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Dessert Studio', url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Rustic Home Bakes', url: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&w=1200&q=80' },
];

export default function OwnerWebsitePage() {
  const [profile, setProfile] = useState<ShopSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Editable branding fields
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [description, setDescription] = useState('');
  const [businessName, setBusinessName] = useState('');

  // Uploading state
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const fetchProfile = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setIsLoading(true);
    setErrorMsg(null);

    try {
      const data = await ownerApi.getShopSettings();
      setProfile(data);
      setCoverImageUrl(data.coverImageUrl || PRESET_COVERS[0].url);
      setLogoUrl(data.logoUrl || '');
      setDescription(data.description || '');
      setBusinessName(data.businessName || '');
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to load storefront profile');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert('Cover image must be under 5MB'); return; }
    setIsUploadingCover(true);
    try {
      const result = await mediaApi.uploadImage(file, 'covers');
      setCoverImageUrl(result.url);
    } catch {
      setCoverImageUrl(URL.createObjectURL(file));
    } finally {
      setIsUploadingCover(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) { alert('Logo image must be under 3MB'); return; }
    setIsUploadingLogo(true);
    try {
      const result = await mediaApi.uploadImage(file, 'logos');
      setLogoUrl(result.url);
    } catch {
      setLogoUrl(URL.createObjectURL(file));
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleSaveStorefront = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const updated = await ownerApi.updateShopSettings({
        businessName,
        coverImageUrl,
        logoUrl,
        description,
      });
      setProfile(updated);
      setSuccessMsg('Public storefront branding updated and published successfully!');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to update storefront');
    } finally {
      setIsSaving(false);
    }
  };

  const { shop } = useOwner();

  if (isLoading) return <LoadingState message="Loading storefront branding assets..." />;

  const liveStoreUrl = shop?.id ? `/shop/${shop.id}` : undefined;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-owner-border shadow-soft">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-blush text-brand-plum text-[11px] font-semibold">
            <Sparkles className="w-3 h-3" />
            <span>Digital Storefront Builder</span>
          </div>
          <h1 className="text-2xl font-bold font-serif text-owner-heading tracking-tight">
            Storefront & Public Branding
          </h1>
          <p className="text-xs text-owner-muted">
            Customize your public bakery website banner, brand avatar, and bio shown across the CakeStore marketplace
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => fetchProfile(true)}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-owner-canvas hover:bg-brand-cream border border-owner-border text-xs font-semibold text-owner-heading transition-all disabled:opacity-60 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-brand-plum ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Syncing...' : 'Refresh'}</span>
          </button>

          {liveStoreUrl ? (
            <Link
              href={liveStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-plum hover:bg-brand-plum-hover text-white text-xs font-bold shadow-soft transition-all"
            >
              <Store className="w-3.5 h-3.5" />
              <span>View Live Store</span>
              <ExternalLink className="w-3 h-3 opacity-80" />
            </Link>
          ) : (
            <button
              disabled
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-300 text-gray-500 text-xs font-bold shadow-soft cursor-not-allowed"
            >
              <Store className="w-3.5 h-3.5" />
              <span>View Live Store</span>
            </button>
          )}
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-7 space-y-5">
          <form onSubmit={handleSaveStorefront} className="space-y-5">
            <Card className="p-6 space-y-5">
              <h2 className="font-serif font-bold text-base text-owner-heading">Bakery Profile</h2>

              <Input
                label="Bakery Display Name"
                required
                placeholder="e.g. Akurdi Artisan Bakes"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
              />

              <Textarea
                label="Artisan Story & Bio"
                rows={4}
                placeholder="Tell customers what makes your cakes unforgettable (e.g. 100% Belgian chocolate, baked fresh daily with organic ingredients)..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Card>

            {/* Banner Cover Image */}
            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif font-bold text-base text-owner-heading">Cover Banner Photo</h2>
                  <p className="text-[11px] text-owner-muted">Recommended aspect ratio 16:9 or panoramic (1200x500px)</p>
                </div>
                <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => coverInputRef.current?.click()}
                  isLoading={isUploadingCover}
                  className="gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Upload Photo
                </Button>
              </div>

              <Input
                placeholder="https://images.unsplash.com/..."
                value={coverImageUrl}
                onChange={(e) => setCoverImageUrl(e.target.value)}
              />

              {/* Preset cover options */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-owner-muted">Or choose a dessert aesthetic banner:</span>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_COVERS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setCoverImageUrl(preset.url)}
                      className={`px-3 py-1 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                        coverImageUrl === preset.url
                          ? 'border-brand-plum bg-brand-blush text-brand-plum font-bold'
                          : 'border-owner-border hover:bg-owner-canvas text-owner-muted'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </Card>

            {/* Brand Logo Avatar */}
            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif font-bold text-base text-owner-heading">Brand Logo / Avatar</h2>
                  <p className="text-[11px] text-owner-muted">Square circular logo or headshot avatar (400x400px)</p>
                </div>
                <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => logoInputRef.current?.click()}
                  isLoading={isUploadingLogo}
                  className="gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Upload Logo
                </Button>
              </div>

              <Input
                placeholder="https://images.unsplash.com/... or paste logo URL"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
              />
            </Card>

            <Button type="submit" isLoading={isSaving} className="w-full" size="lg">
              <Save className="w-4 h-4 mr-2" />
              Save & Publish Storefront Changes
            </Button>
          </form>
        </div>

        {/* Right Column: Live Marketplace Preview Card */}
        <div className="lg:col-span-5 space-y-4 sticky top-6">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-owner-muted flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-brand-plum" />
              Live Marketplace Card Preview
            </span>
            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
              Real-time Preview
            </span>
          </div>

          {/* Render BakeryCard Mirror in Design 2 */}
          <div className="group bg-white rounded-3xl overflow-hidden border border-brand-border shadow-card transition-all">
            {/* Cover image container */}
            <div className="relative h-44 w-full overflow-hidden bg-brand-cream-light">
              <img
                src={coverImageUrl || PRESET_COVERS[0].url}
                alt="Storefront Banner Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

              {/* Status and Veg Badges */}
              <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide shadow-sm bg-brand-cream/95 text-brand-plum backdrop-blur-md border border-brand-border">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Verified Baker
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/90 text-emerald-800 backdrop-blur-md shadow-sm border border-emerald-200">
                  ?? 100% Pure Veg Available
                </span>
              </div>

              {/* Brand Logo Avatar */}
              <div className="absolute -bottom-4 left-4">
                <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white shadow-md bg-white flex items-center justify-center">
                  {logoUrl ? (
                    <img src={logoUrl} alt="Logo preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-brand-blush flex items-center justify-center text-brand-plum font-serif font-bold text-lg">
                      {businessName ? businessName.charAt(0).toUpperCase() : 'B'}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Card Body */}
            <div className="pt-7 p-5 space-y-3">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-serif text-lg font-bold text-brand-espresso truncate">
                    {businessName || 'Your Bakery Name'}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                    ? 4.9 (New)
                  </span>
                </div>
                <p className="text-xs text-brand-muted mt-0.5 capitalize">
                  {shop?.businessType ? shop.businessType.replace(/_/g, ' ').toLowerCase() : 'Custom Cake Studio'}
                </p>
              </div>

              <p className="text-xs text-brand-muted line-clamp-2 leading-relaxed">
                {description || 'Handcrafted customized designer cakes, gourmet desserts and celebration bakes made fresh with love in Pune.'}
              </p>

              <div className="pt-2 border-t border-brand-border/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-brand-muted text-[11px]">
                  <MapPin className="w-3.5 h-3.5 text-brand-plum shrink-0" />
                  <span>{profile?.city || 'Pune, Maharashtra'}</span>
                </div>
                <span className="font-bold text-brand-plum group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                  Visit Storefront &rarr;
                </span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-brand-blush/60 border border-brand-blush-border text-[11px] text-brand-plum space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Storefront Tip
            </p>
            <p className="text-brand-muted leading-relaxed">
              Bakeries with a high-resolution banner and clear artisan story receive 3x more custom cake inquiries on the CakeStore marketplace.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
