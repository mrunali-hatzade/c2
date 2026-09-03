"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { 
  Mail, 
  Phone, 
  Clock, 
  Send, 
  CheckCircle2, 
  Sparkles,
  MessageSquare,
  HelpCircle
} from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Order Assistance",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-brand-cream-light font-sans flex flex-col">
      <Navbar selectedLocation="Akurdi" onSelectLocation={() => {}} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Title */}
        <div className="text-center max-w-4xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-blush border border-brand-blush-border text-brand-plum text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>We are here to help</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-brand-espresso tracking-tight whitespace-normal sm:whitespace-nowrap">
            Get in Touch with <span className="text-brand-plum italic">CakeStore</span>
          </h1>

          <p className="text-base sm:text-lg text-brand-muted max-w-4xl w-full mx-auto leading-relaxed">
            Have a question about a cake order, want to partner your bakery with us, or need technical help? Send us a message and our team will respond within a few hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Contact Channels */}
          <div className="lg:col-span-5 space-y-6">
            {/* Quick Cards */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-soft space-y-6">
              <h2 className="text-xl font-bold font-serif text-brand-espresso pb-3 border-b border-brand-border/60">
                Contact Information
              </h2>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-blush flex items-center justify-center text-brand-plum shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-brand-espresso">Email Us</h3>
                  <p className="text-xs text-brand-muted mt-0.5">For customer queries & bakery partnerships</p>
                  <a
                    href="mailto:support@cakestore.in"
                    className="text-sm font-semibold text-brand-plum hover:underline mt-1 inline-block"
                  >
                    support@cakestore.in
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-blush flex items-center justify-center text-brand-plum shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-brand-espresso">Call or WhatsApp</h3>
                  <p className="text-xs text-brand-muted mt-0.5">Direct phone support & quick queries</p>
                  <a
                    href="tel:+919876543210"
                    className="text-sm font-semibold text-brand-plum hover:underline mt-1 inline-block"
                  >
                    +91 98765 43210
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-blush flex items-center justify-center text-brand-plum shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-brand-espresso">Operating Hours</h3>
                  <p className="text-xs text-brand-muted mt-0.5">
                    Monday to Sunday: 9:00 AM – 9:00 PM IST
                  </p>
                </div>
              </div>
            </div>

            {/* Baker Partnership Quick Box */}
            <div className="bg-gradient-to-br from-brand-blush/60 via-white to-brand-blush/30 rounded-3xl p-6 border border-brand-border shadow-2xs">
              <div className="flex items-center gap-2 text-brand-plum font-bold text-xs uppercase tracking-wider mb-2">
                <MessageSquare className="w-4 h-4" />
                <span>Bakery Owners</span>
              </div>
              <h4 className="font-bold font-serif text-brand-espresso text-base">
                Looking to register your bakery?
              </h4>
              <p className="text-xs text-brand-muted mt-1 leading-relaxed">
                You can set up your online shop directly without waiting for manual verification.
              </p>
              <a
                href="/for-owners"
                className="mt-3 inline-flex items-center text-xs font-bold text-brand-plum hover:underline"
              >
                Go to Owner Portal →
              </a>
            </div>
          </div>

          {/* Right Column: Interactive Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-brand-border shadow-soft">
              {submitted ? (
                <div className="text-center py-12 animate-in fade-in zoom-in-95 duration-300">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold font-serif text-brand-espresso mb-2">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-sm text-brand-muted max-w-md mx-auto mb-6">
                    Thank you for reaching out, {form.name}. Our support team has received your message and will reply to <span className="font-semibold text-brand-espresso">{form.email}</span> shortly.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setForm({
                        name: "",
                        email: "",
                        phone: "",
                        subject: "Order Assistance",
                        message: "",
                      });
                    }}
                    className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-brand-plum text-white text-xs font-bold hover:bg-brand-plum-hover transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h2 className="text-xl font-bold font-serif text-brand-espresso pb-2 border-b border-brand-border/60">
                    Send Us a Message
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="e.g. Pooja Deshmukh"
                        className="w-full bg-brand-cream border border-brand-border rounded-xl px-4 py-3 text-sm text-brand-espresso focus:outline-none focus:border-brand-plum"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="e.g. pooja@gmail.com"
                        className="w-full bg-brand-cream border border-brand-border rounded-xl px-4 py-3 text-sm text-brand-espresso focus:outline-none focus:border-brand-plum"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="e.g. +91 98765 43210"
                        className="w-full bg-brand-cream border border-brand-border rounded-xl px-4 py-3 text-sm text-brand-espresso focus:outline-none focus:border-brand-plum"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-1">
                        Inquiry Topic *
                      </label>
                      <select
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        className="w-full bg-brand-cream border border-brand-border rounded-xl px-4 py-3 text-sm text-brand-espresso focus:outline-none focus:border-brand-plum cursor-pointer"
                      >
                        <option value="Order Assistance">Order Assistance & Delivery</option>
                        <option value="Bakery Partnership">Bakery / Home Baker Partnership</option>
                        <option value="Custom Cake Query">Custom Bulk / Wedding Cake Query</option>
                        <option value="Technical Issue">Technical / Website Issue</option>
                        <option value="Other">Other Inquiries</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-1">
                      Your Message *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Tell us how we can help you..."
                      className="w-full bg-brand-cream border border-brand-border rounded-xl px-4 py-3 text-sm text-brand-espresso focus:outline-none focus:border-brand-plum resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl bg-brand-plum hover:bg-brand-plum-hover text-white text-sm font-bold shadow-soft transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <span>Send Message</span>
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
