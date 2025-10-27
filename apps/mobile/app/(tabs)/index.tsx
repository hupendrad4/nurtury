import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export default function HomeScreen() {
  const router = useRouter();

  const { data: banners } = useQuery({
    queryKey: ['banners'],
    queryFn: () => api.get('/banners').then((res) => res.data),
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then((res) => res.data),
  });

  const { data: featuredProducts } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => api.get('/products?limit=6').then((res) => res.data),
  });

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Hero Banner */}
      <View className="bg-primary p-6">
        <Text className="text-3xl font-bold text-white mb-2">QuoriumAgro</Text>
        <Text className="text-lg text-white opacity-90">We Grow Roots 🌱</Text>
      </View>

      {/* Banners */}
      {banners && banners.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="py-4">
          {banners.map((banner: any) => (
            <TouchableOpacity key={banner.id} className="mx-2">
              <Image
                source={{ uri: banner.image }}
                className="w-80 h-40 rounded-lg"
                resizeMode="cover"
              />
              <View className="absolute bottom-0 left-0 right-0 bg-black/50 p-3 rounded-b-lg">
                <Text className="text-white font-bold">{banner.title}</Text>
                <Text className="text-white text-sm">{banner.description}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Categories */}
      <View className="p-4">
        <Text className="text-2xl font-bold mb-4">Shop by Category</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories?.map((category: any) => (
            <TouchableOpacity
              key={category.id}
              className="mr-4 items-center"
              onPress={() => router.push(`/products?category=${category.id}`)}
            >
              <View className="w-20 h-20 bg-accent rounded-full items-center justify-center mb-2">
                <Text className="text-3xl">🌿</Text>
              </View>
              <Text className="text-sm text-center w-20">{category.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Featured Products */}
      <View className="p-4">
        <Text className="text-2xl font-bold mb-4">Featured Products</Text>
        <View className="flex-row flex-wrap justify-between">
          {featuredProducts?.data?.map((product: any) => (
            <TouchableOpacity
              key={product.id}
              className="w-[48%] mb-4 bg-white rounded-lg shadow-sm border border-gray-200"
              onPress={() => router.push(`/product/${product.id}`)}
            >
              <Image
                source={{ uri: JSON.parse(product.images)[0]?.url }}
                className="w-full h-40 rounded-t-lg"
                resizeMode="cover"
              />
              <View className="p-3">
                <Text className="font-semibold mb-1" numberOfLines={2}>
                  {product.name}
                </Text>
                <Text className="text-primary font-bold">₹{product.basePrice}</Text>
                {product.compareAtPrice && (
                  <Text className="text-gray-400 line-through text-sm">
                    ₹{product.compareAtPrice}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
