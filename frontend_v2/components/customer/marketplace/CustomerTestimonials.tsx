import React from 'react';
import { Star, Quote, CheckCircle2, Heart } from 'lucide-react';
import Image from 'next/image';

interface Testimonial {
  id: string;
  name: string;
  city: string;
  cakeType: string;
  bakeryName: string;
  rating: number;
  quote: string;
  avatarUrl: string;
}

export const CustomerTestimonials: React.FC = () => {
  const testimonials: Testimonial[] = [
    {
      id: '1',
      name: 'Pooja Deshmukh',
      city: 'Akurdi, Pune',
      cakeType: 'Belgian Dark Truffle (1 kg)',
      bakeryName: 'Le Macaron Patisserie',
      rating: 5,
      quote:
        'Ordered a customized 1kg truffle cake for our family anniversary. The sponge was heavenly moist, 100% eggless, and the chocolate lettering was flawlessly piped. Arrived chilled and on time!',
      avatarUrl:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
    },
    {
      id: '2',
      name: 'Aditya Kulkarni',
      city: 'Bandra West, Mumbai',
      cakeType: 'Raspberry Pistachio Gateau',
      bakeryName: 'Sweet Tooth Studio',
      rating: 5,
      quote:
        'Finding real artisanal boutique bakers in Mumbai used to mean endless Instagram DMs and uncertain prices. CakeStore made browsing, picking serving sizes, and tracking fulfillment seamless.',
      avatarUrl:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80',
    },
    {
      id: '3',
      name: 'Sneha Nair',
      city: 'Koramangala, Bengaluru',
      cakeType: 'Salted Caramel Hazelnut Crunch',
      bakeryName: 'Golden Crust Artisan',
      rating: 5,
      quote:
        'The serving guide was spot on! We had 12 guests and the 1kg cake was the exact right quantity. The chef even reached out on WhatsApp to confirm delivery gate instructions. Truly exceptional service.',
      avatarUrl:
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=160&q=80',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-brand-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-blush border border-brand-border text-brand-plum text-xs font-semibold uppercase tracking-wider mb-3">
            <Heart className="w-3.5 h-3.5 fill-brand-plum text-brand-plum" />
            <span>Community Celebrations</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-brand-espresso tracking-tight">
            Loved by Dessert Enthusiasts Across <span className="text-brand-plum italic">India</span>
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-brand-muted leading-relaxed">
            Real stories from real celebrations powered by our verified independent baking partners.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="bg-brand-cream-light/70 rounded-3xl p-6 sm:p-7 border border-brand-border hover:border-brand-plum/30 shadow-soft hover:shadow-elevated transition-all duration-300 flex flex-col justify-between relative group"
            >
              <div className="relative">
                {/* Decorative Quote mark */}
                <div className="absolute -top-2 right-0 text-brand-border/80 group-hover:text-brand-plum/15 transition-colors">
                  <Quote className="w-9 h-9" />
                </div>

                {/* Star rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-xs font-bold text-brand-espresso ml-1">5.0</span>
                </div>

                {/* Quote */}
                <p className="text-xs sm:text-sm text-brand-espresso/90 leading-relaxed italic mb-6">
                  &ldquo;{item.quote}&rdquo;
                </p>

                {/* Cake tag badge */}
                <div className="mb-4">
                  <span className="inline-block px-2.5 py-1 rounded-full bg-white text-[11px] font-semibold text-brand-plum border border-brand-border shadow-2xs">
                    🍰 {item.cakeType}
                  </span>
                </div>
              </div>

              {/* Customer profile */}
              <div className="pt-4 border-t border-brand-border/60 flex items-center gap-3">
                <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-white shadow-xs shrink-0">
                  <Image
                    src={item.avatarUrl}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="44px"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs sm:text-sm font-bold text-brand-espresso truncate">
                      {item.name}
                    </h4>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  </div>
                  <p className="text-2xs text-brand-muted truncate">
                    {item.city} • via <span className="font-medium text-brand-espresso">{item.bakeryName}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
