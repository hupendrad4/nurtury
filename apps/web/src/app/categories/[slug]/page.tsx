import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { ProductCard } from '@/components/products/ProductCard';
import categoriesData from '@/data/categories.json';

// Mock products data - in a real app, this would come from your API
const mockProducts = [
  {
    id: '1',
    name: 'Snake Plant',
    price: 29.99,
    image: 'https://cdn.shopify.com/s/files/1/0015/2522/5588/products/snake-plant_300x300.jpg',
    rating: 4.5,
    reviewCount: 128,
    category: 'indoor-plants',
  },
  // Add more mock products as needed
];

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const category = categoriesData.find((c) => c.slug === params.slug);
  
  if (!category) {
    return {
      title: 'Category Not Found',
    };
  }

  return {
    title: `${category.name} | Nurtury`,
    description: `Browse our collection of ${category.name}`,
  };
}

export default function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const category = categoriesData.find((c) => c.slug === params.slug);
  
  if (!category) {
    notFound();
  }

  // In a real app, you would fetch products for this category from your API
  const products = mockProducts.filter((p) => p.category === params.slug);

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
        <p className="text-muted-foreground">
          {products.length} products available
        </p>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No products found in this category</h3>
          <p className="text-muted-foreground mt-2">
            Check back later for new arrivals!
          </p>
        </div>
      )}
    </div>
  );
}

// Generate static paths for all categories
export async function generateStaticParams() {
  return categoriesData.map((category) => ({
    slug: category.slug,
  }));
}
