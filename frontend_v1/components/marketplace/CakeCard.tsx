import React from "react";
import Image from "next/image";
import { Plus, Check, Star } from "lucide-react";
import { Product } from "@/types/storefront";

interface CakeCardProps {
  cake: Product;
  onAddToCart?: (cake: Product) => void;
}

export const CakeCard: React.FC<CakeCardProps> = ({ cake, onAddToCart }) => {
  const [isAdded, setIsAdded] = React.useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAdded(true);
    onAddToCart?.(cake);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-brand-border/80 shadow-soft hover:shadow-card-hover hover:border-brand-plum/30 transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Cake Visual */}
        <div className="relative w-full h-48 sm:h-52 overflow-hidden bg-brand-cream-dark">
          <Image
            src={
              cake.imageUrl ||
              "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80"
            }
            alt={cake.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          {/* Dietary Badge */}
          {cake.dietary && (
            <div
              className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-3xs font-bold shadow-2xs backdrop-blur-md ${
                cake.dietary === "EGGLESS"
                  ? "bg-emerald-50/90 text-emerald-800 border border-emerald-200"
                  : "bg-amber-50/90 text-amber-800 border border-amber-200"
              }`}
            >
              {cake.dietary === "EGGLESS" ? "🌱 Eggless" : "Standard"}
            </div>
          )}

          {/* Category Tag */}
          {cake.category && (
            <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-2xs font-semibold text-brand-espresso border border-brand-border shadow-2xs">
              {cake.category}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 space-y-2">
          {/* Bakery Source Attribution */}
          {cake.shopName && (
            <p className="text-2xs font-bold uppercase tracking-wider text-brand-plum">
              By {cake.shopName}
            </p>
          )}

          {/* Cake Title */}
          <h4 className="text-base sm:text-lg font-bold text-brand-espresso group-hover:text-brand-plum transition-colors line-clamp-1">
            {cake.name}
          </h4>

          {/* Description */}
          {cake.description && (
            <p className="text-xs text-brand-muted line-clamp-2 leading-relaxed">
              {cake.description}
            </p>
          )}
        </div>
      </div>

      {/* Footer Pricing & Action */}
      <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-brand-border/50">
        <div>
          <span className="text-2xs text-brand-muted block">Starting at</span>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-extrabold text-brand-espresso">
              ₹{cake.price}
            </span>
          </div>
        </div>

        {/* Add to Cart Action */}
        <button
          type="button"
          onClick={handleAdd}
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs active:scale-95 ${
            isAdded
              ? "bg-emerald-600 text-white"
              : "bg-brand-plum text-white hover:bg-brand-plum-hover"
          }`}
        >
          {isAdded ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Added!</span>
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
