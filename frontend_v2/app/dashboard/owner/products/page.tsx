'use client';
/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useState } from 'react';
import { Cake, Plus, Trash2, Edit2, ImageIcon, Sparkles } from 'lucide-react';
import { productsApi } from '@/lib/api/products';
import { Product } from '@/types/product';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { LoadingState } from '@/components/ui/LoadingState';
import { EmptyState } from '@/components/ui/EmptyState';

const FALLBACK_CAKE = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=400&q=80';

const PRESET_IMAGES = [
  { label: '🍫 Belgian Chocolate', url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80' },
  { label: '🍓 Red Velvet', url: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=800&q=80' },
  { label: '🥭 Alphonso Mango', url: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80' },
  { label: '🍪 Lotus Biscoff', url: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=80' },
  { label: '🧁 Piped Cupcakes', url: 'https://images.unsplash.com/photo-1587668178277-295251f900ce?auto=format&fit=crop&w=800&q=80' },
];

export default function OwnerProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New product fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('BIRTHDAY_CAKES');
  const [isEggless, setIsEggless] = useState(true);
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES[0].url);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const data = await productsApi.getOwnerProducts();
      setProducts(data || []);
    } catch {
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await productsApi.createProduct({
        name,
        description,
        price: Number(price),
        category,
        isEggless,
        imageUrl: imageUrl || FALLBACK_CAKE,
        inStock: true,
      });
      setIsModalOpen(false);
      setName('');
      setDescription('');
      setPrice('');
      setImageUrl(PRESET_IMAGES[0].url);
      fetchProducts();
    } catch (err: any) {
      alert(err.message || 'Failed to create product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await productsApi.deleteProduct(id);
      fetchProducts();
    } catch (err: any) {
      alert(err.message || 'Failed to delete product');
    }
  };

  if (isLoading) return <LoadingState message="Loading catalog..." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif font-bold text-2xl text-owner-heading">Product Catalog</h1>
          <p className="text-xs text-owner-muted mt-0.5">
            Manage handcrafted celebration cakes and desserts on your live storefront
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} size="sm">
          <Plus className="w-4 h-4 mr-1.5" /> Add Cake
        </Button>
      </div>

      {products.length === 0 ? (
        <EmptyState
          icon={<Cake className="w-6 h-6" />}
          title="No Cakes in Catalog"
          description="Add your first artisanal creation to start accepting orders from customers."
          action={
            <Button onClick={() => setIsModalOpen(true)} size="sm">
              <Plus className="w-4 h-4 mr-1" /> Add First Cake
            </Button>
          }
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-owner-border bg-owner-canvas/40 text-owner-muted">
                  <th className="py-3 px-4">Cake</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-owner-border">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-owner-canvas/30">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-brand-cream border border-owner-border/80 shrink-0 relative">
                          <img
                            src={p.imageUrl || FALLBACK_CAKE}
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-owner-heading">{p.name}</p>
                          <p className="text-[11px] text-owner-muted line-clamp-1 max-w-xs">
                            {p.description || 'Delicious handcrafted creation'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-owner-muted capitalize">
                      {p.category?.replace(/_/g, ' ').toLowerCase()}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={p.isEggless ? 'success' : 'default'} size="sm">
                        {p.isEggless ? '🌱 Eggless' : 'Contains Egg'}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-owner-heading">₹{p.price}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Add Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Cake to Storefront"
      >
        <form onSubmit={handleCreateProduct} className="space-y-4">
          <Input
            label="Cake Name"
            required
            placeholder="e.g. Belgian Dark Truffle"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            label="Description"
            placeholder="Layered rich dark chocolate sponge with 54% ganache"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Price (₹)"
              type="number"
              required
              placeholder="850"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />

            <Select
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={[
                { value: 'BIRTHDAY_CAKES', label: 'Birthday Cakes' },
                { value: 'WEDDING_CAKES', label: 'Wedding Cakes' },
                { value: 'CUSTOM_DESIGN', label: 'Custom Design' },
                { value: 'DESSERTS', label: 'Cheesecakes & Desserts' },
                { value: 'CUPCAKES', label: 'Cupcakes' },
                { value: 'PASTRIES', label: 'Pastries' },
                { value: 'COOKIES', label: 'Cookies & Macarons' },
              ]}
            />
          </div>

          {/* Cake Photo URL with Preset Chips */}
          <div className="space-y-2 pt-1">
            <Input
              label="Cake Photo Image URL"
              placeholder="https://images.unsplash.com/..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              helperText="Paste any image URL or select from the preset culinary photos below."
            />

            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] text-owner-muted font-medium mr-1">Presets:</span>
              {PRESET_IMAGES.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setImageUrl(preset.url)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors ${
                    imageUrl === preset.url
                      ? 'bg-brand-plum text-white border-brand-plum'
                      : 'bg-owner-canvas text-owner-heading border-owner-border hover:bg-brand-blush/50'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {imageUrl && (
              <div className="mt-2 flex items-center gap-3 p-2 rounded-xl bg-owner-canvas border border-owner-border">
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-brand-cream border shrink-0">
                  <img src={imageUrl} alt="Cake preview" className="w-full h-full object-cover" />
                </div>
                <span className="text-xs text-owner-muted">Image preview looks great!</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="eggless"
              checked={isEggless}
              onChange={(e) => setIsEggless(e.target.checked)}
              className="rounded text-brand-plum focus:ring-brand-plum"
            />
            <label htmlFor="eggless" className="text-xs text-owner-heading font-medium">
              100% Pure Eggless Cake
            </label>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-owner-border">
            <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Publish Cake
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
