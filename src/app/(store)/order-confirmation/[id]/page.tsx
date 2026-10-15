'use client';
import { useEffect, useState } from 'react';
import { use } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Package, MapPin, Clock, ArrowRight } from 'lucide-react';

export default function OrderConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('orderNumber') || 'AAK-2024-0000';
  const { id } = use(params);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">

        {/* Success card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden text-center">

          {/* Green header */}
          <div className="py-8 px-6" style={{ background: 'linear-gradient(135deg, #1a8a3c, #2dbe5c)' }}>
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
              <CheckCircle size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-white mb-1">Order Placed! 🎉</h1>
            <p className="text-green-100 text-sm">Your mangoes are being prepared</p>
          </div>

          <div className="p-6 space-y-4">
            {/* Order number */}
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">Order Number</p>
              <p className="text-xl font-extrabold" style={{ color: '#1a8a3c' }}>{orderNumber}</p>
              <p className="text-xs text-gray-400 mt-1">Save this to track your order</p>
            </div>

            {/* Steps */}
            <div className="space-y-3 text-left">
              {[
                { icon: Package,  text: 'We\'re packing your fresh mangoes',     done: true  },
                { icon: Clock,    text: 'Estimated delivery: Today 3–6 PM',       done: false },
                { icon: MapPin,   text: 'You\'ll get a WhatsApp when it ships',   done: false },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: item.done ? '#f0fdf4' : '#f3f4f6' }}>
                    <item.icon size={16} style={{ color: item.done ? '#1a8a3c' : '#9ca3af' }} />
                  </div>
                  <p className="text-sm text-gray-600">{item.text}</p>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2">
                <Link href={`/track/${id}`}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white font-bold text-sm"
                style={{ background: '#1a8a3c' }}>
                Track My Order <ArrowRight size={16} />
              </Link>
              <Link href="/products"
                className="flex items-center justify-center w-full py-3 rounded-xl border-2 font-semibold text-sm transition"
                style={{ borderColor: '#1a8a3c', color: '#1a8a3c' }}>
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}