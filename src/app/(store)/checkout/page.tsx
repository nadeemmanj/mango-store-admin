'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { Check, ChevronRight, MapPin, CreditCard, ShoppingBag, ArrowLeft } from 'lucide-react';

const EMIRATES = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain'];

const STEPS = [
  { id: 1, label: 'Delivery', icon: MapPin },
  { id: 2, label: 'Payment',  icon: CreditCard },
  { id: 3, label: 'Review',   icon: ShoppingBag },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart, getTotalPrice } = useCartStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [delivery, setDelivery] = useState({
    fullName: '', phone: '', email: '',
    addressLine1: '', city: '', emirate: 'Dubai', notes: '',
  });

  const [payment, setPayment] = useState<'cod' | 'stripe'>('cod');

  const subtotal = getTotalPrice();
  const deliveryFee = subtotal >= 100 ? 0 : 15;
  const total = subtotal + deliveryFee;
  const fmt = (n: number) => `${(n ?? 0).toFixed(2)} AED`;

  // Validation
  const validateDelivery = () => {
    if (!delivery.fullName.trim()) { setError('Full name is required'); return false; }
    if (!delivery.phone.trim()) { setError('Phone number is required'); return false; }
    if (!delivery.addressLine1.trim()) { setError('Address is required'); return false; }
    setError('');
    return true;
  };

  const handleNext = () => {
    if (step === 1 && !validateDelivery()) return;
    setError('');
    setStep(s => s + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setError('');
    setStep(s => s - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(i => ({
            productId: i.id,
            name: i.name,
            pricePerKg: i.price ?? i.pricePerKg ?? 0,
            weight: i.weight || '1kg',
            quantity: i.quantity,
            subtotal: i.subtotal ?? 0,
          })),
          deliveryAddress: {
            fullName: delivery.fullName,
            phone: delivery.phone,
            addressLine1: delivery.addressLine1,
            city: delivery.city || delivery.emirate,
            emirate: delivery.emirate,
            notes: delivery.notes,
          },
          paymentMethod: payment,
          subtotal,
          deliveryFee,
          total,
        }),
      });
      const data = await res.json();
      if (data.success) {
        clearCart();
        router.push(`/order-confirmation/${data.order.id}?orderNumber=${data.order.orderNumber}`);
      } else {
        setError(data.error || 'Failed to place order. Please try again.');
        setLoading(false);
      }
    } catch {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-7xl mb-4">🛒</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
          <Link href="/products" className="inline-block mt-3 px-6 py-2.5 rounded-lg text-white font-bold text-sm" style={{ background: '#1a8a3c' }}>
            Browse Mangoes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Back link */}
        <Link href="/cart" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-green-700 mb-5 transition">
          <ArrowLeft size={15} /> Back to Cart
        </Link>

        {/* Step indicator */}
        <div className="flex items-center justify-center mb-8">
          {STEPS.map((s, i) => {
            const done = step > s.id;
            const active = step === s.id;
            return (
              <div key={s.id} className="flex items-center">
                <div className="flex flex-col items-center gap-1">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300"
                    style={{
                      background: done ? '#1a8a3c' : active ? '#1a8a3c' : '#e5e7eb',
                      color: done || active ? 'white' : '#9ca3af',
                    }}
                  >
                    {done ? <Check size={16} /> : s.id}
                  </div>
                  <span className="text-xs font-semibold" style={{ color: active ? '#1a8a3c' : done ? '#1a8a3c' : '#9ca3af' }}>
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="w-16 sm:w-24 h-0.5 mx-2 mb-4 rounded transition-all duration-300"
                    style={{ background: step > s.id ? '#1a8a3c' : '#e5e7eb' }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Card container */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

          {/* ── STEP 1: Delivery ── */}
          {step === 1 && (
            <div>
              <div className="px-6 py-4 border-b border-gray-100" style={{ background: '#f8fdf9' }}>
                <h2 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                  <MapPin size={18} style={{ color: '#1a8a3c' }} /> Delivery Details
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">Where should we deliver your mangoes?</p>
              </div>

              <div className="p-6 space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Full Name *</label>
                  <input
                    value={delivery.fullName}
                    onChange={e => setDelivery({ ...delivery, fullName: e.target.value })}
                    placeholder="Ahmad Al Mansouri"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-green-500 transition"
                  />
                </div>

                {/* Phone + Email */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Phone / WhatsApp *</label>
                    <input
                      value={delivery.phone}
                      onChange={e => setDelivery({ ...delivery, phone: e.target.value })}
                      placeholder="+971 50 000 0000"
                      type="tel"
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-green-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email (optional)</label>
                    <input
                      value={delivery.email}
                      onChange={e => setDelivery({ ...delivery, email: e.target.value })}
                      placeholder="you@email.com"
                      type="email"
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-green-500 transition"
                    />
                  </div>
                </div>

                {/* Emirate */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Emirate *</label>
                  <select
                    value={delivery.emirate}
                    onChange={e => setDelivery({ ...delivery, emirate: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-green-500 transition bg-white"
                  >
                    {EMIRATES.map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Street Address *</label>
                  <input
                    value={delivery.addressLine1}
                    onChange={e => setDelivery({ ...delivery, addressLine1: e.target.value })}
                    placeholder="Villa 12, Street 4A, Jumeirah"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-green-500 transition"
                  />
                </div>

                {/* City */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">City / Area</label>
                  <input
                    value={delivery.city}
                    onChange={e => setDelivery({ ...delivery, city: e.target.value })}
                    placeholder="Dubai Marina, Al Barsha, Downtown..."
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-green-500 transition"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Delivery Notes (optional)</label>
                  <textarea
                    value={delivery.notes}
                    onChange={e => setDelivery({ ...delivery, notes: e.target.value })}
                    placeholder="Gate code, floor number, special instructions..."
                    rows={2}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-green-500 transition resize-none"
                  />
                </div>

                {/* Delivery fee note */}
                <div className="rounded-lg px-4 py-3 text-sm"
                  style={{ background: subtotal >= 100 ? '#f0fdf4' : '#fffbeb', color: subtotal >= 100 ? '#15803d' : '#92400e' }}>
                  {subtotal >= 100
                    ? '🎉 Your order qualifies for FREE delivery!'
                    : `🚚 Delivery fee: AED 15.00 (free on orders AED 100+)`}
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 2: Payment ── */}
          {step === 2 && (
            <div>
              <div className="px-6 py-4 border-b border-gray-100" style={{ background: '#f8fdf9' }}>
                <h2 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                  <CreditCard size={18} style={{ color: '#1a8a3c' }} /> Payment Method
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">Choose how you'd like to pay</p>
              </div>

              <div className="p-6 space-y-3">
                {/* COD option */}
                <button
                  onClick={() => setPayment('cod')}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left"
                  style={{ borderColor: payment === 'cod' ? '#1a8a3c' : '#e5e7eb', background: payment === 'cod' ? '#f0fdf4' : 'white' }}
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ background: payment === 'cod' ? '#dcfce7' : '#f3f4f6' }}>
                    💵
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm text-gray-800">Cash on Delivery</p>
                    <p className="text-xs text-gray-400 mt-0.5">Pay in AED when your order arrives</p>
                  </div>
                  <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                    style={{ borderColor: payment === 'cod' ? '#1a8a3c' : '#d1d5db', background: payment === 'cod' ? '#1a8a3c' : 'white' }}>
                    {payment === 'cod' && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </button>

                {/* Card option */}
                <button
                  onClick={() => setPayment('stripe')}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left"
                  style={{ borderColor: payment === 'stripe' ? '#1a8a3c' : '#e5e7eb', background: payment === 'stripe' ? '#f0fdf4' : 'white' }}
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ background: payment === 'stripe' ? '#dcfce7' : '#f3f4f6' }}>
                    💳
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm text-gray-800">Pay by Card</p>
                    <p className="text-xs text-gray-400 mt-0.5">Visa / Mastercard — Secure online payment</p>
                  </div>
                  <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                    style={{ borderColor: payment === 'stripe' ? '#1a8a3c' : '#d1d5db', background: payment === 'stripe' ? '#1a8a3c' : 'white' }}>
                    {payment === 'stripe' && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </button>

                {/* Security note */}
                <div className="flex items-center gap-2 text-xs text-gray-400 pt-2 justify-center">
                  <span>🔒</span>
                  <span>Your payment information is secure and encrypted</span>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 3: Review ── */}
          {step === 3 && (
            <div>
              <div className="px-6 py-4 border-b border-gray-100" style={{ background: '#f8fdf9' }}>
                <h2 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                  <ShoppingBag size={18} style={{ color: '#1a8a3c' }} /> Review Your Order
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">Please confirm everything looks correct</p>
              </div>

              <div className="p-6 space-y-5">
                {/* Delivery info */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Delivering To</p>
                    <button onClick={() => setStep(1)} className="text-xs font-semibold" style={{ color: '#1a8a3c' }}>Edit</button>
                  </div>
                  <p className="text-sm font-semibold text-gray-800">{delivery.fullName}</p>
                  <p className="text-sm text-gray-500">{delivery.phone}</p>
                  <p className="text-sm text-gray-500">{delivery.addressLine1}, {delivery.city}, {delivery.emirate}</p>
                  {delivery.notes && <p className="text-xs text-gray-400 mt-1">Note: {delivery.notes}</p>}
                </div>

                {/* Payment info */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Payment</p>
                    <button onClick={() => setStep(2)} className="text-xs font-semibold" style={{ color: '#1a8a3c' }}>Edit</button>
                  </div>
                  <p className="text-sm font-semibold text-gray-800">
                    {payment === 'cod' ? '💵 Cash on Delivery' : '💳 Pay by Card'}
                  </p>
                </div>

                {/* Items */}
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Order Items</p>
                  <div className="space-y-3">
                    {items.map(item => (
                      <div key={item.id} className="flex items-center gap-3">
                        <img src={item.image} alt={item.name}
                          className="w-12 h-12 rounded-lg object-cover bg-gray-100 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
                          <p className="text-xs text-gray-400">{item.quantity} × {fmt(item.price ?? item.pricePerKg ?? 0)}</p>
                        </div>
                        <p className="text-sm font-bold" style={{ color: '#1a8a3c' }}>
                          {fmt((item.price ?? item.pricePerKg ?? 0) * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals */}
                <div className="border-t border-gray-100 pt-4 space-y-2">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-700">{fmt(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Delivery Fee</span>
                    {deliveryFee === 0
                      ? <span className="font-semibold text-green-600">FREE</span>
                      : <span className="font-semibold text-gray-700">{fmt(deliveryFee)}</span>}
                  </div>
                  <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-100">
                    <span>Total</span>
                    <span style={{ color: '#1a8a3c' }}>{fmt(total)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="mx-6 mb-2 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 text-sm text-red-600">
              ⚠️ {error}
            </div>
          )}

          {/* Navigation buttons */}
          <div className="px-6 pb-6 flex items-center gap-3">
            {step > 1 && (
              <button
                onClick={handleBack}
                className="flex-1 py-3 rounded-xl border-2 font-semibold text-sm transition"
                style={{ borderColor: '#1a8a3c', color: '#1a8a3c' }}
              >
                ← Back
              </button>
            )}
            {step < 3 ? (
              <button
                onClick={handleNext}
                className="flex-1 py-3 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 transition"
                style={{ background: '#1a8a3c' }}
              >
                Continue <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="flex-1 py-3.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 transition disabled:opacity-60"
                style={{ background: loading ? '#888' : '#1a8a3c' }}
              >
                {loading ? (
                  <><span className="animate-spin">⏳</span> Placing Order...</>
                ) : (
                  <><Check size={16} /> Place Order · {fmt(total)}</>
                )}
              </button>
            )}
          </div>

          {/* Step progress dots */}
          <div className="flex justify-center gap-2 pb-5">
            {STEPS.map(s => (
              <div key={s.id} className="rounded-full transition-all duration-300"
                style={{ width: step === s.id ? 24 : 8, height: 8, background: step >= s.id ? '#1a8a3c' : '#e5e7eb' }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
