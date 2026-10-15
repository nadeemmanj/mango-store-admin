'use client';
import { useEffect, useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { X, ShoppingBag, Minus, Plus, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getTotalPrice } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const subtotal = mounted ? getTotalPrice() : 0;
  const deliveryFee = subtotal > 0 && subtotal < 100 ? 15 : 0;
  const total = subtotal + deliveryFee;
  const freeLeft = Math.max(0, 100 - subtotal);
  const pct = Math.min(100, (subtotal / 100) * 100);
  const fmt = (n: number) => `${(n ?? 0).toFixed(2)} AED`;

  if (!mounted) return null;

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40" onClick={closeCart} />}

      <div className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 text-white flex-shrink-0" style={{ background: '#1a8a3c' }}>
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} />
            <span className="font-bold text-lg">Cart</span>
          </div>
          <button onClick={closeCart} className="p-1.5 rounded-full hover:bg-green-700 transition">
            <X size={18} />
          </button>
        </div>

        {/* Free delivery bar */}
        <div className="px-4 py-3 bg-gray-50 border-b flex-shrink-0">
          {freeLeft > 0 && subtotal > 0 ? (
            <>
              <p className="text-xs text-gray-600 mb-1.5">
                Add <span className="font-bold text-green-700">AED {freeLeft.toFixed(2)}</span> more for free delivery
              </p>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div className="h-1.5 rounded-full transition-all" style={{ width: `${pct}%`, background: '#1a8a3c' }} />
              </div>
            </>
          ) : subtotal >= 100 ? (
            <p className="text-xs font-semibold text-green-700">🎉 You qualify for FREE delivery!</p>
          ) : (
            <p className="text-xs text-gray-400">Shop AED 100 or above to get free delivery</p>
          )}
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4 py-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 py-16 text-gray-400">
              <span className="text-7xl">🥭</span>
              <p className="font-bold text-gray-600 text-lg">Your cart is empty</p>
              <button onClick={closeCart}
                className="px-8 py-2.5 rounded-lg text-white text-sm font-semibold"
                style={{ background: '#1a8a3c' }}>
                Shop Now
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
                  <div className="flex gap-3">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=100'}
                      alt={item.name}
                      className="w-14 h-14 rounded-lg object-cover bg-gray-100 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <p className="font-semibold text-sm text-gray-800 leading-tight line-clamp-2">{item.name}</p>
                        <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-500 transition ml-1 flex-shrink-0">
                          <X size={14} />
                        </button>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Unit price: <span className="font-medium text-gray-600">{fmt(item.price ?? item.pricePerKg ?? 0)}</span>
                      </p>
                      <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center text-white"
                            style={{ background: '#1a8a3c' }}>
                            <Minus size={12} />
                          </button>
                          <span className="w-8 text-center text-sm font-bold text-gray-700">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center text-white"
                            style={{ background: '#1a8a3c' }}>
                            <Plus size={12} />
                          </button>
                        </div>
                        <span className="font-bold text-sm" style={{ color: '#1a8a3c' }}>
                          Total: {(item.subtotal ?? 0).toFixed(0)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t bg-white px-4 py-4 flex-shrink-0 space-y-3">
            <div className="text-sm space-y-1">
              <p className="text-xs text-gray-400">There are {items.length} item(s) in your cart.</p>
              <div className="flex justify-between font-bold text-base">
                <span>Sub-Total:</span>
                <span style={{ color: '#1a8a3c' }}>{fmt(subtotal)}</span>
              </div>
              {deliveryFee > 0 && (
                <div className="flex justify-between text-gray-500 text-xs">
                  <span>Delivery Fee:</span>
                  <span>{fmt(deliveryFee)}</span>
                </div>
              )}
            </div>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-lg text-white font-bold text-sm"
              style={{ background: '#1a8a3c' }}>
              GO TO CART <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </>
  );
}