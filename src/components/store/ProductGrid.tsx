'use client';

import { useMemo, useState } from 'react';
import ProductCard from './ProductCard';
import { Product } from '@/types';

interface Props {
  products: Product[] | unknown;
  showFilters?: boolean;
}

const SORTS = [
  { value: 'default',    label: 'Featured'  },
  { value: 'price-asc',  label: 'Price ↑'   },
  { value: 'price-desc', label: 'Price ↓'   },
  { value: 'name',       label: 'Name A–Z'  },
];

export default function ProductGrid({ products: raw, showFilters = false }: Props) {
  const [sort,   setSort]   = useState('default');
  const [search, setSearch] = useState('');
  const [cat,    setCat]    = useState('All');

  const products: Product[] = useMemo(() => {
    if (Array.isArray(raw)) return raw;
    if (raw && typeof raw === 'object') {
      const o = raw as Record<string, unknown>;
      if (Array.isArray(o.products)) return o.products as Product[];
      if (Array.isArray(o.data))     return o.data     as Product[];
    }
    return [];
  }, [raw]);

  const cats = useMemo(() =>
    ['All', ...Array.from(new Set(products.map((p) => p.category).filter(Boolean)))]
  , [products]);

  const list = useMemo(() => {
    let r = [...products];
    if (cat !== 'All')         r = r.filter((p) => p.category === cat);
    if (search.trim())         r = r.filter((p) => p.name?.toLowerCase().includes(search.toLowerCase()));
    if (sort === 'price-asc')  r.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
    if (sort === 'price-desc') r.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
    if (sort === 'name')       r.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    return r;
  }, [products, cat, search, sort]);

  return (
    <div>
      {showFilters && (
        <div style={{ marginBottom: 16 }}>
          {/* Category pills */}
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 8, marginBottom: 10 }}>
            {cats.map((c) => (
              <button key={c} onClick={() => setCat(c ?? '')} style={{
                padding: '6px 14px', borderRadius: 50, fontSize: 12, fontWeight: 600,
                border: `1.5px solid ${cat === c ? '#1a7a3c' : '#ddd'}`,
                background: cat === c ? '#1a7a3c' : '#fff',
                color: cat === c ? '#fff' : '#666',
                cursor: 'pointer', fontFamily: 'inherit',
                whiteSpace: 'nowrap', flexShrink: 0,
              }}>
                {c}
              </button>
            ))}
          </div>

          {/* Search + sort */}
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search…"
              style={{ flex: 1, padding: '8px 14px', border: '1.5px solid #ddd', borderRadius: 50, fontSize: 13, outline: 'none', fontFamily: 'inherit' }}
            />
            <select value={sort} onChange={(e) => setSort(e.target.value)}
              style={{ padding: '8px 12px', border: '1.5px solid #ddd', borderRadius: 50, fontSize: 12, outline: 'none', background: '#fff', fontFamily: 'inherit' }}>
              {SORTS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          <p style={{ fontSize: 12, color: '#999', marginTop: 8 }}>
            Showing <strong style={{ color: '#333' }}>{list.length}</strong> products
          </p>
        </div>
      )}

      {list.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#bbb', padding: '32px 0', fontSize: 14 }}>No products found.</p>
      ) : (
        /* 2 cols on mobile → 4 cols on desktop (768px+) */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }} className="pg-grid">
          {list.map((p) => <ProductCard key={p.id} product={p} />
        )}
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .pg-grid {
            grid-template-columns: repeat(4, 1fr) !important;
            gap: 16px !important;
          }
        }
      `}</style>
    </div>
  );
}