import { View, Text, ScrollView, Image, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { api } from '@/lib/api';

export default function ProductsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: products, isLoading } = useQuery({
    queryKey: ['products', searchQuery],
    queryFn: () =>
      api
        .get(searchQuery ? `/products/search?q=${searchQuery}` : '/products?limit=20')
        .then((res) => res.data),
  });

  return (
    <View className="flex-1 bg-white">
      {/* Search Bar */}
      <View className="p-4 bg-white border-b border-gray-200">
        <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2">
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            className="flex-1 ml-2"
            placeholder="Search plants, seeds, tools..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Products Grid */}
      <ScrollView className="flex-1 p-4">
        {isLoading ? (
          <Text className="text-center py-8">Loading products...</Text>
        ) : (
          <View className="flex-row flex-wrap justify-between">
            {products?.data?.map((product: any) => (
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
                  <View className="flex-row items-center mb-1">
                    <Ionicons name="star" size={14} color="#FFB800" />
                    <Text className="text-xs ml-1">
                      {product.rating} ({product.reviewCount})
                    </Text>
                  </View>
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
        )}
      </ScrollView>
    </View>
  );
}
