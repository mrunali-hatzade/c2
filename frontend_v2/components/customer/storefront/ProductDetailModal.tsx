'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Plus, Minus, Cake, ShoppingBag, AlertTriangle, Clock } from 'lucide-react';
import { Product } from '@/types/product';
import { Shop } from '@/types/shop';
import { useCart } from '@/context/CartContext';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/common/Toast';

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  shop: Shop;
  onOpenCustomQuote?: () => void;
}

const FALLBACK_CAKE = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80';

const WEIGHT_OPTIONS = [
  { weight: 0.5, label: '0.5 kg', serves: '4-6 serves' },
  { weight: 1.0, label: '1.0 kg', serves: '8-12 serves' },
  { weight: 1.5, label: '1.5 kg', serves: '14-18 serves' },
  { weight: 2.0, label: '2.0 kg', serves: '20-25 serves' },
];

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  isOpen,
  onClose,
  product,
  shop,
  onOpenCustomQuote,
}) => {
  const { addItem, clearCart, currentShopName } = useCart();
  const toast = useToast();

  const [quantity, setQuantity] = useState(1);
  const [customMessage, setCustomMessage] = useState('');
  const [showConflictPrompt, setShowConflictPrompt] = useState(false);
  const [selectedWeight, setSelectedWeight] = useState<number>(1); // kg

  if (!product) return null;

  const unitPrice = product.price * selectedWeight;

  const handleAddToCart = () => {
    const result = addItem({
      productId: product.id,
      name: `${product.name} (${selectedWeight} kg)`,
      price: unitPrice,
      quantity,
      imageUrl: product.imageUrl || FALLBACK_CAKE,
      isEggless: product.isEggless,
      customMessage: customMessage.trim() || undefined,
      shopId: shop.id,
      shopName: shop.businessName,
    });

    if (result.conflict) {
      setShowConflictPrompt(true);
      return;
    }

    toast.success(`Added "${product.name}" to store cart!`);
    onClose();
    setQuantity(1);
    setCustomMessage('');
  };

  const handleReplaceCart = () => {
    clearCart();
    addItem({
      productId: product.id,
      name: `${product.name} (${selectedWeight} kg)`,
      price: unitPrice,
      quantity,
      imageUrl: product.imageUrl || FALLBACK_CAKE,
      isEggless: product.isEggless,
      customMessage: customMessage.trim() || undefined,
      shopId: shop.id,
      shopName: shop.businessName,
    });
    setShowConflictPrompt(false);
    toast.success(`Cart updated for "${shop.businessName}"!`);
    onClose();
    setQuantity(1);
    setCustomMessage('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="md" title={product.name}>
      {showConflictPrompt ? (
        <div className="space-y-4 py-2">
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div className="text-xs leading-relaxed">
              <p className="font-semibold">Replace items in cart?</p>
              <p className="text-amber-700 mt-0.5">
                Your cart currently contains items from <strong>{currentShopName}</strong>. Each order must be placed with a single bakery.
              </p>
            </div>
          </div>
          <p className="text-xs text-brand-muted">
            Would you like to clear your current cart and start ordering from <strong>{shop.businessName}</strong>?
          </p>
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setShowConflictPrompt(false)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleReplaceCart}>
              Clear & Add from this Bakery
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Cake Image Header Banner */}
          <div className="relative h-44 sm:h-52 w-full rounded-2xl overflow-hidden bg-brand-cream">
            <Image
              src={product.imageUrl || FALLBACK_CAKE}
              alt={product.name}
              fill
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
              {(product.categoryName || product.category) && (
                <span className="text-[11px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full">
                  {product.categoryName || product.category?.replace(/_/g, ' ').toLowerCase()}
                </span>
              )}
              <Badge variant={product.isEggless ? 'success' : 'default'} size="sm">
                {product.isEggless ? '🌱 100% Eggless' : 'Contains Egg'}
              </Badge>
            </div>
          </div>

          {/* Price & Weight Selection */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-serif font-bold text-brand-espresso">
                ₹{unitPrice}
              </span>
              <span className="text-xs text-brand-muted ml-1.5">
                for {selectedWeight} kg
              </span>
            </div>

            {product.preparationTimeHours && (
              <span className="text-xs text-brand-muted flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-brand-plum" />
                <span>{product.preparationTimeHours}h bake time</span>
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-xs text-brand-muted leading-relaxed">
            {product.description ||
              'Artisanal gourmet cake freshly prepared with authentic ingredients. Perfect for birthdays, anniversaries, and personal celebrations.'}
          </p>

          {/* Sizing / Weight Multiplier with Serving Guide */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-brand-espresso">
                Select Cake Weight & Serving
              </label>
              <span className="text-[11px] text-brand-plum font-medium">
                {WEIGHT_OPTIONS.find((w) => w.weight === selectedWeight)?.serves}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {WEIGHT_OPTIONS.map((opt) => (
                <button
                  key={opt.weight}
                  type="button"
                  onClick={() => setSelectedWeight(opt.weight)}
                  className={`py-2 px-1 rounded-xl text-center border transition-all ${
                    selectedWeight === opt.weight
                      ? 'bg-brand-plum text-white border-brand-plum shadow-xs'
                      : 'bg-white text-brand-espresso border-brand-border hover:bg-brand-cream/50'
                  }`}
                >
                  <span className="block text-xs font-bold">{opt.label}</span>
                  <span
                    className={`block text-[10px] mt-0.5 ${
                      selectedWeight === opt.weight ? 'text-white/80' : 'text-brand-muted'
                    }`}
                  >
                    {opt.serves}
                  </span>
                </button>
              ))}
            </div>
            {onOpenCustomQuote && (
              <p className="text-[11px] text-brand-muted text-right pt-0.5">
                Need a 2-tier or custom themed design?{' '}
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenCustomQuote();
                  }}
                  className="text-brand-plum font-bold hover:underline"
                >
                  Request custom quote
                </button>
              </p>
            )}
          </div>

          {/* Custom Message on Cake */}
          <div className="pt-1">
            <Input
              label="Custom Message on Cake (Optional)"
              placeholder="e.g. Happy 25th Birthday Sarah!"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              helperText="Piped in rich chocolate lettering on top of the cake"
            />
          </div>

          {/* Quantity Counter */}
          <div className="flex items-center justify-between pt-2 border-t border-brand-border/60">
            <span className="text-xs font-semibold text-brand-espresso">Quantity:</span>
            <div className="flex items-center gap-3 border border-brand-border rounded-full px-3 py-1 bg-brand-cream-light/60">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-1 rounded-full text-brand-espresso hover:bg-brand-cream transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-serif font-bold text-sm text-brand-espresso w-6 text-center">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="p-1 rounded-full text-brand-espresso hover:bg-brand-cream transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Total & Submit Button */}
          <div className="pt-3 border-t border-brand-border/60 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-brand-muted block">Total Price</span>
              <span className="font-serif font-bold text-lg text-brand-espresso">
                ₹{unitPrice * quantity}
              </span>
            </div>
            <Button onClick={handleAddToCart} size="md" className="gap-2">
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Basket</span>
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};
