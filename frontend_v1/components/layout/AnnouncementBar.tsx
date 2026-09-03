import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export const AnnouncementBar: React.FC = () => {
  return (
    <div className="bg-brand-plum-light border-b border-brand-blush-border/70 py-2 px-4 text-xs sm:text-sm text-brand-plum">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-center">
        <span className="inline-flex items-center gap-1.5 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-brand-plum flex-shrink-0" />
          <span>Are you a cake artist or bakery owner? Launch your branded online store.</span>
        </span>
        <Link
          href="#owner-cta"
          className="inline-flex items-center gap-1 font-semibold text-brand-plum hover:text-brand-plum-hover underline underline-offset-2 transition-colors"
        >
          Create Store
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
};
