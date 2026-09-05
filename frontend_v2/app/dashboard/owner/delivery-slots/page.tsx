'use client';

import React, { useEffect, useState } from 'react';
import { Calendar, Plus, Trash2 } from 'lucide-react';
import { deliverySlotsApi } from '@/lib/api/deliverySlots';
import { DeliverySlot } from '@/types/deliverySlot';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { LoadingState } from '@/components/ui/LoadingState';
import { EmptyState } from '@/components/ui/EmptyState';

export default function OwnerDeliverySlotsPage() {
  const [slots, setSlots] = useState<DeliverySlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [name, setName] = useState('');
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('14:00');
  const [maxOrdersPerDay, setMaxOrdersPerDay] = useState('10');

  const fetchSlots = async () => {
    setIsLoading(true);
    try {
      const data = await deliverySlotsApi.getOwnerSlots();
      setSlots(data || []);
    } catch {
      setSlots([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const handleCreateSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await deliverySlotsApi.createSlot({
        name,
        startTime,
        endTime,
        maxOrdersPerDay: Number(maxOrdersPerDay),
        isActive: true,
      });
      setIsModalOpen(false);
      setName('');
      fetchSlots();
    } catch (err: any) {
      alert(err.message || 'Failed to create slot');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSlot = async (id: number) => {
    if (!confirm('Are you sure you want to delete this delivery slot?')) return;
    try {
      await deliverySlotsApi.deleteSlot(id);
      fetchSlots();
    } catch (err: any) {
      alert(err.message || 'Failed to delete slot');
    }
  };

  if (isLoading) return <LoadingState message="Loading delivery slots..." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif font-bold text-2xl text-owner-heading">Delivery Slots</h1>
          <p className="text-xs text-owner-muted mt-0.5">Control daily capacity and time windows for customer deliveries</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} size="sm">
          <Plus className="w-4 h-4 mr-1.5" /> Add Window
        </Button>
      </div>

      {slots.length === 0 ? (
        <EmptyState
          icon={<Calendar className="w-6 h-6" />}
          title="No Delivery Slots Configured"
          description="Create delivery windows (e.g., Morning 10 AM - 2 PM) so customers can schedule delivery times."
          action={
            <Button onClick={() => setIsModalOpen(true)} size="sm">
              <Plus className="w-4 h-4 mr-1" /> Add Delivery Slot
            </Button>
          }
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-owner-border bg-owner-canvas/40 text-owner-muted">
                  <th className="py-3 px-4">Window Name</th>
                  <th className="py-3 px-4">Time Interval</th>
                  <th className="py-3 px-4">Daily Order Limit</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-owner-border">
                {slots.map((s) => (
                  <tr key={s.id} className="hover:bg-owner-canvas/30">
                    <td className="py-3.5 px-4 font-semibold text-owner-heading">{s.name}</td>
                    <td className="py-3.5 px-4 text-owner-muted">{s.startTime} - {s.endTime}</td>
                    <td className="py-3.5 px-4">{s.maxOrdersPerDay} orders/day</td>
                    <td className="py-3.5 px-4">
                      <Badge variant={s.isActive ? 'success' : 'default'} size="sm">
                        {s.isActive ? 'Active' : 'Paused'}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDeleteSlot(s.id)}
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Add Slot Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Delivery Time Slot"
      >
        <form onSubmit={handleCreateSlot} className="space-y-4">
          <Input
            label="Slot Name"
            required
            placeholder="Morning Delivery"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Time (HH:mm)"
              required
              placeholder="10:00"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
            <Input
              label="End Time (HH:mm)"
              required
              placeholder="14:00"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
          <Input
            label="Max Orders Per Day"
            type="number"
            required
            value={maxOrdersPerDay}
            onChange={(e) => setMaxOrdersPerDay(e.target.value)}
          />
          <div className="pt-4 flex justify-end gap-3 border-t border-owner-border">
            <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Save Slot
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
