'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Breadcrumb } from '@/components/Breadcrumb';

interface Address {
  id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
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
  const [addressForm, setAddressForm] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
  });

  const { data: cart } = useQuery<Cart>({
    queryKey: ['cart'],
    queryFn: () => api.get('/cart').then((res) => res.data),
  });

  const { data: addresses } = useQuery<Address[]>({
    queryKey: ['addresses'],
    queryFn: () => api.get('/addresses').then((res) => res.data),
  });

  const createAddressMutation = useMutation({
    mutationFn: (data: typeof addressForm) => api.post('/addresses', data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      setSelectedAddressId(response.data.id);
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
      });
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: (data: { shippingAddressId: string; paymentMethod: string }) =>
      api.post('/orders', data),
    onSuccess: (response) => {
      const order = response.data;

      if (paymentMethod === 'COD') {
        router.push(`/orders/${order.id}/success`);
      } else if (paymentMethod === 'RAZORPAY') {
        initiateRazorpayPayment(order);
      } else if (paymentMethod === 'STRIPE') {
        router.push(`/checkout/stripe?orderId=${order.id}`);
      }
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
      alert('Please select a delivery address');
      return;
    }

    if (!paymentMethod) {
      alert('Please select a payment method');
      return;
    }

    createOrderMutation.mutate({
      shippingAddressId: selectedAddressId,
      paymentMethod,
    });
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createAddressMutation.mutate(addressForm);
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
                      <label className="block text-sm font-medium mb-1">City *</label>
                      <input
                        type="text"
                        required
                        value={addressForm.city}
                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">State *</label>
                      <input
                        type="text"
                        required
                        value={addressForm.state}
                        onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary"
                      />
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
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm sticky top-4">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal ({cart.items.length} items)</span>
                  <span>₹{cart.subtotal.toFixed(2)}</span>
                </div>

                {cart.discount > 0 && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Discount</span>
                    <span>-₹{cart.discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-700">
                  <span>Tax (GST)</span>
                  <span>₹{cart.tax.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-gray-700">
                  <span>Delivery Charges</span>
                  <span className="text-green-600">FREE</span>
                </div>

                <div className="border-t pt-3">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total Amount</span>
                    <span className="text-primary">₹{cart.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={!selectedAddressId || createOrderMutation.isPending}
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createOrderMutation.isPending ? 'Processing...' : 'Place Order'}
              </button>

              {/* Security Badges */}
              <div className="mt-6 pt-6 border-t">
                <div className="text-center text-sm text-gray-600 mb-3">
                  🔒 100% Secure & Safe Payments
                </div>
                <div className="flex justify-center gap-2 flex-wrap">
                  <img src="/payment-icons/visa.svg" alt="Visa" className="h-6" onError={(e) => e.currentTarget.style.display = 'none'} />
                  <img src="/payment-icons/mastercard.svg" alt="Mastercard" className="h-6" onError={(e) => e.currentTarget.style.display = 'none'} />
                  <img src="/payment-icons/upi.svg" alt="UPI" className="h-6" onError={(e) => e.currentTarget.style.display = 'none'} />
                  <img src="/payment-icons/paytm.svg" alt="Paytm" className="h-6" onError={(e) => e.currentTarget.style.display = 'none'} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

