import React from "react";
import { Store, HeartHandshake, Clock, ShieldCheck } from "lucide-react";

export const TrustBenefits: React.FC = () => {
  const benefits = [
    {
      icon: Store,
      title: "1000+ Trusted Bakeries",
      subtitle: "Handpicked verified local bakers",
    },
    {
      icon: HeartHandshake,
      title: "Fresh & Hygienic Cakes",
      subtitle: "Baked fresh for every order",
    },
    {
      icon: Clock,
      title: "On-time Delivery",
      subtitle: "Guaranteed slot delivery",
    },
    {
      icon: ShieldCheck,
      title: "Secure Payments",
      subtitle: "100% encrypted & protected",
    },
  ];

  return (
    <section className="bg-white border-y border-brand-border/80 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {benefits.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-3.5 sm:gap-4 p-2 group hover:translate-y-[-2px] transition-transform"
              >
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-brand-blush/80 text-brand-plum flex items-center justify-center flex-shrink-0 group-hover:bg-brand-plum group-hover:text-white transition-colors duration-300 shadow-2xs">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-brand-espresso leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-2xs sm:text-xs text-brand-muted hidden sm:block">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
