'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';

interface Stat {
  label: string;
  value: string;
  change: string;
  up: boolean;
  icon: React.ReactNode;
  accent: string;
}

export default function StatsCards({ stats }: { stats: Stat[] }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))',
        gap: 16,
        marginBottom: 24,
        width: '100%',
        minWidth: 0,
      }}
    >
      {stats.map((s) => (
        <div
          key={s.label}
          style={{
            background: '#fff',
            borderRadius: 10,
            padding: '18px 20px',
            border: '1px solid #e8ede9',
            minWidth: 0,
            boxSizing: 'border-box',
          }}
        >
          {/* Top row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 8,
              marginBottom: 14,
              minWidth: 0,
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: '#8fa893',
                textTransform: 'uppercase',
                letterSpacing: '0.07em',
                overflowWrap: 'anywhere',
              }}
            >
              {s.label}
            </span>

            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: s.accent + '18',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {s.icon}
            </div>
          </div>

          {/* Value */}
          <div
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: '#1a2e1f',
              lineHeight: 1.2,
              marginBottom: 10,
              letterSpacing: '-0.02em',
              overflowWrap: 'anywhere',
            }}
          >
            {s.value}
          </div>

          {/* Change */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 5,
              minWidth: 0,
            }}
          >
            {s.up ? (
              <TrendingUp size={12} color="#1c6b3a" />
            ) : (
              <TrendingDown size={12} color="#e53e3e" />
            )}

            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: s.up ? '#1c6b3a' : '#e53e3e',
              }}
            >
              {s.change}
            </span>

            <span style={{ fontSize: 12, color: '#aab8ad' }}>
              vs last month
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
