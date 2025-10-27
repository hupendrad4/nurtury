'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Breadcrumb } from '@/components/Breadcrumb';
import { indianStates, indianStatesWithCities, IndianState } from '@/lib/locations';

interface AddressFormData {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: IndianState | '';
  postalCode: string;
  country: string;
  isDefault: boolean;
}

interface Address extends AddressFormData {
  id: string;
}

interface Cart {
  id: string;
  items: any[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'RAZORPAY' | 'STRIPE' | 'COD'>('RAZORPAY');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState<AddressFormData>({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    isDefault: false,
  });
  
  const [cities, setCities] = useState<readonly string[]>([]);
  
  // Update cities when state changes
  useEffect(() => {
    if (addressForm.state) {
      // Convert readonly array to mutable array
      const stateCities = [...(indianStatesWithCities[addressForm.state] || [])];
      setCities(stateCities);
      // Reset city when state changes
      setAddressForm(prev => ({ ...prev, city: '' }));
    } else {
      setCities([]);
    }
  }, [addressForm.state]);

  const { data: cart } = useQuery<Cart>({
    queryKey: ['cart'],
    queryFn: () => api.get('/cart').then((res) => res.data),
  });

  const { data: addresses } = useQuery<Address[]>({
    queryKey: ['user', 'addresses'],
    queryFn: () => api.get('/users/me/addresses').then((res) => res.data),
  });

  const createAddressMutation = useMutation({
    mutationFn: async (data: AddressFormData) => {
      try {
        const response = await api.post('/users/me/addresses', data);
        return response.data;
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Failed to save address';
        console.error('API Error:', error.response?.data || error);
        throw new Error(errorMessage);
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['user', 'addresses'] });
      setSelectedAddressId(data.id);
      setShowAddressForm(false);
      setAddressForm({
        fullName: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India',
        isDefault: false,
      });
      toast.success('Address saved successfully');
    },
    onError: (error: Error) => {
      console.error('Error saving address:', error);
      toast.error(error.message);
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: async (data: { shippingAddressId: string; paymentMethod: string }) => {
      try {
        const response = await api.post('/orders', data);
        return response.data;
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Failed to create order';
        console.error('Order creation error:', error.response?.data || error);
        throw new Error(errorMessage);
      }
    },
    onSuccess: (order) => {
      if (paymentMethod === 'COD') {
        router.push(`/orders/${order.id}/success`);
      } else if (paymentMethod === 'RAZORPAY') {
        initiateRazorpayPayment(order);
      } else if (paymentMethod === 'STRIPE') {
        router.push(`/checkout/stripe?orderId=${order.id}`);
      }
    },
    onError: (error: Error) => {
      console.error('Order creation failed:', error);
      toast.error(`Order failed: ${error.message}`);
    },
  });

  const initiateRazorpayPayment = (order: any) => {
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.total * 100,
      currency: 'INR',
      name: 'Nurtury',
      description: `Order #${order.orderNumber}`,
      order_id: order.razorpayOrderId,
      handler: async (response: any) => {
        try {
          await api.post(`/orders/${order.id}/verify-payment`, {
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
          });
          router.push(`/orders/${order.id}/success`);
        } catch (error) {
          alert('Payment verification failed. Please contact support.');
        }
      },
      prefill: {
        name: addresses?.find((a) => a.id === selectedAddressId)?.fullName,
        contact: addresses?.find((a) => a.id === selectedAddressId)?.phone,
      },
      theme: {
        color: '#22c55e',
      },
    };

    const razorpay = new (window as any).Razorpay(options);
    razorpay.open();
  };

  const handlePlaceOrder = () => {
    if (!selectedAddressId) {
      toast.error('Please select a delivery address');
      return;
    }

    if (!paymentMethod) {
      toast.error('Please select a payment method');
      return;
    }

    // Show loading state
    toast.loading('Creating your order...');
    
    createOrderMutation.mutate({
      shippingAddressId: selectedAddressId,
      paymentMethod,
    }, {
      onSettled: () => {
        // Dismiss any loading toasts
        toast.dismiss();
      }
    });
  };

