import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';
import { categories as seedCategories, products as seedProducts, banners as seedBanners, coupons as seedCoupons } from './seed-data';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding comprehensive database...');

  // Create admin user
  const adminPassword = await argon2.hash('Admin123!');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@quoriumagro.com' },
    update: {},
    create: {
      email: 'admin@quoriumagro.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      emailVerified: true,
    },
  });
  console.log('✅ Admin user created');

  // Create test customer
  const customerPassword = await argon2.hash('Customer123!');
  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      password: customerPassword,
      firstName: 'John',
      lastName: 'Doe',
      phone: '+919876543210',
      role: 'CUSTOMER',
      emailVerified: true,
    },
  });
  console.log('✅ Test customer created');

  // Create comprehensive categories
  console.log('📂 Creating categories...');
  const categoryMap = new Map<string, string>();

  for (const categoryData of seedCategories) {
    const parent = await prisma.category.upsert({
      where: { slug: categoryData.slug },
      update: {},
      create: {
        name: categoryData.name,
        slug: categoryData.slug,
        description: categoryData.description,
        image: categoryData.image,
        isActive: true,
      },
    });
    categoryMap.set(categoryData.slug, parent.id);

    // Create child categories
    if (categoryData.children) {
      for (const childData of categoryData.children) {
        const child = await prisma.category.upsert({
          where: { slug: childData.slug },
          update: {},
          create: {
            name: childData.name,
            slug: childData.slug,
            description: childData.description,
            parentId: parent.id,
            isActive: true,
          },
        });
        categoryMap.set(childData.slug, child.id);
      }
    }
  }
  console.log(`✅ Created ${categoryMap.size} categories`);

  // Create products
  console.log('🌿 Creating products...');
  for (const productData of seedProducts) {
    const categoryId = categoryMap.get(productData.categorySlug);
    if (!categoryId) {
      console.warn(`⚠️  Category not found for ${productData.categorySlug}, skipping ${productData.name}`);
      continue;
    }

    const product = await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {},
      create: {
        name: productData.name,
        slug: productData.slug,
        description: productData.description,
        categoryId,
        sku: productData.sku,
        basePrice: productData.basePrice,
        compareAtPrice: productData.compareAtPrice,
        images: productData.images,
        tags: productData.tags,
        careInstructions: productData.careInstructions,
        sunlightRequirement: productData.sunlightRequirement as any,
        waterRequirement: productData.waterRequirement as any,
        isMedicinal: productData.isMedicinal,
        isActive: true,
        rating: Math.floor(Math.random() * 2) + 4, // Random rating between 4-5
        reviewCount: Math.floor(Math.random() * 50) + 10,
      },
    });

    // Create variants
    if (productData.variants) {
      for (const variantData of productData.variants) {
        await prisma.productVariant.upsert({
          where: { sku: variantData.sku },
          update: {},
          create: {
            productId: product.id,
            name: variantData.name,
            sku: variantData.sku,
            price: variantData.price,
            compareAtPrice: variantData.compareAtPrice,
            inventory: variantData.inventory,
            isActive: true,
          },
        });
      }
    }
  }
  console.log(`✅ Created ${seedProducts.length} products`);

  // Create banners
  console.log('🎨 Creating banners...');
  for (const bannerData of seedBanners) {
    await prisma.banner.upsert({
      where: { id: bannerData.title.toLowerCase().replace(/\s+/g, '-') },
      update: {},
      create: {
        id: bannerData.title.toLowerCase().replace(/\s+/g, '-'),
        title: bannerData.title,
        description: bannerData.description,
        image: bannerData.image,
        link: bannerData.link,
        order: bannerData.order,
        isActive: true,
      },
    });
  }
  console.log(`✅ Created ${seedBanners.length} banners`);

  // Create coupons
  console.log('🎟️  Creating coupons...');
  for (const couponData of seedCoupons) {
    await prisma.coupon.upsert({
      where: { code: couponData.code },
      update: {},
      create: {
        code: couponData.code,
        description: couponData.description,
        discountType: couponData.discountType as any,
        discountValue: couponData.discountValue,
        minPurchaseAmount: couponData.minPurchaseAmount,
        maxDiscountAmount: couponData.maxDiscountAmount,
        usageLimit: couponData.usageLimit,
        validFrom: couponData.validFrom,
        validUntil: couponData.validUntil,
        isActive: true,
      },
    });
  }
  console.log(`✅ Created ${seedCoupons.length} coupons`);

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

      slug: 'medicinal-plants',
      description: 'Plants with therapeutic and healing properties',
      order: 2,
    },
    {
      name: 'Fruit Plants',
      slug: 'fruit-plants',
      description: 'Fruit-bearing trees and plants for your garden',
      order: 3,
    },
    {
      name: 'Vegetable Seeds',
      slug: 'vegetable-seeds',
      description: 'High-quality seeds for growing vegetables',
      order: 4,
    },
    {
      name: 'Flower Seeds',
      slug: 'flower-seeds',
      description: 'Beautiful flower seeds for colorful gardens',
      order: 5,
    },
    {
      name: 'Organic Fertilizers',
      slug: 'organic-fertilizers',
      description: 'Natural and organic fertilizers for healthy plant growth',
      order: 6,
    },
    {
      name: 'Chemical Fertilizers',
      slug: 'chemical-fertilizers',
      description: 'Balanced chemical fertilizers for optimal nutrition',
      order: 7,
    },
    {
      name: 'Pots & Planters',
      slug: 'pots-planters',
      description: 'Stylish pots and planters in various sizes and materials',
      order: 8,
    },
    {
      name: 'Gardening Tools',
      slug: 'gardening-tools',
      description: 'Essential tools for gardening enthusiasts',
      order: 9,
    },
    {
      name: 'Watering Equipment',
      slug: 'watering-equipment',
      description: 'Hoses, sprinklers, and watering systems',
      order: 10,
    },
    {
      name: 'Pest Control',
      slug: 'pest-control',
      description: 'Safe and effective pest control solutions',
      order: 11,
    },
    {
      name: 'Garden Decor',
      slug: 'garden-decor',
      description: 'Decorative items to enhance your garden',
      order: 12,
    },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log('✅ Categories created');

  // Get category references
  const ornamentalCategory = await prisma.category.findUnique({ where: { slug: 'ornamental-plants' } });
  const medicinalCategory = await prisma.category.findUnique({ where: { slug: 'medicinal-plants' } });
  const fruitCategory = await prisma.category.findUnique({ where: { slug: 'fruit-plants' } });
  const vegetableSeedsCategory = await prisma.category.findUnique({ where: { slug: 'vegetable-seeds' } });
  const flowerSeedsCategory = await prisma.category.findUnique({ where: { slug: 'flower-seeds' } });
  const organicFertilizerCategory = await prisma.category.findUnique({ where: { slug: 'organic-fertilizers' } });
  const chemicalFertilizerCategory = await prisma.category.findUnique({ where: { slug: 'chemical-fertilizers' } });
  const potsCategory = await prisma.category.findUnique({ where: { slug: 'pots-planters' } });
  const toolsCategory = await prisma.category.findUnique({ where: { slug: 'gardening-tools' } });
  const wateringCategory = await prisma.category.findUnique({ where: { slug: 'watering-equipment' } });
  const pestCategory = await prisma.category.findUnique({ where: { slug: 'pest-control' } });
  const decorCategory = await prisma.category.findUnique({ where: { slug: 'garden-decor' } });

  // Create comprehensive products
  const products = [
    // Ornamental Plants
    {
      name: 'Money Plant (Golden)',
      slug: 'money-plant-golden',
      description: 'Beautiful golden money plant perfect for indoors. Easy to care for and brings good luck.',
      categoryId: ornamentalCategory?.id,
      sku: 'MP-001',
      basePrice: 299,
      compareAtPrice: 399,
      taxRate: 5,
      images: JSON.stringify([
        { id: '1', url: 'https://images.unsplash.com/photo-1593691509543-c55fb32d8de5', alt: 'Money Plant Golden', order: 0 }
      ]),
      tags: ['indoor', 'low-maintenance', 'air-purifier'],
      careInstructions: 'Water when top soil is dry. Keep in indirect sunlight.',
      sunlightRequirement: 'PARTIAL_SHADE' as any,
      waterRequirement: 'MODERATE' as any,
      isActive: true,
      rating: 4.5,
      reviewCount: 45,
    },
    {
      name: 'Snake Plant',
      slug: 'snake-plant',
      description: 'Hardy snake plant that thrives in low light conditions. Excellent air purifier.',
      categoryId: ornamentalCategory?.id,
      sku: 'SP-001',
      basePrice: 449,
      taxRate: 5,
      images: JSON.stringify([
        { id: '1', url: 'https://images.unsplash.com/photo-1593691509543-c55fb32d8de5', alt: 'Snake Plant', order: 0 }
      ]),
      tags: ['indoor', 'low-light', 'air-purifier'],
      careInstructions: 'Water sparingly, very drought tolerant.',
      sunlightRequirement: 'FULL_SHADE' as any,
      waterRequirement: 'LOW' as any,
      isActive: true,
      rating: 4.7,
      reviewCount: 32,
    },
    {
      name: 'Peace Lily',
      slug: 'peace-lily',
      description: 'Elegant peace lily with beautiful white flowers. Perfect for home decoration.',
      categoryId: ornamentalCategory?.id,
      sku: 'PL-001',
      basePrice: 599,
      compareAtPrice: 799,
      taxRate: 5,
      images: JSON.stringify([
        { id: '1', url: 'https://images.unsplash.com/photo-1593691509543-c55fb32d8de5', alt: 'Peace Lily', order: 0 }
      ]),
      tags: ['flowering', 'indoor', 'elegant'],
      careInstructions: 'Keep soil moist, avoid direct sunlight.',
      sunlightRequirement: 'PARTIAL_SHADE' as any,
      waterRequirement: 'HIGH' as any,
      isActive: true,
      rating: 4.6,
      reviewCount: 28,
    },

    // Medicinal Plants
    {
      name: 'Aloe Vera',
      slug: 'aloe-vera',
      description: 'Medicinal aloe vera plant with healing properties. Great for skin care and burns.',
      categoryId: medicinalCategory?.id,
      sku: 'AV-001',
      basePrice: 249,
      taxRate: 5,
      images: JSON.stringify([
        { id: '1', url: 'https://images.unsplash.com/photo-1596548438137-d51ea5c83ca5', alt: 'Aloe Vera', order: 0 }
      ]),
      tags: ['medicinal', 'healing', 'skin-care'],
      careInstructions: 'Water sparingly, prefers dry conditions.',
      sunlightRequirement: 'FULL_SUN' as any,
      waterRequirement: 'LOW' as any,
      isMedicinal: true,
      isActive: true,
      rating: 4.8,
      reviewCount: 67,
    },
    {
      name: 'Tulsi (Holy Basil)',
      slug: 'tulsi-holy-basil',
      description: 'Sacred Tulsi plant with medicinal properties. Boosts immunity and reduces stress.',
      categoryId: medicinalCategory?.id,
      sku: 'TB-001',
      basePrice: 199,
      taxRate: 5,
      images: JSON.stringify([
        { id: '1', url: 'https://images.unsplash.com/photo-1596548438137-d51ea5c83ca5', alt: 'Tulsi Holy Basil', order: 0 }
      ]),
      tags: ['medicinal', 'sacred', 'immunity-booster'],
      careInstructions: 'Regular watering, plenty of sunlight.',
      sunlightRequirement: 'FULL_SUN' as any,
      waterRequirement: 'MODERATE' as any,
      isMedicinal: true,
      isActive: true,
      rating: 4.9,
      reviewCount: 89,
    },
    {
      name: 'Neem Tree',
      slug: 'neem-tree',
      description: 'Neem tree with powerful medicinal properties. Natural antibacterial and antifungal.',
      categoryId: medicinalCategory?.id,
      sku: 'NT-001',
      basePrice: 899,
      taxRate: 5,
      images: JSON.stringify([
        { id: '1', url: 'https://images.unsplash.com/photo-1596548438137-d51ea5c83ca5', alt: 'Neem Tree', order: 0 }
      ]),
      tags: ['medicinal', 'antibacterial', 'tree'],
      careInstructions: 'Full sun, moderate watering.',
      sunlightRequirement: 'FULL_SUN' as any,
      waterRequirement: 'MODERATE' as any,
      isMedicinal: true,
      isActive: true,
      rating: 4.7,
      reviewCount: 34,
    },

    // Fruit Plants
    {
      name: 'Lemon Tree',
      slug: 'lemon-tree',
      description: 'Dwarf lemon tree perfect for balcony gardens. Produces fresh lemons year-round.',
      categoryId: fruitCategory?.id,
      sku: 'LT-001',
      basePrice: 1299,
      compareAtPrice: 1599,
      taxRate: 5,
      images: JSON.stringify([
        { id: '1', url: 'https://images.unsplash.com/photo-1596548438137-d51ea5c83ca5', alt: 'Lemon Tree', order: 0 }
      ]),
      tags: ['fruit', 'balcony', 'dwarf'],
      careInstructions: 'Full sun, regular watering and fertilizing.',
      sunlightRequirement: 'FULL_SUN' as any,
      waterRequirement: 'HIGH' as any,
      isActive: true,
      rating: 4.4,
      reviewCount: 23,
    },
    {
      name: 'Guava Plant',
      slug: 'guava-plant',
      description: 'Tropical guava plant that produces sweet and juicy fruits.',
      categoryId: fruitCategory?.id,
      sku: 'GP-001',
      basePrice: 899,
      taxRate: 5,
      images: JSON.stringify([
        { id: '1', url: 'https://images.unsplash.com/photo-1596548438137-d51ea5c83ca5', alt: 'Guava Plant', order: 0 }
      ]),
      tags: ['fruit', 'tropical', 'sweet'],
      careInstructions: 'Full sun, moderate watering.',
      sunlightRequirement: 'FULL_SUN' as any,
      waterRequirement: 'MODERATE' as any,
      isActive: true,
      rating: 4.5,
      reviewCount: 18,
    },

    // Vegetable Seeds
    {
      name: 'Tomato Seeds (Cherry)',
      slug: 'tomato-seeds-cherry',
      description: 'High-yield cherry tomato seeds. Perfect for home gardening.',
      categoryId: vegetableSeedsCategory?.id,
      sku: 'TS-001',
      basePrice: 99,
      taxRate: 5,
      images: JSON.stringify([
        { id: '1', url: 'https://images.unsplash.com/photo-1596548438137-d51ea5c83ca5', alt: 'Tomato Seeds', order: 0 }
      ]),
      tags: ['seeds', 'vegetable', 'cherry-tomato'],
      careInstructions: 'Sow in spring, full sun required.',
      sunlightRequirement: 'FULL_SUN' as any,
      waterRequirement: 'MODERATE' as any,
      isActive: true,
      rating: 4.3,
      reviewCount: 156,
    },
    {
      name: 'Spinach Seeds',
      slug: 'spinach-seeds',
      description: 'Nutritious spinach seeds for healthy green vegetables.',
      categoryId: vegetableSeedsCategory?.id,
      sku: 'SS-001',
      basePrice: 79,
      taxRate: 5,
      images: JSON.stringify([
        { id: '1', url: 'https://images.unsplash.com/photo-1596548438137-d51ea5c83ca5', alt: 'Spinach Seeds', order: 0 }
      ]),
      tags: ['seeds', 'vegetable', 'nutritious'],
      careInstructions: 'Cool season crop, partial shade.',
      sunlightRequirement: 'PARTIAL_SHADE' as any,
      waterRequirement: 'MODERATE' as any,
      isActive: true,
      rating: 4.4,
      reviewCount: 98,
    },

    // Flower Seeds
    {
      name: 'Marigold Seeds',
      slug: 'marigold-seeds',
      description: 'Vibrant marigold seeds for beautiful flower beds.',
      categoryId: flowerSeedsCategory?.id,
      sku: 'MS-001',
      basePrice: 89,
      taxRate: 5,
      images: JSON.stringify([
        { id: '1', url: 'https://images.unsplash.com/photo-1596548438137-d51ea5c83ca5', alt: 'Marigold Seeds', order: 0 }
      ]),
      tags: ['seeds', 'flowers', 'colorful'],
      careInstructions: 'Full sun, well-drained soil.',
      sunlightRequirement: 'FULL_SUN' as any,
      waterRequirement: 'MODERATE' as any,
      isActive: true,
      rating: 4.6,
      reviewCount: 203,
    },
    {
      name: 'Sunflower Seeds',
      slug: 'sunflower-seeds',
      description: 'Giant sunflower seeds that grow into impressive flowers.',
      categoryId: flowerSeedsCategory?.id,
      sku: 'SU-001',
      basePrice: 149,
      taxRate: 5,
      images: JSON.stringify([
        { id: '1', url: 'https://images.unsplash.com/photo-1596548438137-d51ea5c83ca5', alt: 'Sunflower Seeds', order: 0 }
      ]),
      tags: ['seeds', 'flowers', 'giant'],
      careInstructions: 'Full sun, rich soil.',
      sunlightRequirement: 'FULL_SUN' as any,
      waterRequirement: 'MODERATE' as any,
      isActive: true,
      rating: 4.8,
      reviewCount: 167,
    },

    // Organic Fertilizers
    {
      name: 'Organic Compost',
      slug: 'organic-compost',
      description: 'Rich organic compost made from natural ingredients.',
      categoryId: organicFertilizerCategory?.id,
      sku: 'OC-001',
      basePrice: 399,
      taxRate: 5,
      images: JSON.stringify([
        { id: '1', url: 'https://images.unsplash.com/photo-1596548438137-d51ea5c83ca5', alt: 'Organic Compost', order: 0 }
      ]),
      tags: ['organic', 'compost', 'natural'],
      careInstructions: 'Mix with soil before planting.',
      isActive: true,
      rating: 4.5,
      reviewCount: 78,
    },
    {
      name: 'Vermicompost',
      slug: 'vermicompost',
      description: 'Premium vermicompost rich in nutrients and beneficial microbes.',
      categoryId: organicFertilizerCategory?.id,
      sku: 'VC-001',
      basePrice: 599,
      taxRate: 5,
      images: JSON.stringify([
        { id: '1', url: 'https://images.unsplash.com/photo-1596548438137-d51ea5c83ca5', alt: 'Vermicompost', order: 0 }
      ]),
      tags: ['organic', 'vermicompost', 'microbes'],
      careInstructions: 'Apply 2-3 times per growing season.',
      isActive: true,
      rating: 4.7,
      reviewCount: 45,
    },

    // Chemical Fertilizers
    {
      name: 'NPK 20-20-20',
      slug: 'npk-20-20-20',
      description: 'Balanced NPK fertilizer for all-round plant nutrition.',
      categoryId: chemicalFertilizerCategory?.id,
      sku: 'NPK-001',
      basePrice: 299,
      taxRate: 5,
      images: JSON.stringify([
        { id: '1', url: 'https://images.unsplash.com/photo-1596548438137-d51ea5c83ca5', alt: 'NPK Fertilizer', order: 0 }
      ]),
      tags: ['chemical', 'balanced', 'all-purpose'],
      careInstructions: 'Dilute as per instructions, apply every 2 weeks.',
      isActive: true,
      rating: 4.3,
      reviewCount: 123,
    },

    // Pots & Planters
    {
      name: 'Ceramic Pot (Medium)',
      slug: 'ceramic-pot-medium',
      description: 'Beautiful ceramic pot in medium size, perfect for indoor plants.',
      categoryId: potsCategory?.id,
      sku: 'CP-001',
      basePrice: 799,
      compareAtPrice: 999,
      taxRate: 18,
      images: JSON.stringify([
        { id: '1', url: 'https://images.unsplash.com/photo-1596548438137-d51ea5c83ca5', alt: 'Ceramic Pot', order: 0 }
      ]),
      tags: ['ceramic', 'medium', 'indoor'],
      isActive: true,
      rating: 4.6,
      reviewCount: 89,
    },
    {
      name: 'Terracotta Planter Set',
      slug: 'terracotta-planter-set',
      description: 'Set of 3 terracotta planters in different sizes.',
      categoryId: potsCategory?.id,
      sku: 'TP-001',
      basePrice: 1299,
      taxRate: 18,
      images: JSON.stringify([
        { id: '1', url: 'https://images.unsplash.com/photo-1596548438137-d51ea5c83ca5', alt: 'Terracotta Planters', order: 0 }
      ]),
      tags: ['terracotta', 'set', 'outdoor'],
      isActive: true,
      rating: 4.4,
      reviewCount: 67,
    },

    // Gardening Tools
    {
      name: 'Garden Tool Set (5 pieces)',
      slug: 'garden-tool-set-5-pieces',
      description: 'Complete garden tool set including trowel, fork, pruner, and more.',
      categoryId: toolsCategory?.id,
      sku: 'GT-001',
      basePrice: 899,
      compareAtPrice: 1199,
      taxRate: 18,
      images: JSON.stringify([
        { id: '1', url: 'https://images.unsplash.com/photo-1596548438137-d51ea5c83ca5', alt: 'Garden Tool Set', order: 0 }
      ]),
      tags: ['tools', 'set', 'complete'],
      isActive: true,
      rating: 4.5,
      reviewCount: 145,
    },
    {
      name: 'Pruning Shears',
      slug: 'pruning-shears',
      description: 'Professional-grade pruning shears for clean cuts.',
      categoryId: toolsCategory?.id,
      sku: 'PS-001',
      basePrice: 599,
      taxRate: 18,
      images: JSON.stringify([
        { id: '1', url: 'https://images.unsplash.com/photo-1596548438137-d51ea5c83ca5', alt: 'Pruning Shears', order: 0 }
      ]),
      tags: ['tools', 'pruning', 'professional'],
      isActive: true,
      rating: 4.7,
      reviewCount: 89,
    },

    // Watering Equipment
    {
      name: 'Garden Hose (50ft)',
      slug: 'garden-hose-50ft',
      description: 'Durable garden hose with spray nozzle, 50 feet length.',
      categoryId: wateringCategory?.id,
      sku: 'GH-001',
      basePrice: 1299,
      taxRate: 18,
      images: JSON.stringify([
        { id: '1', url: 'https://images.unsplash.com/photo-1596548438137-d51ea5c83ca5', alt: 'Garden Hose', order: 0 }
      ]),
      tags: ['hose', 'watering', 'durable'],
      isActive: true,
      rating: 4.3,
      reviewCount: 78,
    },
    {
      name: 'Sprinkler System',
      slug: 'sprinkler-system',
      description: 'Automatic sprinkler system for lawn and garden irrigation.',
      categoryId: wateringCategory?.id,
      sku: 'SP-001',
      basePrice: 2499,
      compareAtPrice: 2999,
      taxRate: 18,
      images: JSON.stringify([
        { id: '1', url: 'https://images.unsplash.com/photo-1596548438137-d51ea5c83ca5', alt: 'Sprinkler System', order: 0 }
      ]),
      tags: ['sprinkler', 'automatic', 'irrigation'],
      isActive: true,
      rating: 4.2,
      reviewCount: 34,
    },

    // Pest Control
    {
      name: 'Organic Neem Oil',
      slug: 'organic-neem-oil',
      description: 'Natural neem oil spray for pest control. Safe for plants and environment.',
      categoryId: pestCategory?.id,
      sku: 'NO-001',
      basePrice: 299,
      taxRate: 5,
      images: JSON.stringify([
        { id: '1', url: 'https://images.unsplash.com/photo-1596548438137-d51ea5c83ca5', alt: 'Neem Oil', order: 0 }
      ]),
      tags: ['organic', 'neem', 'pest-control'],
      careInstructions: 'Spray every 7-10 days.',
      isActive: true,
      rating: 4.6,
      reviewCount: 156,
    },
    {
      name: 'Insect Traps Set',
      slug: 'insect-traps-set',
      description: 'Set of yellow sticky traps for flying insects.',
      categoryId: pestCategory?.id,
      sku: 'IT-001',
      basePrice: 199,
      taxRate: 5,
      images: JSON.stringify([
        { id: '1', url: 'https://images.unsplash.com/photo-1596548438137-d51ea5c83ca5', alt: 'Insect Traps', order: 0 }
      ]),
      tags: ['traps', 'insects', 'non-toxic'],
      isActive: true,
      rating: 4.4,
      reviewCount: 89,
    },

    // Garden Decor
    {
      name: 'Garden Gnome Set',
      slug: 'garden-gnome-set',
      description: 'Adorable garden gnome set to add charm to your garden.',
      categoryId: decorCategory?.id,
      sku: 'GG-001',
      basePrice: 899,
      taxRate: 18,
      images: JSON.stringify([
        { id: '1', url: 'https://images.unsplash.com/photo-1596548438137-d51ea5c83ca5', alt: 'Garden Gnomes', order: 0 }
      ]),
      tags: ['decor', 'gnomes', 'charming'],
      isActive: true,
      rating: 4.5,
      reviewCount: 67,
    },
    {
      name: 'Solar Garden Lights',
      slug: 'solar-garden-lights',
      description: 'Solar-powered garden lights for beautiful evening ambiance.',
      categoryId: decorCategory?.id,
      sku: 'SL-001',
      basePrice: 1499,
      compareAtPrice: 1999,
      taxRate: 18,
      images: JSON.stringify([
        { id: '1', url: 'https://images.unsplash.com/photo-1596548438137-d51ea5c83ca5', alt: 'Solar Lights', order: 0 }
      ]),
      tags: ['solar', 'lights', 'ambiance'],
      isActive: true,
      rating: 4.3,
      reviewCount: 123,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }
  console.log(`✅ Created ${products.length} comprehensive products`);

  // Create product variants for all products
  const createdProducts = await prisma.product.findMany({
    select: { id: slug },
  });

  for (const product of createdProducts) {
    // Generate variants based on product type
    const variants = [];

    if (product.slug.includes('seeds')) {
      // Seeds typically have one variant (packet)
      variants.push({
        productId: product.id,
        name: 'Standard Packet',
        sku: `${product.slug.toUpperCase().replace('-', '-')}-001`,
        price: products.find(p => p.slug === product.slug)?.basePrice || 99,
        inventory: Math.floor(Math.random() * 100) + 20,
        isActive: true,
      });
    } else if (product.slug.includes('tree') || product.slug.includes('plant')) {
      // Plants and trees have size variants
      const basePrice = products.find(p => p.slug === product.slug)?.basePrice || 299;
      variants.push(
        {
          productId: product.id,
          name: 'Small',
          sku: `${product.slug.toUpperCase().replace('-', '-')}-S`,
          price: basePrice,
          inventory: Math.floor(Math.random() * 50) + 10,
          isActive: true,
        },
        {
          productId: product.id,
          name: 'Medium',
          sku: `${product.slug.toUpperCase().replace('-', '-')}-M`,
          price: basePrice * 1.5,
          inventory: Math.floor(Math.random() * 30) + 5,
          isActive: true,
        },
        {
          productId: product.id,
          name: 'Large',
          sku: `${product.slug.toUpperCase().replace('-', '-')}-L`,
          price: basePrice * 2,
          inventory: Math.floor(Math.random() * 15) + 2,
          isActive: true,
        }
      );
    } else {
      // Tools, fertilizers, decor have single variants
      variants.push({
        productId: product.id,
        name: 'Standard',
        sku: `${product.slug.toUpperCase().replace('-', '-')}-001`,
        price: products.find(p => p.slug === product.slug)?.basePrice || 199,
        inventory: Math.floor(Math.random() * 100) + 20,
        isActive: true,
      });
    }

    await prisma.productVariant.createMany({
      data: variants,
    });
  }

  console.log('✅ Product variants created for all products');

  console.log('\n🎉 Comprehensive seeding completed successfully!\n');
  console.log('📧 Admin credentials:');
  console.log('   Email: admin@quoriumagro.com');
  console.log('   Password: Admin123!\n');
  console.log('📧 Test customer credentials:');
  console.log('   Email: customer@example.com');
  console.log('   Password: Customer123!\n');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
