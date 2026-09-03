"use client";
import React from "react";
import { Users, Mail, Phone, ShoppingBag } from "lucide-react";

interface CustomerRecord {
  id: number;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
}

const CUSTOMERS: CustomerRecord[] = [
  { id: 1, name: "Anjali Sharma", email: "anjali.s@gmail.com", phone: "+91 98440 12345", totalOrders: 5, totalSpent: 3200, lastOrderDate: "Aug 28, 2026" },
  { id: 2, name: "Rahul Desai", email: "rahul.desai@yahoo.com", phone: "+91 98123 98765", totalOrders: 3, totalSpent: 1850, lastOrderDate: "Aug 25, 2026" },
  { id: 3, name: "Priya Kapoor", email: "priya.k@hotmail.com", phone: "+91 97777 11223", totalOrders: 8, totalSpent: 5400, lastOrderDate: "Aug 30, 2026" },
  { id: 4, name: "Vikram Malhotra", email: "vikram.m@gmail.com", phone: "+91 95555 44332", totalOrders: 2, totalSpent: 1100, lastOrderDate: "Aug 15, 2026" },
];

export const OwnerCustomersTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Customers CRM</h2>
        <p className="text-xs text-slate-500 font-medium">View repeat buyers and customer purchase histories</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <th className="py-3.5 px-4">Customer</th>
              <th className="py-3.5 px-4">Contact Info</th>
              <th className="py-3.5 px-4">Orders</th>
              <th className="py-3.5 px-4">Total Spent</th>
              <th className="py-3.5 px-4">Last Order</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
            {CUSTOMERS.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                      {c.name.charAt(0)}
                    </div>
                    <span className="font-bold text-slate-900">{c.name}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="text-[11px]">
                    <div className="flex items-center gap-1 text-slate-700"><Mail className="w-3 h-3 text-slate-400" /> {c.email}</div>
                    <div className="flex items-center gap-1 text-slate-500 mt-0.5"><Phone className="w-3 h-3 text-slate-400" /> {c.phone}</div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded text-slate-800 font-bold">
                    <ShoppingBag className="w-3 h-3 text-slate-500" /> {c.totalOrders}
                  </span>
                </td>
                <td className="py-3 px-4 font-black text-slate-900">₹{c.totalSpent}</td>
                <td className="py-3 px-4 text-slate-500 font-medium">{c.lastOrderDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
