import React from "react";
import { Store, Cake, ClipboardCheck, Bike } from "lucide-react";

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: "1",
      title: "1. Choose a Bakery",
      description: "Browse top-rated bakeries and verified home bakers near you.",
      icon: Store,
    },
    {
      number: "2",
      title: "2. Select Your Cake",
      description: "Pick your cake, choose weight variants, add-ons and dietary tags.",
      icon: Cake,
    },
    {
      number: "3",
      title: "3. Place Your Order",
      description: "Enter your delivery address, preferred slot, and instant payment method.",
      icon: ClipboardCheck,
    },
    {
      number: "4",
      title: "4. Get It Delivered",
      description: "Freshly baked with love and safely delivered right to your doorstep.",
      icon: Bike,
    },
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-20 bg-brand-cream/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-brand-espresso tracking-tight">
            How CakeStore <span className="text-brand-plum italic">Works</span>?
          </h2>
          <p className="mt-3 text-base text-brand-muted">
            Ordering your favorite handcrafted cake is just a few simple clicks away
          </p>
        </div>

        {/* 4 Connected Step Cards */}
        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Subtle Desktop Connecting Line */}
          <div className="hidden lg:block absolute top-14 left-[12%] right-[12%] h-0.5 border-t-2 border-dashed border-brand-plum/25 -z-0" />

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="relative z-10 flex flex-col items-center text-center p-6 bg-white rounded-3xl border border-brand-border/80 shadow-soft hover:shadow-card hover:border-brand-plum/30 transition-all duration-300 group"
              >
                {/* Step Icon with Badge Number */}
                <div className="relative mb-5">
                  <div className="w-16 h-16 rounded-2xl bg-brand-blush text-brand-plum flex items-center justify-center group-hover:bg-brand-plum group-hover:text-white transition-colors duration-300 shadow-xs">
                    <Icon className="w-8 h-8" />
                  </div>
                  <span className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-brand-plum text-white text-xs font-bold flex items-center justify-center shadow-xs border-2 border-white">
                    {step.number}
                  </span>
                </div>

                {/* Step Title */}
                <h3 className="text-lg font-bold text-brand-espresso mb-2">
                  {step.title}
                </h3>

                {/* Step Description */}
                <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
