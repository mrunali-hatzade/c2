import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth/AuthContext';
import { ToastProvider } from '@/components/common/Toast';
import { CartProvider } from '@/context/CartContext';

export const metadata: Metadata = {
  title: 'CakeStore — Artisanal Bakery SaaS Platform',
  description: 'Discover handcrafted artisanal cakes from top local bakeries or manage your bakery business seamlessly.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-brand-cream-light font-sans text-brand-espresso antialiased">
        <AuthProvider>
          <ToastProvider>
            <CartProvider>{children}</CartProvider>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
