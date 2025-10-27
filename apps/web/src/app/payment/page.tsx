'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { api } from '@/lib/api';

interface Address {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export default function PaymentPage() {
  const router = useRouter();
  const { cart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [shippingAddress, setShippingAddress] = useState<Address | null>(null);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: '',
  });
  const [upiId, setUpiId] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    // Load address from localStorage
    const savedAddress = localStorage.getItem('shippingAddress');
    if (savedAddress) {
      setShippingAddress(JSON.parse(savedAddress));
    } else {
      // Redirect to checkout if no address
      router.push('/checkout');
    }
  }, [router]);

  if (!cart || cart.items.length === 0 || !shippingAddress) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  const subtotal = cart.items.reduce((sum, item) => sum + item.subtotal, 0);
  const gst = subtotal * 0.18;
  const shipping = subtotal > 500 ? 0 : 99;
  const total = subtotal + gst + shipping;

  const handlePayment = async () => {
    setProcessing(true);
    try {
      // Create address first
      const addressResponse = await api.post('/addresses', shippingAddress);
      const addressId = addressResponse.data.id;

      // Create order
      const orderData = {
        shippingAddressId: addressId,
        paymentMethod: paymentMethod.toUpperCase(),
        items: cart.items.map(item => ({
          variantId: item.variantId,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      const response = await api.post('/orders', orderData);

      // Clear cart and address from localStorage
      localStorage.removeItem('shippingAddress');
      // Clear cart via API
      await api.delete('/cart');

      router.push(`/order-confirmation/${response.data.orderNumber}`);
    } catch (error: any) {
      alert('Payment failed: ' + error.message);
      setProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Payment</h1>
        <div className="flex items-center text-sm text-text-light">
          <span>Cart</span>
          <span className="mx-2">→</span>
          <span>Checkout</span>
          <span className="mx-2">→</span>
          <span className="font-medium">Payment</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Payment Methods */}
        <div className="space-y-6">
          {/* Delivery Address Summary */}
          <div className="card p-6">
            <h2 className="text-xl font-bold mb-4">Delivery Address</h2>
            <div className="text-text-light">
              <p className="font-medium text-gray-900">{shippingAddress.fullName}</p>
              <p>{shippingAddress.phone}</p>
              <p>{shippingAddress.addressLine1}</p>
              {shippingAddress.addressLine2 && <p>{shippingAddress.addressLine2}</p>}
              <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}</p>
              <p>{shippingAddress.country}</p>
            </div>
            <Link href="/checkout" className="text-primary text-sm hover:underline mt-2 inline-block">
              Change Address
            </Link>
          </div>

          <div className="card p-6">
            <h2 className="text-xl font-bold mb-4">Choose Payment Method</h2>

            <div className="space-y-3">
              <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  className="mr-3"
                  checked={paymentMethod === 'cod'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div className="flex-1">
                  <div className="font-medium">Cash on Delivery</div>
                  <div className="text-sm text-text-light">Pay when you receive your order</div>
                </div>
                <div className="text-green-600 font-medium">FREE</div>
              </label>

              <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  className="mr-3"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div className="flex-1">
                  <div className="font-medium">Credit/Debit Card</div>
                  <div className="text-sm text-text-light">Visa, MasterCard, RuPay</div>
                </div>
                <div className="text-green-600 font-medium">FREE</div>
              </label>

              <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="payment"
                  value="upi"
                  className="mr-3"
                  checked={paymentMethod === 'upi'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div className="flex-1">
                  <div className="font-medium">UPI Payment</div>
                  <div className="text-sm text-text-light">Google Pay, PhonePe, Paytm</div>
                </div>
                <div className="text-green-600 font-medium">FREE</div>
              </label>
            </div>
          </div>

          {/* Card Details */}
          {paymentMethod === 'card' && (
            <div className="card p-6">
              <h3 className="text-lg font-bold mb-4">Card Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Card Number</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="1234 5678 9012 3456"
                    value={cardDetails.number}
                    onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Expiry Date</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="MM/YY"
                      value={cardDetails.expiry}
                      onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">CVV</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="123"
                      value={cardDetails.cvv}
                      onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="John Doe"
                    value={cardDetails.name}
                    onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* UPI Details */}
          {paymentMethod === 'upi' && (
            <div className="card p-6">
              <h3 className="text-lg font-bold mb-4">UPI Details</h3>
              <div>
                <label className="block text-sm font-medium mb-1">UPI ID</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="yourname@paytm"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                />
                <div className="text-xs text-text-light mt-2">
                  Enter your UPI ID (e.g., john@paytm, john@phonepe)
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Order Summary */}
        <div>
          <div className="card p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

            <div className="space-y-3 mb-4">
              {cart.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <div>
                    <div className="font-medium">{item.product.name}</div>
                    <div className="text-text-light">Qty: {item.quantity}</div>
                  </div>
                  <div>₹{item.subtotal}</div>
                </div>
              ))}
            </div>

            <hr className="my-4" />

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (18%)</span>
                <span>₹{gst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'text-green-600' : ''}>
                  {shipping === 0 ? 'FREE' : `₹${shipping}`}
                </span>
              </div>
              <hr />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={processing}
              className="w-full btn-primary py-3 text-lg"
            >
              {processing ? 'Processing...' : `Pay ₹${total.toFixed(2)}`}
            </button>

            <div className="mt-4 text-xs text-text-light space-y-1">
              <p>✓ Secure payment</p>
              <p>✓ SSL encrypted</p>
              <p>✓ GST included</p>
              <p>✓ {shipping === 0 ? 'Free shipping' : `₹${99 - subtotal} more for free shipping`}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
