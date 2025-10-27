import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CartDropdown } from '@/components/CartDropdown';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'QuoriumAgro - We Grow Roots',
  description: 'Your trusted partner in gardening. Shop plants, seeds, tools, and more.',
  keywords: 'plants, nursery, gardening, seeds, fertilizers, medicinal plants',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <CartDropdown />
          </div>
        </Providers>
      </body>
    </html>
  );
}
