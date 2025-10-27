import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { api } from '@/lib/api';

export default function CartScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: cart, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: () => api.get('/cart').then((res) => res.data),
  });

  const updateQuantity = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      api.put(`/cart/items/${itemId}`, { quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  const removeItem = useMutation({
    mutationFn: (itemId: string) => api.delete(`/cart/items/${itemId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading cart...</Text>
      </View>
    );
  }

  if (!cart?.items || cart.items.length === 0) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Ionicons name="cart-outline" size={80} color="#ccc" />
        <Text className="text-xl font-bold mt-4 mb-2">Your cart is empty</Text>
        <Text className="text-gray-500 text-center mb-6">
          Add some plants to get started!
        </Text>
        <TouchableOpacity
          className="bg-primary px-6 py-3 rounded-lg"
          onPress={() => router.push('/products')}
        >
          <Text className="text-white font-semibold">Browse Products</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1 p-4">
        {cart.items.map((item: any) => (
          <View key={item.id} className="flex-row mb-4 bg-white rounded-lg shadow-sm p-3">
            <Image
              source={{ uri: JSON.parse(item.product.images)[0]?.url }}
              className="w-20 h-20 rounded-lg"
              resizeMode="cover"
            />
            <View className="flex-1 ml-3">
              <Text className="font-semibold mb-1" numberOfLines={2}>
                {item.product.name}
              </Text>
              <Text className="text-primary font-bold mb-2">₹{item.price}</Text>
              <View className="flex-row items-center">
                <TouchableOpacity
                  className="bg-gray-200 w-8 h-8 rounded items-center justify-center"
                  onPress={() =>
                    updateQuantity.mutate({ itemId: item.id, quantity: item.quantity - 1 })
                  }
                  disabled={item.quantity <= 1}
                >
                  <Ionicons name="remove" size={16} />
                </TouchableOpacity>
                <Text className="mx-4 font-semibold">{item.quantity}</Text>
                <TouchableOpacity
                  className="bg-gray-200 w-8 h-8 rounded items-center justify-center"
                  onPress={() =>
                    updateQuantity.mutate({ itemId: item.id, quantity: item.quantity + 1 })
                  }
                >
                  <Ionicons name="add" size={16} />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity onPress={() => removeItem.mutate(item.id)}>
              <Ionicons name="trash-outline" size={24} color="#ff4444" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Cart Summary */}
      <View className="border-t border-gray-200 p-4 bg-white">
        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-600">Subtotal</Text>
          <Text className="font-semibold">₹{cart.subtotal}</Text>
        </View>
        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-600">Tax</Text>
          <Text className="font-semibold">₹{cart.tax}</Text>
        </View>
        <View className="flex-row justify-between mb-4">
          <Text className="text-lg font-bold">Total</Text>
          <Text className="text-lg font-bold text-primary">₹{cart.total}</Text>
        </View>
        <TouchableOpacity
          className="bg-primary py-4 rounded-lg items-center"
          onPress={() => router.push('/checkout')}
        >
          <Text className="text-white font-bold text-lg">Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
