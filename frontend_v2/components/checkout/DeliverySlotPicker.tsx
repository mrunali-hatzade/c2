'use client';

import React from 'react';
import { DeliverySlot } from '@/types/deliverySlot';

interface Props {
  slots: DeliverySlot[];
  selectedSlotId: number | undefined;
  onSelect: (id: number) => void;
}

function getSlotIcon(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('midnight') || n.includes('12 am') || n.includes('night')) return '🌙';
  if (n.includes('morning') || n.includes('9 am') || n.includes('10 am')) return '🌅';
  if (n.includes('afternoon') || n.includes('12 pm') || n.includes('1 pm') || n.includes('2 pm')) return '🌞';
  if (n.includes('evening') || n.includes('5 pm') || n.includes('6 pm') || n.includes('7 pm')) return '🌆';
  return '🕐';
}

export function DeliverySlotPicker({ slots, selectedSlotId, onSelect }: Props) {
  if (!slots || slots.length === 0) {
    return (
      <p className="text-xs text-brand-muted italic py-2">
        No delivery slots configured by this bakery. Contact them directly to arrange delivery time.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-brand-espresso">
        Delivery Time Slot <span className="text-brand-crimson">*</span>
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {slots.map((slot) => {
          const isSelected = selectedSlotId === slot.id;
          const icon = getSlotIcon(slot.name || slot.dayOfWeek || '');
          return (
            <button
              key={slot.id}
              type="button"
              onClick={() => onSelect(slot.id)}
              className={`flex flex-col items-center justify-center gap-1 p-3 rounded-2xl border-2 text-center transition-all ${
                isSelected
                  ? 'border-brand-plum bg-brand-blush text-brand-plum shadow-sm scale-[1.02]'
                  : 'border-brand-border bg-white text-brand-espresso hover:border-brand-plum/40 hover:bg-brand-blush/30'
              }`}
            >
              <span className="text-xl">{icon}</span>
              <span className="text-xs font-bold leading-tight">{slot.name || slot.dayOfWeek}</span>
              <span className="text-[10px] text-brand-muted leading-none">
                {slot.startTime} – {slot.endTime}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
