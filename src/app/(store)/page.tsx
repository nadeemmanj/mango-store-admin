import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import HeroBanner from '@/components/store/HeroBanner';
import CategoryIcons from '@/components/store/CategoryIcons';
import ProductGrid from '@/components/store/ProductGrid';
import SuperSavings from '@/components/store/SuperSavings';
import { Product } from '@/types';
import ContactSection from '@/components/store/ContactSection';

export const metadata: Metadata = {
  title: 'Maan Al Khair — Premium Mangoes, Fruits & Vegetables Dubai',
  description: "Dubai's finest mangoes — Chaunsa, Sindhri, Anwar Ratol & more. Same-day delivery. All prices in AED.",
};

async function getProducts(): Promise<Product[]> {
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res  = await fetch(`${base}/api/products`, { cache: 'no-store' });
    if (!res.ok) return [];
    const d = await res.json();
    if (Array.isArray(d))          return d;
    if (Array.isArray(d.products)) return d.products;
    return [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const all = await getProducts();
  const premiumMangoes = all.filter((p) => p.category === 'Premium Mangoes');
  const seasonal       = all.filter((p) => p.category === 'Seasonal');
  const everyday       = all.filter((p) => p.category === 'Everyday');

  return (
    <div style={{ background: '#f7f8f7' }}>

      {/* Hero — full width, no wrapper padding */}
      <HeroBanner />

      {/* Category icons — owns its own bg/padding */}
      <CategoryIcons />

      {/* Premium Mangoes */}
      {premiumMangoes.length > 0 && (
        <div style={{ background: 'linear-gradient(180deg, #fffdf5, #fffbee)', padding: '40px 20px', borderBottom: '1px solid #e8e8e8' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <SectionHeader title="🥭 Premium Mangoes" subtitle="Chaunsa, Sindhri, Anwar Ratol & Dusehri — straight from Pakistan" link="/products?category=Premium Mangoes" />
            <Suspense fallback={<SkeletonGrid />}>
              <ProductGrid products={premiumMangoes} showFilters={false} />
            </Suspense>
          </div>
        </div>
      )}

      {/* Super Savings */}
      <SuperSavings />

      {/* Seasonal */}
      {seasonal.length > 0 && (
        <div style={{ background: '#f7f8f7', padding: '40px 20px', borderBottom: '1px solid #e8e8e8' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <SectionHeader title="🍒 Seasonal Picks" subtitle="Jamun, Lychee, Cherries & Apricots — available for a limited time" link="/products?category=Seasonal" />
            <Suspense fallback={<SkeletonGrid />}>
              <ProductGrid products={seasonal} showFilters={false} />
            </Suspense>
          </div>
        </div>
      )}

      {/* Everyday */}
      {everyday.length > 0 && (
        <div style={{ background: '#fff', padding: '40px 20px', borderBottom: '1px solid #e8e8e8' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <SectionHeader title="🛒 Everyday Essentials" subtitle="Apples, bananas, guava, watermelon & more" link="/products?category=Everyday" />
            <Suspense fallback={<SkeletonGrid />}>
              <ProductGrid products={everyday} showFilters={false} />
            </Suspense>
          </div>
        </div>
      )}

      <ContactSection />

    </div>
  );
}

function SectionHeader({ title, subtitle, link }: { title: string; subtitle: string; link: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 22, flexWrap: 'wrap', gap: 12 }}>
      <div>
        <h2 style={{ fontSize: 'clamp(18px, 2.5vw, 26px)', fontWeight: 900, color: '#1a1a1a', lineHeight: 1.2 }}>{title}</h2>
        <p style={{ fontSize: 13, color: '#888', marginTop: 3 }}>{subtitle}</p>
      </div>
      <Link href={link} style={{ fontSize: 13, fontWeight: 700, color: '#1a7a3c', textDecoration: 'none', border: '1.5px solid #1a7a3c', borderRadius: 50, padding: '7px 18px', whiteSpace: 'nowrap' }}>
        View All →
      </Link>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 14 }}>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} style={{ borderRadius: 12, overflow: 'hidden' }}>
          <div className="skeleton" style={{ aspectRatio: '1/1', width: '100%' }} />
          <div style={{ padding: 12, background: '#fff' }}>
            <div className="skeleton" style={{ height: 12, width: '60%', marginBottom: 8 }} />
            <div className="skeleton" style={{ height: 18, width: '80%', marginBottom: 8 }} />
            <div className="skeleton" style={{ height: 36, width: '100%' }} />
          </div>
        </div>
      ))}
    </div>
  );
}