import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Categories | Nurtury',
  description: 'Browse our wide range of plant categories',
};

export default function CategoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="py-8">
        {children}
      </main>
    </div>
  );
}
