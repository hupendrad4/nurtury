import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/lib/store';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center p-4 bg-white">
        <Ionicons name="person-circle-outline" size={80} color="#ccc" />
        <Text className="text-xl font-bold mt-4 mb-2">Welcome to QuoriumAgro</Text>
        <Text className="text-gray-500 text-center mb-6">
          Sign in to access your orders and wishlist
        </Text>
        <TouchableOpacity
          className="bg-primary px-8 py-3 rounded-lg mb-3"
          onPress={() => router.push('/auth/login')}
        >
          <Text className="text-white font-semibold">Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/auth/register')}>
          <Text className="text-primary font-semibold">Create Account</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const menuItems = [
    { icon: 'receipt-outline', label: 'My Orders', route: '/orders' },
    { icon: 'heart-outline', label: 'Wishlist', route: '/wishlist' },
    { icon: 'location-outline', label: 'Addresses', route: '/addresses' },
    { icon: 'notifications-outline', label: 'Notifications', route: '/notifications' },
    { icon: 'help-circle-outline', label: 'Help & Support', route: '/support' },
    { icon: 'settings-outline', label: 'Settings', route: '/settings' },
  ];

  return (
    <ScrollView className="flex-1 bg-white">
      {/* User Info */}
      <View className="bg-primary p-6">
        <View className="flex-row items-center">
          <View className="w-16 h-16 bg-white rounded-full items-center justify-center">
            <Text className="text-2xl text-primary font-bold">
              {user.firstName[0]}
              {user.lastName[0]}
            </Text>
          </View>
          <View className="ml-4 flex-1">
            <Text className="text-white text-xl font-bold">
              {user.firstName} {user.lastName}
            </Text>
            <Text className="text-white opacity-90">{user.email}</Text>
          </View>
        </View>
      </View>

      {/* Menu Items */}
      <View className="p-4">
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            className="flex-row items-center py-4 border-b border-gray-200"
            onPress={() => router.push(item.route as any)}
          >
            <Ionicons name={item.icon as any} size={24} color="#1B5E20" />
            <Text className="flex-1 ml-4 text-base">{item.label}</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          className="flex-row items-center py-4 mt-4"
          onPress={() => {
            logout();
            router.replace('/');
          }}
        >
          <Ionicons name="log-out-outline" size={24} color="#ff4444" />
          <Text className="ml-4 text-base text-red-500 font-semibold">Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
