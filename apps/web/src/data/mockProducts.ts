export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  isOrganic?: boolean;
  isMedicinal?: boolean;
  category: string;
  categorySlug: string;
  images: string[];
  details: {
    light: string;
    water: string;
    difficulty: string;
  };
}

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Monstera Deliciosa',
    slug: 'monstera-deliciosa',
    description: 'A popular tropical houseplant with large, glossy leaves that develop unique holes as they mature.',
    price: 34.99,
    originalPrice: 39.99,
    discount: 13,
    rating: 4.8,
    reviewCount: 124,
    inStock: true,
    isNew: true,
    isBestSeller: true,
    isOrganic: true,
    category: 'Indoor Plants',
    categorySlug: 'indoor-plants',
    images: [
      'https://images.unsplash.com/photo-1600222059114-8d7e3dca5de8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1605152276897-4f618f831968?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    details: {
      light: 'Bright, indirect light',
      water: 'Weekly, allow soil to dry between waterings',
      difficulty: 'Easy'
    }
  },
  {
    id: '2',
    name: 'Snake Plant',
    slug: 'snake-plant',
    description: 'An extremely hardy plant with tall, upright leaves that are perfect for beginners.',
    price: 24.99,
    originalPrice: 29.99,
    discount: 17,
    rating: 4.7,
    reviewCount: 98,
    inStock: true,
    isBestSeller: true,
    isMedicinal: true,
    category: 'Indoor Plants',
    categorySlug: 'indoor-plants',
    images: [
      'https://images.unsplash.com/photo-1593482892291-505b833bca51?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1593482777230-9924e4c333b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1602431525111-d4e1d2a01947?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    details: {
      light: 'Low to bright indirect light',
      water: 'Every 2-3 weeks',
      difficulty: 'Very Easy'
    }
  },
  {
    id: '3',
    name: 'Fiddle Leaf Fig',
    slug: 'fiddle-leaf-fig',
    description: 'A statement plant with large, violin-shaped leaves that add drama to any space.',
    price: 49.99,
    rating: 4.6,
    reviewCount: 87,
    inStock: true,
    isOrganic: true,
    category: 'Indoor Plants',
    categorySlug: 'indoor-plants',
    images: [
      'https://images.unsplash.com/photo-1606787366850-de6330128bfc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1607748862156-7c548e7e98f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1607748851687-ba9a10438621?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    details: {
      light: 'Bright, indirect light',
      water: 'Weekly, keep soil slightly moist',
      difficulty: 'Moderate'
    }
  },
  {
    id: '4',
    name: 'Peace Lily',
    slug: 'peace-lily',
    description: 'Elegant plant with dark green leaves and beautiful white flowers that purify the air.',
    price: 29.99,
    rating: 4.5,
    reviewCount: 112,
    inStock: true,
    isOrganic: true,
    isMedicinal: true,
    category: 'Flowering Plants',
    categorySlug: 'flowering-plants',
    images: [
      'https://images.unsplash.com/photo-1593482776120-7bdb3332ce9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1593482776174-04defe9a7f67?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1601590033829-26a0f4b2e9e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    details: {
      light: 'Low to medium indirect light',
      water: 'When top inch of soil is dry',
      difficulty: 'Easy'
    }
  },
  {
    id: '5',
    name: 'Aloe Vera',
    slug: 'aloe-vera',
    description: 'A succulent with medicinal properties, great for sunburns and skin care.',
    price: 19.99,
    rating: 4.7,
    reviewCount: 156,
    inStock: true,
    isBestSeller: true,
    isMedicinal: true,
    category: 'Succulents',
    categorySlug: 'succulents',
    images: [
      'https://images.unsplash.com/photo-1593482776330-7b9dce3c358a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1593482776330-7b9dce3c358a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1593482776330-7b9dce3c358a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    details: {
      light: 'Bright, indirect light',
      water: 'Every 3-4 weeks',
      difficulty: 'Very Easy'
    }
  },
  {
    id: '6',
    name: 'String of Pearls',
    slug: 'string-of-pearls',
    description: 'A unique trailing succulent with small, bead-like leaves that cascade beautifully.',
    price: 27.99,
    rating: 4.4,
    reviewCount: 78,
    inStock: true,
    isNew: true,
    isOrganic: true,
    category: 'Succulents',
    categorySlug: 'succulents',
    images: [
      'https://images.unsplash.com/photo-1593482892291-505b833bca51?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1593482777230-9924e4c333b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1602431525111-d4e1d2a01947?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    details: {
      light: 'Bright, indirect light',
      water: 'Every 2-3 weeks',
      difficulty: 'Moderate'
    }
  },
  {
    id: '7',
    name: 'Rubber Plant',
    slug: 'rubber-plant',
    description: 'A hardy plant with large, glossy leaves that can grow quite tall indoors.',
    price: 39.99,
    rating: 4.5,
    reviewCount: 92,
    inStock: true,
    isOrganic: true,
    category: 'Indoor Plants',
    categorySlug: 'indoor-plants',
    images: [
      'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1593482777230-9924e4c333b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1605152276897-4f618f831968?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    details: {
      light: 'Medium to bright indirect light',
      water: 'When top inch of soil is dry',
      difficulty: 'Easy'
    }
  },
  {
    id: '8',
    name: 'Bird of Paradise',
    slug: 'bird-of-paradise',
    description: 'A tropical plant with large, banana-like leaves that can grow quite large indoors.',
    price: 59.99,
    rating: 4.6,
    reviewCount: 67,
    inStock: true,
    isNew: true,
    category: 'Tropical Plants',
    categorySlug: 'tropical-plants',
    images: [
      'https://images.unsplash.com/photo-1605152276897-4f618f831968?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1593482892291-505b833bca51?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600222059114-8d7e3dca5de8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    details: {
      light: 'Bright, direct light',
      water: 'Weekly, keep soil moist',
      difficulty: 'Moderate'
    }
  }
];

export const getProducts = async (): Promise<Product[]> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockProducts);
    }, 500);
  });
};

export const getProductBySlug = async (slug: string): Promise<Product | undefined> => {
  const products = await getProducts();
  return products.find(product => product.slug === slug);
};

export const getRelatedProducts = async (category: string, currentProductId: string): Promise<Product[]> => {
  const products = await getProducts();
  return products
    .filter(p => p.categorySlug === category && p.id !== currentProductId)
    .slice(0, 4);
};
