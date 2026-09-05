import React from "react";
import { Star, Quote } from "lucide-react";
import Image from "next/image";

export const CustomerTestimonials: React.FC = () => {
  const testimonials = [
    {
      id: 1,
      name: "Priya S.",
      location: "Akurdi, Pune",
      rating: 5,
      review: "Found the most amazing home baker for my daughter's 5th birthday! The unicorn cake was not only beautiful but tasted incredibly fresh. Delivered perfectly on time.",
      image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=150&q=80",
    },
    {
      id: 2,
      name: "Rahul M.",
      location: "Baner, Pune",
      rating: 5,
      review: "The 100% pure veg chocolate truffle from Artisan Bakeries was a huge hit at our anniversary party. Love how easy it is to filter by dietary needs on this platform!",
      image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&q=80",
    },
    {
      id: 3,
      name: "Sneha K.",
      location: "Ravet, Pune",
      rating: 5,
      review: "I needed a last-minute customized photo cake and CakeStore saved the day. The baker was super responsive and the packaging was very secure.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    }
  ];

  return (
    <section className="py-16 bg-brand-blush/20 border-t border-brand-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-serif text-brand-espresso tracking-tight sm:text-4xl">
            Loved by <span className="text-brand-plum italic">10,000+</span> Customers
          </h2>
          <p className="mt-4 text-brand-muted max-w-2xl mx-auto text-sm sm:text-base">
            Don&apos;t just take our word for it. Here is what our community of dessert lovers has to say about their CakeStore experience.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id} 
              className="bg-white rounded-3xl p-6 shadow-sm border border-brand-border hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 relative group"
            >
              {/* Decorative Quote Icon */}
              <div className="absolute top-6 right-6 text-brand-blush opacity-50 group-hover:text-brand-plum/20 transition-colors">
                <Quote className="w-10 h-10" />
              </div>

              {/* Star Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-brand-espresso/80 text-sm leading-relaxed mb-6 italic relative z-10">
                &quot;{testimonial.review}&quot;
              </p>

              {/* Customer Info */}
              <div className="flex items-center gap-4 mt-auto">
                <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-brand-blush">
                  <Image 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-brand-espresso">{testimonial.name}</h4>
                  <p className="text-2xs text-brand-muted font-medium">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
