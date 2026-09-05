'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Settings, Save, Store, MapPin, ShieldCheck, Clock, Image as ImageIcon, Leaf } from 'lucide-react';
import { ownerApi } from '@/lib/api/owner';
import { ShopSettings } from '@/types/owner';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { LoadingState } from '@/components/ui/LoadingState';
import { useToast } from '@/components/common/Toast';

export default function OwnerSettingsPage() {
  const [settings, setSettings] = useState<ShopSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const toast = useToast();

  useEffect(() => {
    ownerApi.getShopSettings().then((data) => {
      setSettings(data);
      setLoading(false);
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setIsSaving(true);
    try {
      const updated = await ownerApi.updateShopSettings(settings);
      setSettings(updated);
      toast.success('Storefront profile updated successfully!');
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || !settings) return <LoadingState message="Loading storefront settings..." />;

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-owner-border shadow-soft">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif font-bold text-xl sm:text-2xl text-owner-heading">Storefront Settings</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-brand-blush text-brand-plum text-2xs font-bold uppercase tracking-wider">
              Live Configuration
            </span>
          </div>
          <p className="text-xs sm:text-sm text-owner-muted mt-1">
            Customize your bakery branding, address, FSSAI verification, and opening hours visible to customer marketplace visitors.
          </p>
        </div>

        <Button type="submit" disabled={isSaving} className="self-start sm:self-auto">
          <Save className="w-4 h-4 mr-1.5" />
          {isSaving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Core Identity & Address */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card 1: Bakery Brand Profile */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-plum border-b border-owner-border pb-3">
              <Store className="w-4 h-4" />
              <span>Bakery Identity & Bio</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Bakery Business Name"
                value={settings.businessName}
                onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
                required
              />
              <Select
                label="Bakery Business Type"
                value={settings.businessType || 'HOME_BAKER'}
                onChange={(e) => setSettings({ ...settings, businessType: e.target.value })}
                options={[
                  { label: 'Home Baker 🏠', value: 'HOME_BAKER' },
                  { label: 'Custom Cake Studio ✨', value: 'CUSTOM_CAKE_STUDIO' },
                  { label: 'Pastry & Dessert Shop 🍰', value: 'PASTRY_SHOP' },
                  { label: 'Commercial Bakery 🏬', value: 'COMMERCIAL_BAKERY' },
                ]}
              />
            </div>

            <Textarea
              label="Bakery Description / Story"
              rows={3}
              value={settings.description || ''}
              onChange={(e) => setSettings({ ...settings, description: e.target.value })}
              placeholder="Tell your customers about your baking passion, fresh ingredients, and specialties..."
            />

            {/* Dietary Preference Toggle */}
            <div className="pt-2">
              <label className="flex items-center gap-3 p-3.5 rounded-xl border border-owner-border bg-owner-canvas/40 cursor-pointer hover:bg-owner-canvas transition-colors">
                <input
                  type="checkbox"
                  checked={settings.isPureVeg}
                  onChange={(e) => setSettings({ ...settings, isPureVeg: e.target.checked })}
                  className="w-4 h-4 text-brand-plum rounded border-owner-border focus:ring-brand-plum"
                />
                <div className="flex items-center gap-2">
                  <Leaf className={`w-4 h-4 ${settings.isPureVeg ? 'text-emerald-600' : 'text-owner-muted'}`} />
                  <div>
                    <span className="text-xs font-bold text-owner-heading block">100% Pure Veg (Eggless Only)</span>
                    <span className="text-2xs text-owner-muted">
                      Display the green pure veg verified badge on your public storefront and marketplace cards
                    </span>
                  </div>
                </div>
              </label>
            </div>
          </Card>

          {/* Card 2: Physical Location & Address */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-plum border-b border-owner-border pb-3">
              <MapPin className="w-4 h-4" />
              <span>Location & Delivery Address</span>
            </div>

            <Input
              label="Street Address Line 1"
              value={settings.addressLine1}
              onChange={(e) => setSettings({ ...settings, addressLine1: e.target.value })}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Area / Neighborhood"
                value={settings.area || ''}
                onChange={(e) => setSettings({ ...settings, area: e.target.value })}
                placeholder="Akurdi"
              />
              <Input
                label="City"
                value={settings.city}
                onChange={(e) => setSettings({ ...settings, city: e.target.value })}
                required
                list="settings-cities"
              />
            </div>

            <datalist id="settings-cities">
              <option value="Mumbai" />
              <option value="Pune" />
              <option value="Bengaluru" />
              <option value="Delhi NCR" />
              <option value="Hyderabad" />
              <option value="Chennai" />
              <option value="Kolkata" />
              <option value="Ahmedabad" />
              <option value="Jaipur" />
              <option value="Chandigarh" />
              <option value="Lucknow" />
              <option value="Kochi" />
            </datalist>

            <datalist id="settings-states">
              <option value="Maharashtra" />
              <option value="Karnataka" />
              <option value="Delhi NCR" />
              <option value="Telangana" />
              <option value="Tamil Nadu" />
              <option value="West Bengal" />
              <option value="Gujarat" />
              <option value="Rajasthan" />
              <option value="Punjab" />
              <option value="Kerala" />
              <option value="Uttar Pradesh" />
            </datalist>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="District"
                value={settings.district || ''}
                onChange={(e) => setSettings({ ...settings, district: e.target.value })}
                placeholder="e.g. Pune, Mumbai Suburban"
              />
              <Input
                label="State"
                value={settings.state}
                onChange={(e) => setSettings({ ...settings, state: e.target.value })}
                required
                list="settings-states"
              />
              <Input
                label="Pincode"
                value={settings.pincode}
                onChange={(e) => setSettings({ ...settings, pincode: e.target.value })}
                required
              />
            </div>
          </Card>

          {/* Card 3: Contact & Social Handles */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-plum border-b border-owner-border pb-3">
              <ShieldCheck className="w-4 h-4" />
              <span>Contact & Compliance</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Customer Contact Phone"
                value={settings.phone || ''}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              />
              <Input
                label="Bakery Email"
                type="email"
                value={settings.email || ''}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="WhatsApp Order Number"
                value={settings.whatsappNumber || ''}
                onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                placeholder="+91 98231 00000"
              />
              <Input
                label="FSSAI Registration Number"
                value={settings.fssaiRegistration || ''}
                onChange={(e) => setSettings({ ...settings, fssaiRegistration: e.target.value })}
                placeholder="FSSAI-21523000000123"
              />
            </div>
          </Card>
        </div>

        {/* Right Column: Visuals & Hours */}
        <div className="lg:col-span-4 space-y-6">
          {/* Live Storefront Preview Card */}
          <Card className="p-0 overflow-hidden border-0 shadow-md ring-1 ring-owner-border">
            <div className="relative h-48 w-full bg-owner-canvas overflow-hidden">
              <img
                src={settings.coverImageUrl || "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80"}
                alt="Bakery Cover"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

              {/* Bakery Identity Overlay */}
              <div className="absolute bottom-4 left-5 right-5 flex items-end gap-3 text-white">
                <div className="w-16 h-16 rounded-2xl bg-white border-2 border-white shadow-md overflow-hidden shrink-0 flex items-center justify-center text-brand-plum font-bold text-xl">
                  {settings.logoUrl ? (
                    <img 
                      src={settings.logoUrl} 
                      alt="Logo" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <span>{settings.businessName?.slice(0, 2).toUpperCase() || 'BA'}</span>
                  )}
                </div>

                <div className="min-w-0 pb-1">
                  <h3 className="text-lg font-bold font-serif truncate drop-shadow-sm">
                    {settings.businessName || 'Your Bakery Name'}
                  </h3>
                  <p className="text-xs text-gray-200 truncate opacity-90">
                    {settings.city ? `${settings.city} • ` : ''}{settings.businessType ? settings.businessType.replace('_', ' ') : 'Artisan Bakery'}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Visual Showcase Card */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-plum border-b border-owner-border pb-3">
              <ImageIcon className="w-4 h-4" />
              <span>Storefront Media</span>
            </div>

            <div className="space-y-3">
              <Input
                label="Cover Banner Image URL"
                value={settings.coverImageUrl || ''}
                onChange={(e) => setSettings({ ...settings, coverImageUrl: e.target.value })}
                placeholder="https://..."
              />
              {settings.coverImageUrl && (
                <div className="relative w-full h-28 rounded-xl overflow-hidden border border-owner-border">
                  <Image src={settings.coverImageUrl} alt="Cover Preview" fill className="object-cover" />
                </div>
              )}
            </div>

            <div className="space-y-3 pt-2">
              <Input
                label="Logo / Avatar Image URL"
                value={settings.logoUrl || ''}
                onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
                placeholder="https://..."
              />
              {settings.logoUrl && (
                <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-owner-border mx-auto">
                  <Image src={settings.logoUrl} alt="Logo Preview" fill className="object-cover" />
                </div>
              )}
            </div>
          </Card>

          {/* Operating Hours Card */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-plum border-b border-owner-border pb-3">
              <Clock className="w-4 h-4" />
              <span>Operating Hours</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Opening Time"
                type="time"
                value={settings.openingTime || '09:00'}
                onChange={(e) => setSettings({ ...settings, openingTime: e.target.value })}
              />
              <Input
                label="Closing Time"
                type="time"
                value={settings.closingTime || '22:00'}
                onChange={(e) => setSettings({ ...settings, closingTime: e.target.value })}
              />
            </div>
          </Card>
        </div>
      </div>
    </form>
  );
}