  const validateAddressForm = (): boolean => {
    const requiredFields: (keyof AddressFormData)[] = [
      'fullName',
      'phone',
      'addressLine1',
      'city',
      'state',
      'postalCode'
    ];

    for (const field of requiredFields) {
      if (!addressForm[field]) {
        toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }

    // Validate phone number format (basic validation)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(addressForm.phone)) {
      toast.error('Please enter a valid 10-digit phone number');
      return false;
    }

    // Validate postal code (basic validation for Indian pincodes)
    const postalCodeRegex = /^[1-9][0-9]{5}$/;
    if (!postalCodeRegex.test(addressForm.postalCode)) {
      toast.error('Please enter a valid 6-digit postal code');
      return false;
    }

    return true;
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateAddressForm()) {
      return;
    }
    
    try {
      const addressData = {
        ...addressForm,
        phone: String(addressForm.phone).trim(),
        isDefault: Boolean(addressForm.isDefault)
      };
      
      await createAddressMutation.mutateAsync(addressData);
    } catch (error) {
      // Error is already handled in the mutation's onError
    }
  };

  if (!cart || cart.items.length === 0) {
    router.push('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Load Razorpay Script */}
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />

      <div className="container mx-auto px-4 py-8">
        <Breadcrumb items={[{ label: 'Cart', href: '/cart' }, { label: 'Checkout' }]} />

        <h1 className="text-3xl font-bold mb-8 mt-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Address & Payment */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address Section */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Delivery Address</h2>
                <button
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="text-primary hover:text-primary-dark font-medium"
                >
                  + Add New Address
                </button>
              </div>

              {/* Address Form */}
              {showAddressForm && (
                <form onSubmit={handleAddressSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={addressForm.fullName}
                        onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={addressForm.phone}
                        onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1">Address Line 1 *</label>
                      <input
                        type="text"
                        required
                        value={addressForm.addressLine1}
                        onChange={(e) => setAddressForm({ ...addressForm, addressLine1: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1">Address Line 2</label>
                      <input
                        type="text"
                        value={addressForm.addressLine2}
                        onChange={(e) => setAddressForm({ ...addressForm, addressLine2: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">State *</label>
                      <select
                        required
                        value={addressForm.state}
                        onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value as IndianState })}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary bg-white"
                      >
                        <option value="">Select State</option>
                        {indianStates.map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">City *</label>
                      <select
                        required
                        value={addressForm.city}
                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                        disabled={!addressForm.state}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary bg-white disabled:bg-gray-50 disabled:cursor-not-allowed"
                      >
                        <option value="">Select City</option>
                        {cities.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Postal Code *</label>
                      <input
                        type="text"
                        required
                        value={addressForm.postalCode}
                        onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isDefault"
                        checked={addressForm.isDefault}
                        onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-700">
                        Set as default address
                      </label>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button
                      type="submit"
                      disabled={createAddressMutation.isPending}
                      className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50"
                    >
                      Save Address
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddressForm(false)}
                      className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Saved Addresses */}
              <div className="space-y-3">
                {addresses?.map((address) => (
                  <label
                    key={address.id}
                    className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      selectedAddressId === address.id
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      value={address.id}
                      checked={selectedAddressId === address.id}
                      onChange={() => setSelectedAddressId(address.id)}
                      className="mr-3"
                    />
                    <div className="inline-block">
                      <div className="font-semibold">
                        {address.fullName}
                        {address.isDefault && (
                          <span className="ml-2 text-xs bg-primary text-white px-2 py-1 rounded">
                            Default
                          </span>
                        )}
                      </div>
                      <div className="text-gray-600 text-sm mt-1">
                        {address.addressLine1}, {address.addressLine2 && `${address.addressLine2}, `}
                        {address.city}, {address.state} - {address.postalCode}
                      </div>
                      <div className="text-gray-600 text-sm">Phone: {address.phone}</div>
                    </div>
                  </label>
                ))}

                {(!addresses || addresses.length === 0) && !showAddressForm && (
                  <p className="text-gray-500 text-center py-4">
                    No saved addresses. Please add a new address.
                  </p>
                )}
              </div>
            </div>

            {/* Payment Method Section */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4">Payment Method</h2>

              <div className="space-y-3">
                <label
                  className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    paymentMethod === 'RAZORPAY'
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="RAZORPAY"
                    checked={paymentMethod === 'RAZORPAY'}
                    onChange={() => setPaymentMethod('RAZORPAY')}
                    className="mr-3"
                  />
                  <div className="inline-block">
                    <div className="font-semibold flex items-center gap-2">
                      <span>💳 UPI / Cards / Netbanking / Wallets</span>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                        Recommended
                      </span>
                    </div>
                    <div className="text-gray-600 text-sm mt-1">
                      Pay securely using Razorpay - All major payment methods accepted
                    </div>
                  </div>
                </label>

                <label
                  className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    paymentMethod === 'COD'
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="COD"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                    className="mr-3"
                  />
                  <div className="inline-block">
                    <div className="font-semibold">💵 Cash on Delivery</div>
                    <div className="text-gray-600 text-sm mt-1">
                      Pay when you receive your order
                    </div>
                  </div>
                </label>

                <label
                  className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    paymentMethod === 'STRIPE'
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="STRIPE"
                    checked={paymentMethod === 'STRIPE'}
                    onChange={() => setPaymentMethod('STRIPE')}
                    className="mr-3"
                  />
                  <div className="inline-block">
                    <div className="font-semibold">💳 Stripe (International)</div>
                    <div className="text-gray-600 text-sm mt-1">
                      Secure international payment gateway
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:sticky lg:top-4 h-fit">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{cart.subtotal?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                {cart.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{cart.discount?.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t pt-3 mt-2">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>₹{cart.total?.toFixed(2) || '0.00'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {/* Address Selection Status */}
                {!selectedAddressId && (
                  <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                    Please select or add a delivery address
                  </div>
                )}

                {/* Payment Method Selection */}
                <div className="space-y-2">
                  <h3 className="font-medium">Payment Method</h3>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 p-2 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'RAZORPAY'}
                        onChange={() => setPaymentMethod('RAZORPAY')}
                        className="text-primary focus:ring-primary"
                      />
                      <span>Razorpay</span>
                    </label>
                    <label className="flex items-center space-x-2 p-2 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'COD'}
                        onChange={() => setPaymentMethod('COD')}
                        className="text-primary focus:ring-primary"
                      />
                      <span>Cash on Delivery (COD)</span>
                    </label>
                  </div>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={!selectedAddressId || createOrderMutation.isPending}
                  className={`w-full py-3 rounded-lg font-medium ${
                    selectedAddressId 
                      ? 'bg-primary text-white hover:bg-primary-dark' 
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {createOrderMutation.isPending ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Placing Order...
                    </span>
                  ) : 'Place Order'}
                </button>

                {!selectedAddressId && (
                  <button
                    type="button"
                    onClick={() => setShowAddressForm(true)}
                    className="w-full mt-4 text-center text-primary hover:text-primary-dark font-medium"
                  >
                    + Add Delivery Address
                  </button>
                )}
                
                {/* Payment Icons */}
                <div className="flex gap-3 justify-center mt-4">
                  <img src="/payment-icons/mastercard.svg" alt="Mastercard" className="h-6" onError={(e) => (e.currentTarget as HTMLImageElement).style.display = 'none'} />
                  <img src="/payment-icons/upi.svg" alt="UPI" className="h-6" onError={(e) => (e.currentTarget as HTMLImageElement).style.display = 'none'} />
                  <img src="/payment-icons/paytm.svg" alt="Paytm" className="h-6" onError={(e) => (e.currentTarget as HTMLImageElement).style.display = 'none'} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

