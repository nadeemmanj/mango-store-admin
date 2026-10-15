'use client';
import { useEffect, useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import Link from 'next/link';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const subtotal = mounted ? getTotalPrice() : 0;
  const deliveryFee = subtotal > 0 && subtotal < 100 ? 15 : 0;
  const total = subtotal + deliveryFee;
  const fmt = (n: number) => `${(n ?? 0).toFixed(2)} AED`;

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-8xl mb-4">🥭</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Add some premium mangoes to get started!</p>
          <Link href="/products"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-lg text-white font-bold text-sm"
            style={{ background: '#1a8a3c' }}>
            <ShoppingBag size={16} /> Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-6">
          <nav className="text-sm text-gray-500 mb-2">
            <Link href="/" className="hover:text-green-700">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-800 font-medium">Cart</span>
          </nav>
          <h1 className="text-2xl font-bold text-gray-800">Shopping Cart</h1>
          <p className="text-sm text-gray-500">{items.length} item(s) in your cart</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">

          {/* Cart items */}
          <div className="flex-1">

            {/* Delivery banner */}
            {subtotal > 0 && subtotal < 100 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4 text-sm text-amber-700">
                🚚 Add <strong>AED {(100 - subtotal).toFixed(2)}</strong> more for <strong>FREE delivery</strong>!
                <div className="mt-2 bg-amber-200 rounded-full h-1.5">
                  <div className="h-1.5 rounded-full bg-amber-500 transition-all"
                    style={{ width: `${Math.min(100, (subtotal / 100) * 100)}%` }} />
                </div>
              </div>
            )}
            {subtotal >= 100 && (
              <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-4 text-sm text-green-700 font-semibold">
                🎉 You qualify for FREE delivery!
              </div>
            )}

            {/* Items */}
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=200'}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover bg-gray-100 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-800">{item.name}</p>
                      {item.origin && <p className="text-xs text-gray-400">{item.originFlag} {item.origin}</p>}
                      <p className="text-xs text-gray-400">{item.weight} · {fmt(item.price ?? item.pricePerKg ?? 0)}/kg</p>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 mt-1 transition">
                        <Trash2 size={11} /> Remove
                      </button>
                    </div>

                    {/* Qty */}
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-white"
                        style={{ background: '#1a8a3c' }}>
                        <Minus size={13} />
                      </button>
                      <span className="w-10 text-center text-sm font-bold text-gray-700">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-white"
                        style={{ background: '#1a8a3c' }}>
                        <Plus size={13} />
                      </button>
                    </div>

                    {/* Total */}
                    <p className="font-bold text-sm w-20 text-right" style={{ color: '#1a8a3c' }}>
                      {fmt((item.price ?? item.pricePerKg ?? 0) * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-between">
              <button onClick={clearCart} className="text-sm text-red-400 hover:text-red-600 flex items-center gap-1">
                <Trash2 size={14} /> Clear Cart
              </button>
              <Link href="/products" className="text-sm font-semibold hover:underline" style={{ color: '#1a8a3c' }}>
                ← Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sticky top-24">
              <h2 className="font-bold text-lg text-gray-800 mb-4 pb-3 border-b border-gray-100">Order Summary</h2>

              <div className="space-y-2.5 text-sm mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({items.length} items)</span>
                  <span className="font-semibold">{fmt(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  {deliveryFee === 0
                    ? <span className="text-green-600 font-semibold">FREE</span>
                    : <span className="font-semibold">{fmt(deliveryFee)}</span>}
                </div>
              </div>

              <div className="border-t pt-3 mb-5">
                <div className="flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span style={{ color: '#1a8a3c' }}>{fmt(total)}</span>
                </div>
              </div>

              <Link href="/checkout"
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-lg text-white font-bold text-sm"
                style={{ background: '#1a8a3c' }}>
                Proceed to Checkout <ArrowRight size={16} />
              </Link>

              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                {[{ icon: '🔒', label: 'Secure' }, { icon: '🚚', label: 'Fast Delivery' }, { icon: '↩️', label: 'Easy Returns' }].map((b, i) => (
                  <div key={i} className="bg-gray-50 rounded-lg py-2">
                    <div className="text-lg">{b.icon}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{b.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}