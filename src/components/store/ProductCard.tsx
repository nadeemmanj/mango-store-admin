'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, Minus, ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { Product } from '@/types';

export default function ProductCard({ product }: { product: Product }) {
  const [qty,    setQty]    = useState(0);
  const [adding, setAdding] = useState(false);
  const addToCart  = useCartStore((s) => s.addItem);
  const cartItems  = useCartStore((s) => s.items);
  const inCart     = cartItems.find((i) => String(i.id) === String(product.id));
  const currentQty = inCart?.quantity ?? 0;

  const price         = Number(product?.price ?? product?.pricePerKg ?? 0);
  const originalPrice = Number(product?.originalPrice ?? 0);
  const stock         = Number(product?.stock ?? 0);
  const fmt           = (n: number) => n % 1 === 0 ? n.toFixed(0) : n.toFixed(2);

  const discount = originalPrice > 0 && price > 0
    ? Math.round((1 - price / originalPrice) * 100)
    : null;

  const handleAdd = async () => {
    if (stock === 0) return;
    setAdding(true);
    addToCart({ ...product, id: String(product.id), quantity: 1 });
    await new Promise((r) => setTimeout(r, 300));
    setAdding(false);
  };

  const handleIncrease = () => {
    if (currentQty < stock) addToCart({ ...product, id: String(product.id), quantity: 1 });
  };

  const handleDecrease = () => {
    const { updateQuantity } = useCartStore.getState();
    updateQuantity(String(product.id), currentQty - 1);
  };

  if (!product) return null;

  return (
    <div style={{
      background: '#fff',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border)',
      overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      transition: 'box-shadow 0.2s, transform 0.2s',
      cursor: 'pointer',
    }}
    onMouseEnter={(e) => {
      (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
      (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
    }}
    onMouseLeave={(e) => {
      (e.currentTarget as HTMLElement).style.boxShadow = 'none';
      (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
    }}>

      {/* Image */}
      <Link href={`/products/${product.id}`} style={{ display: 'block', position: 'relative', background: '#f9fbf9', aspectRatio: '1/1', overflow: 'hidden' }}>
        {product.image ? (
          <Image src={product.image} alt={product.name ?? 'Product'} fill
            style={{ objectFit: 'contain', padding: 8, transition: 'transform 0.3s' }}
            sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 22vw"
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48 }}>🥭</div>
        )}

        {/* Badges */}
        <div style={{ position: 'absolute', top: 8, left: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {discount !== null && discount > 0 && (
            <span style={{ background: '#e53e3e', color: '#fff', fontSize: 10, fontWeight: 800, padding: '2px 7px', borderRadius: 4 }}>
              {discount}% OFF
            </span>
          )}
          {product.tags?.includes('organic') && (
            <span style={{ background: 'var(--green)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4 }}>
              ORGANIC
            </span>
          )}
        </div>

        {/* Origin flag */}
        {product.originFlag && (
          <div style={{ position: 'absolute', top: 8, right: 8, background: '#fff', borderRadius: 6, padding: '3px 7px', fontSize: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>
            {product.originFlag} <span style={{ fontSize: 10, color: '#888' }}>{product.origin}</span>
          </div>
        )}
      </Link>

      {/* Info */}
      <div style={{ padding: '12px 12px 10px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Link href={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--green)', lineHeight: 1.3, marginBottom: 4, minHeight: 36 }}>
            {product.name}
          </h3>
        </Link>

        {/* Origin text */}
        {product.origin && (
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8 }}>
            {product.originFlag} {product.origin}
          </p>
        )}

        {/* Price */}
        <div style={{ marginBottom: 6 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--charcoal)' }}>
              {fmt(price)}
            </span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>
              AED /{product.unit || 'kg'}
            </span>
          </div>
          {originalPrice > 0 && originalPrice !== price && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {discount && (
                <span style={{ background: '#fef2f2', color: '#e53e3e', fontSize: 10, fontWeight: 700, padding: '1px 5px', borderRadius: 3 }}>
                  {discount}% off
                </span>
              )}
              <span style={{ fontSize: 11, color: '#aaa', textDecoration: 'line-through' }}>
                {fmt(originalPrice)} AED
              </span>
            </div>
          )}
          {product.weightOptions?.[0] && (
            <p style={{ fontSize: 10, color: '#aaa', marginTop: 2 }}>{product.weightOptions[0]}</p>
          )}
        </div>

        {/* Add to cart — farzana style: shows -/qty/+ after adding */}
        <div style={{ marginTop: 'auto' }}>
          {stock === 0 ? (
            <div style={{ background: '#f5f5f5', color: '#aaa', borderRadius: 8, padding: '9px', textAlign: 'center', fontSize: 12, fontWeight: 600 }}>
              Out of Stock
            </div>
          ) : currentQty === 0 ? (
            <button
              onClick={handleAdd}
              disabled={adding}
              style={{
                width: '100%',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                background: 'var(--green)',
                color: '#fff', border: 'none',
                borderRadius: 8, padding: '10px',
                fontSize: 13, fontWeight: 700,
                cursor: adding ? 'wait' : 'pointer',
                fontFamily: 'var(--font-body)',
                transition: 'opacity 0.2s',
                opacity: adding ? 0.7 : 1,
              }}
            >
              <ShoppingCart size={15} />
              {adding ? '...' : 'Add to Cart'}
            </button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', borderRadius: 8, overflow: 'hidden', border: '1.5px solid var(--green)' }}>
              <button onClick={handleDecrease} style={{ flex: 1, background: 'var(--green)', border: 'none', color: '#fff', padding: '9px 0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Minus size={14} />
              </button>
              <span style={{ flex: 1, textAlign: 'center', fontSize: 15, fontWeight: 800, color: 'var(--green)', background: '#fff' }}>
                {currentQty}
              </span>
              <button onClick={handleIncrease} style={{ flex: 1, background: 'var(--green)', border: 'none', color: '#fff', padding: '9px 0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Plus size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}