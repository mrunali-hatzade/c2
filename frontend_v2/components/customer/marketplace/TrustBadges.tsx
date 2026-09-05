import React from 'react';
import { ShieldCheck, Heart, Sparkles, Clock, MessageSquare, Truck } from 'lucide-react';
import { Card } from '@/components/ui/Card';

export const TrustBadges: React.FC = () => {
  const features = [
    {
      icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
      title: 'FSSAI Verified Kitchens',
      description: 'Every baker on CakeStore holds valid food compliance credentials for hygiene and quality.',
    },
    {
      icon: <Heart className="w-5 h-5 text-rose-600" />,
      title: 'Artisanal Small-Batch',
      description: 'Baked to order using premium couverture chocolates, fresh butter, and real fruits.',
    },
    {
      icon: <Clock className="w-5 h-5 text-amber-600" />,
      title: 'Dedicated Storefront Delivery',
      description: 'Order fulfills directly through the chosen bakery with reserved delivery time slots.',
    },
    {
      icon: <Sparkles className="w-5 h-5 text-purple-600" />,
      title: 'Custom Cake Capabilities',
      description: 'Personalize celebration tiers, bespoke floral finishes, and eggless dietary options.',
    },
  ];

  return (
    <section className="py-16 bg-white border-y border-brand-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-brand-espresso">
            Why Order Through CakeStore?
          </h2>
          <p className="text-xs sm:text-sm text-brand-muted mt-2">
            We bridge the gap between discerning cake connoisseurs and the finest independent artisan bakers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, idx) => (
            <Card key={idx} elevation="soft" hoverEffect className="p-6 bg-brand-cream-light/30">
              <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center mb-4 shadow-sm border border-brand-border/60">
                {f.icon}
              </div>
              <h3 className="font-serif font-bold text-base text-brand-espresso">{f.title}</h3>
              <p className="text-xs text-brand-muted mt-2 leading-relaxed">{f.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
