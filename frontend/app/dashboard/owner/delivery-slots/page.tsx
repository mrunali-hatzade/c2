"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, X, Clock, ToggleLeft, ToggleRight, Calendar } from "lucide-react";
import { deliverySlotApi, ShopDeliverySlot, DeliverySlotRequest } from "@/lib/api/deliverySlots";

// Add specific types for the form state
type SlotForm = {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  maxOrders: number;
  isActive: boolean;
};

const DAYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];

export default function DeliverySlotsPage() {
  const [slots, setSlots] = useState<ShopDeliverySlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<ShopDeliverySlot | null>(null);
  
  // Form State
  const [formData, setFormData] = useState<SlotForm>({
    dayOfWeek: "MONDAY",
    startTime: "09:00",
    endTime: "18:00",
    maxOrders: 10,
    isActive: true,
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete State
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    try {
      setIsLoading(true);
      const data = await deliverySlotApi.getSlots();
      // Sort by day then time
      const sorted = data.sort((a, b) => {
        const diff = DAYS.indexOf(a.dayOfWeek) - DAYS.indexOf(b.dayOfWeek);
        if (diff !== 0) return diff;
        return a.startTime.localeCompare(b.startTime);
      });
      setSlots(sorted);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load delivery slots");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (slot?: ShopDeliverySlot) => {
    setFormError(null);
    if (slot) {
      setEditingSlot(slot);
      setFormData({
        dayOfWeek: slot.dayOfWeek,
        // Backend returns times in HH:mm:ss format, slice to HH:mm for input type="time"
        startTime: slot.startTime.substring(0, 5),
        endTime: slot.endTime.substring(0, 5),
        maxOrders: slot.maxOrders,
        isActive: slot.isActive,
      });
    } else {
      setEditingSlot(null);
      setFormData({
        dayOfWeek: "MONDAY",
        startTime: "09:00",
        endTime: "18:00",
        maxOrders: 10,
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validation
    if (formData.startTime >= formData.endTime) {
      setFormError("Start time must be before end time");
      return;
    }
    if (formData.maxOrders <= 0) {
      setFormError("Maximum orders must be greater than zero");
      return;
    }

    try {
      setIsSubmitting(true);
      const reqPayload = {
        ...formData,
        startTime: formData.startTime.length === 5 ? formData.startTime + ":00" : formData.startTime,
        endTime: formData.endTime.length === 5 ? formData.endTime + ":00" : formData.endTime,
      };

      if (editingSlot) {
        await deliverySlotApi.updateSlot(editingSlot.id, reqPayload);
      } else {
        await deliverySlotApi.createSlot(reqPayload);
      }
      setIsModalOpen(false);
      fetchSlots();
    } catch (err: any) {
      setFormError(err.message || "Failed to save delivery slot");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (slot: ShopDeliverySlot) => {
    try {
      await deliverySlotApi.updateStatus(slot.id, !slot.isActive);
      setSlots(prev =>
        prev.map(s => (s.id === slot.id ? { ...s, isActive: !s.isActive } : s))
      );
    } catch (err: any) {
      alert(err.message || "Failed to update status");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this delivery slot? If orders are attached, it will fail.")) return;
    
    setDeletingId(id);
    try {
      await deliverySlotApi.deleteSlot(id);
      setSlots(prev => prev.filter(s => s.id !== id));
    } catch (err: any) {
      alert(err.message || "Failed to delete delivery slot");
    } finally {
      setDeletingId(null);
    }
  };

  const formatTime = (timeStr: string) => {
    const [h, m] = timeStr.split(':');
    let hNum = parseInt(h, 10);
    const ampm = hNum >= 12 ? 'PM' : 'AM';
    hNum = hNum % 12 || 12;
    return `${hNum}:${m} ${ampm}`;
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading delivery slots...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Delivery Slots</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your available delivery times and capacities.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-brand-primary text-white px-4 py-2 rounded-lg hover:bg-brand-primary/90 transition-colors"
        >
          <Plus size={18} />
          Add Delivery Slot
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      )}

      {slots.length === 0 && !error ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No delivery slots configured</h3>
          <p className="text-gray-500 mt-1 mb-6">Customers won&apos;t be able to checkout until you add delivery availability.</p>
          <button
            onClick={() => handleOpenModal()}
            className="text-brand-primary font-medium hover:underline"
          >
            Add your first delivery slot
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {slots.map(slot => (
            <div key={slot.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className="px-3 py-1 bg-gray-100 rounded-full text-xs font-semibold text-gray-700">
                  {slot.dayOfWeek}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleStatus(slot)}
                    title={slot.isActive ? "Deactivate" : "Activate"}
                    className={`${slot.isActive ? "text-green-600" : "text-gray-400"} hover:opacity-80 transition-opacity`}
                  >
                    {slot.isActive ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                  </button>
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 text-gray-900 font-medium text-lg mb-1">
                  <Clock size={18} className="text-brand-primary" />
                  {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                </div>
                <p className="text-sm text-gray-500">
                  Max capacity: <span className="font-medium">{slot.maxOrders} orders</span>
                </p>
                <p className="text-sm mt-2">
                  Status: <span className={`font-medium ${slot.isActive ? 'text-green-600' : 'text-red-600'}`}>{slot.isActive ? 'Active' : 'Inactive'}</span>
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button
                  onClick={() => handleOpenModal(slot)}
                  className="text-gray-500 hover:text-brand-primary p-2 transition-colors"
                  title="Edit Slot"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDelete(slot.id)}
                  disabled={deletingId === slot.id}
                  className="text-gray-500 hover:text-red-600 p-2 transition-colors disabled:opacity-50"
                  title="Delete Slot"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {editingSlot ? "Edit Delivery Slot" : "Add Delivery Slot"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Day of Week</label>
                <select
                  value={formData.dayOfWeek}
                  onChange={e => setFormData({ ...formData, dayOfWeek: e.target.value })}
                  className="w-full border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-brand-primary/50"
                  required
                >
                  {DAYS.map(d => (
                    <option key={d} value={d}>{d.charAt(0) + d.slice(1).toLowerCase()}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-brand-primary/50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-brand-primary/50"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Orders</label>
                <input
                  type="number"
                  min="1"
                  value={formData.maxOrders}
                  onChange={e => setFormData({ ...formData, maxOrders: parseInt(e.target.value) })}
                  className="w-full border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-brand-primary/50"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-brand-primary rounded border-gray-300"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Active (visible to customers)
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save Slot"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
