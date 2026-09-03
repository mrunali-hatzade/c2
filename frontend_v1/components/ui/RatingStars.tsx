import React from "react";
import { Star } from "lucide-react";

interface RatingStarsProps {
  rating: number;
  count?: number;
  showCount?: boolean;
  size?: number;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  count,
  showCount = true,
  size = 14,
}) => {
  return (
    <div className="flex items-center gap-1 text-sm font-semibold text-brand-espresso">
      <Star size={size} className="fill-brand-gold text-brand-gold" />
      <span>{rating.toFixed(1)}</span>
      {showCount && count !== undefined && (
        <span className="font-normal text-brand-muted">({count})</span>
      )}
    </div>
  );
};
