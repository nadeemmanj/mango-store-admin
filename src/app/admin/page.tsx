'use client';



import { useState } from 'react';

import Link from 'next/link';

import AdminShell from '@/components/admin/AdminShell';

import {

  ShoppingBag, Package, Users, TrendingUp, TrendingDown,

  Clock, CheckCircle, XCircle, AlertTriangle, ArrowRight,

  ArrowUpRight, RefreshCw, Eye, Star, Zap,

} from 'lucide-react';



const STATS = [

  { label: 'Total Revenue', value: 'AED 2.4M', sub: 'AED 180K today',     change: '+8.3%',  up: true, icon: TrendingUp,  color: '#2d7a47', bg: '#edf7f1' },

  { label: 'Total Orders',  value: '1,284',   sub: '67 this week',       change: '+12.5%', up: true, icon: ShoppingBag, color: '#2563eb', bg: '#eff6ff' },

  { label: 'Products',      value: '248',     sub: '4 low stock',        change: '+4 new', up: true, icon: Package,     color: '#7c3aed', bg: '#f5f3ff' },

  { label: 'Customers',     value: '892',     sub: '23 new this month',  change: '+2.8%',  up: true, icon: Users,       color: '#d4952a', bg: '#fdf6ea' },

];

const ORDERS = [

  { id: 'ORD-1041', customer: 'Ahmad Ali',    amount: 1240, items: 4, status: 'delivered',  time: '2h ago',  av: 'AA' },

  { id: 'ORD-1040', customer: 'Sara Khan',    amount: 580,  items: 2, status: 'processing', time: '3h ago',  av: 'SK' },

  { id: 'ORD-1039', customer: 'Usman Tariq',  amount: 2100, items: 6, status: 'shipped',    time: '5h ago',  av: 'UT' },

  { id: 'ORD-1038', customer: 'Fatima Malik', amount: 320,  items: 1, status: 'cancelled',  time: '6h ago',  av: 'FM' },

  { id: 'ORD-1037', customer: 'Hassan Raza',  amount: 870,  items: 3, status: 'delivered',  time: '8h ago',  av: 'HR' },

];

const LOW_STOCK = [

  { name: 'Desi Mangoes',    stock: 3, unit: 'kg',    category: 'Fruits',     crit: true  },

  { name: 'Strawberries',    stock: 2, unit: 'box',   category: 'Fruits',     crit: true  },

  { name: 'Baby Spinach',    stock: 5, unit: 'bunch', category: 'Vegetables', crit: false },

  { name: 'Red Bell Pepper', stock: 8, unit: 'kg',    category: 'Vegetables', crit: false },

];

const TOP_PRODUCTS = [

  { name: 'Alphonso Mango',   sales: 142, revenue: 'AED 54K', trend: +18 },

  { name: 'Chaunsa Mango',    sales: 118, revenue: 'AED 38K', trend: +12 },

  { name: 'Organic Tomatoes', sales: 97,  revenue: 'AED 12K', trend:  +5 },

  { name: 'Strawberries',     sales: 84,  revenue: 'AED 38K', trend: +22 },

  { name: 'Watermelon',       sales: 76,  revenue: 'AED 21K', trend:  -3 },

];

const ACTIVITY = [

  { text: 'New order #1041 from Ahmad Ali',        time: '2 min ago',  color: '#2563eb', bg: '#eff6ff' },

  { text: 'Strawberries stock critically low (2)', time: '15 min ago', color: '#e53e3e', bg: '#fef2f2' },

  { text: 'New customer registered: Sara Khan',    time: '1h ago',     color: '#2d7a47', bg: '#edf7f1' },

  { text: 'Order #1039 marked as shipped',         time: '2h ago',     color: '#7c3aed', bg: '#f5f3ff' },

  { text: 'Desi Mangoes restocked: +50 kg added',  time: '3h ago',     color: '#d4952a', bg: '#fdf6ea' },

];

const WEEKLY = [

  { day: 'Mon', orders: 18, revenue: 42 }, { day: 'Tue', orders: 24, revenue: 58 },

  { day: 'Wed', orders: 19, revenue: 46 }, { day: 'Thu', orders: 31, revenue: 74 },

  { day: 'Fri', orders: 28, revenue: 68 }, { day: 'Sat', orders: 35, revenue: 88 },

  { day: 'Sun', orders: 22, revenue: 52 },

];

const MAX_R = 88;

const STATUS_CFG: Record<string, { label: string; color: string; bg: string }> = {

  delivered:  { label: 'Delivered',  color: '#2d7a47', bg: '#edf7f1' },

  processing: { label: 'Processing', color: '#d4952a', bg: '#fdf6ea' },

  shipped:    { label: 'Shipped',    color: '#2563eb', bg: '#eff6ff' },

  cancelled:  { label: 'Cancelled',  color: '#e53e3e', bg: '#fef2f2' },

  pending:    { label: 'Pending',    color: '#6b7280', bg: '#f3f4f6' },

};

const AV_COLOR: Record<string, string> = {

  AA: '#2d7a47', SK: '#2563eb', UT: '#7c3aed', FM: '#d4952a', HR: '#e53e3e',

};



const card: React.CSSProperties = { background: '#fff', borderRadius: 12, border: '1px solid #eaefea', padding: '18px 20px' };

const cardTitle: React.CSSProperties = { fontSize: 14, fontWeight: 700, color: '#111b13', margin: 0, letterSpacing: '-0.01em' };



export default function AdminDashboard() {

  const [chart, setChart] = useState<'revenue'|'orders'>('revenue');

  return (

    <AdminShell>

      <div className="admin-dashboard" style={{ width: '100%', maxWidth: 1300, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 20, boxSizing: 'border-box' }}>



        {/* Header */}

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>

          <div>

            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111b13', margin: '0 0 3px', letterSpacing: '-0.02em' }}>Good morning, Admin 👋</h2>

            <p style={{ fontSize: 13, color: '#9aaa9b', margin: 0 }}>Here&apos;s your store overview for today</p>

          </div>

          <div className="dashboard-header-actions" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>

            <button style={{ background: '#fff', color: '#5a6b61', border: '1px solid #eaefea', padding: '8px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 6 }}>

              <RefreshCw size={13} /> Refresh

            </button>

            <Link href="/admin/products" style={{ background: '#111b13', color: '#fff', textDecoration: 'none', padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6 }}>

              + Add Product

            </Link>

          </div>

        </div>



        {/* KPI */}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>

          {STATS.map(({ label, value, sub, change, up, icon: Icon, color, bg }) => (

            <div key={label} style={card}>

              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>

                <div>

                  <p style={{ fontSize: 11, fontWeight: 600, color: '#9aaa9b', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 8px' }}>{label}</p>

                  <p style={{ fontSize: 26, fontWeight: 800, color: '#111b13', margin: '0 0 4px', letterSpacing: '-0.03em', lineHeight: 1 }}>{value}</p>

                  <p style={{ fontSize: 12, color: '#9aaa9b', margin: 0 }}>{sub}</p>

                </div>

                <div style={{ width: 38, height: 38, borderRadius: 10, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>

                  <Icon size={18} color={color} />

                </div>

              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 14, paddingTop: 12, borderTop: '1px solid #f0f4f1' }}>

                {up ? <TrendingUp size={12} color="#2d7a47" /> : <TrendingDown size={12} color="#e53e3e" />}

                <span style={{ fontSize: 12, fontWeight: 700, color: up ? '#2d7a47' : '#e53e3e' }}>{change}</span>

                <span style={{ fontSize: 12, color: '#b0bbb0' }}>vs last month</span>

              </div>

            </div>

          ))}

        </div>



        {/* Pipeline */}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10 }}>

          {[

            { icon: Clock,       label: 'Pending',    count: 8,  color: '#6b7280', bg: '#f3f4f6' },

            { icon: Zap,         label: 'Processing', count: 14, color: '#2563eb', bg: '#eff6ff' },

            { icon: Package,     label: 'Shipped',    count: 7,  color: '#7c3aed', bg: '#f5f3ff' },

            { icon: CheckCircle, label: 'Delivered',  count: 42, color: '#2d7a47', bg: '#edf7f1' },

            { icon: XCircle,     label: 'Cancelled',  count: 3,  color: '#e53e3e', bg: '#fef2f2' },

          ].map(({ icon: Icon, label, count, color, bg }) => (

            <div key={label} style={{ ...card, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>

              <div style={{ width: 32, height: 32, borderRadius: 8, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>

                <Icon size={15} color={color} />

              </div>

              <div>

                <div style={{ fontSize: 18, fontWeight: 800, color, lineHeight: 1, letterSpacing: '-0.02em' }}>{count}</div>

                <div style={{ fontSize: 11, color: '#9aaa9b', marginTop: 1 }}>{label}</div>

              </div>

            </div>

          ))}

        </div>



        {/* Chart + Activity */}

        <div className="dashboard-chart-activity" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: 14, minWidth: 0 }}>

          <div style={card}>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>

              <div>

                <h3 style={cardTitle}>Weekly Overview</h3>

                <p style={{ fontSize: 12, color: '#9aaa9b', margin: '3px 0 0' }}>Last 7 days</p>

              </div>

              <div style={{ display: 'flex', gap: 6 }}>

                {(['revenue','orders'] as const).map(t => (

                  <button key={t} onClick={() => setChart(t)} style={{ padding: '5px 12px', borderRadius: 6, border: '1px solid', cursor: 'pointer', borderColor: chart===t?'#2d7a47':'#eaefea', background: chart===t?'#2d7a47':'#fff', color: chart===t?'#fff':'#9aaa9b', fontSize: 12, fontWeight: 500, textTransform: 'capitalize', fontFamily: 'inherit' }}>

                    {t}

                  </button>

                ))}

              </div>

            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 140 }}>

              {WEEKLY.map(d => {

                const val = chart==='revenue' ? d.revenue : d.orders*2;

                const pct = (val/MAX_R)*100;

                const peak = d.day==='Sat';

                return (

                  <div key={d.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, height: '100%', justifyContent: 'flex-end' }}>

                    <span style={{ fontSize: 10, color: '#9aaa9b', fontWeight: 600 }}>{chart==='revenue'?`${d.revenue}K`:d.orders}</span>

                    <div style={{ width: '100%', minHeight: 4, height: `${pct}%`, background: peak?'linear-gradient(to top,#1c6b3a,#4caf50)':'#e8f3ec', borderRadius: '5px 5px 0 0', transition: 'height 0.3s ease' }} />

                    <span style={{ fontSize: 10, color: '#b0bbb0', fontWeight: 500 }}>{d.day}</span>

                  </div>

                );

              })}

            </div>

          </div>

          <div style={card}>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>

              <h3 style={cardTitle}>Live Activity</h3>

              <span style={{ fontSize: 11, color: '#2d7a47', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>

                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#2d7a47', display: 'inline-block' }} /> Live

              </span>

            </div>

            {ACTIVITY.map((a, i) => (

              <div key={i} style={{ display: 'flex', gap: 10, padding: '9px 0', borderBottom: i<ACTIVITY.length-1?'1px solid #f4f6f4':'none' }}>

                <div style={{ width: 26, height: 26, borderRadius: 6, background: a.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>

                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: a.color, display: 'block' }} />

                </div>

                <div>

                  <p style={{ fontSize: 12, color: '#111b13', margin: '0 0 2px', lineHeight: 1.4, fontWeight: 500 }}>{a.text}</p>

                  <p style={{ fontSize: 11, color: '#b0bbb0', margin: 0 }}>{a.time}</p>

                </div>

              </div>

            ))}

          </div>

        </div>



        {/* Orders + Top Products + Low Stock */}

        <div className="dashboard-bottom-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 250px 240px', gap: 14, minWidth: 0 }}>

          <div style={{ ...card, padding: 0, overflow: 'hidden' }}>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid #f0f4f1' }}>

              <h3 style={cardTitle}>Recent Orders</h3>

              <Link href="/admin/orders" style={{ fontSize: 12, color: '#2d7a47', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}>View all <ArrowRight size={12} /></Link>

            </div>

            <div className="orders-table-scroll" style={{ width: '100%', overflowX: 'auto' }}>
              <table style={{ width: '100%', minWidth: 620, borderCollapse: 'collapse', fontSize: 13 }}>

              <thead>

                <tr style={{ background: '#fafcfa' }}>

                  {['Order','Customer','Amount','Status',''].map(h => (

                    <th key={h} style={{ padding: '9px 14px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: '#9aaa9b', textTransform: 'uppercase', letterSpacing: '0.07em', whiteSpace: 'nowrap' }}>{h}</th>

                  ))}

                </tr>

              </thead>

              <tbody>

                {ORDERS.map(o => {

                  const s = STATUS_CFG[o.status];

                  return (

                    <tr key={o.id} style={{ borderTop: '1px solid #f4f6f4' }}>

                      <td style={{ padding: '10px 14px', fontWeight: 700, color: '#111b13', fontSize: 12 }}>{o.id}</td>

                      <td style={{ padding: '10px 14px' }}>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>

                          <div style={{ width: 26, height: 26, borderRadius: '50%', background: AV_COLOR[o.av]||'#2d7a47', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 9, fontWeight: 700, flexShrink: 0 }}>{o.av}</div>

                          <div>

                            <div style={{ fontSize: 12, fontWeight: 600, color: '#111b13' }}>{o.customer}</div>

                            <div style={{ fontSize: 11, color: '#9aaa9b' }}>{o.items} items · {o.time}</div>

                          </div>

                        </div>

                      </td>

                      <td style={{ padding: '10px 14px', fontWeight: 700, color: '#111b13', fontSize: 12 }}>AED {o.amount.toLocaleString()}</td>

                      <td style={{ padding: '10px 14px' }}>

                        <span style={{ background: s.bg, color: s.color, fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 5, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.label}</span>

                      </td>

                      <td style={{ padding: '10px 14px' }}>

                        <Link href="/admin/orders" style={{ color: '#9aaa9b', display: 'flex', textDecoration: 'none' }}><Eye size={14} /></Link>

                      </td>

                    </tr>

                  );

                })}

              </tbody>

            </table>
            </div>

          </div>

          <div style={card}>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>

              <h3 style={cardTitle}>Top Products</h3>

              <Star size={14} color="#d4952a" fill="#d4952a" />

            </div>

            {TOP_PRODUCTS.map((p,i) => (

              <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: i<TOP_PRODUCTS.length-1?'1px solid #f4f6f4':'none' }}>

                <div style={{ width: 22, height: 22, borderRadius: 6, background: i<3?'#edf7f1':'#f4f6f4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>

                  <span style={{ fontSize: 10, fontWeight: 800, color: i<3?'#2d7a47':'#9aaa9b' }}>{i+1}</span>

                </div>

                <div style={{ flex: 1, minWidth: 0 }}>

                  <div style={{ fontSize: 12, fontWeight: 600, color: '#111b13', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>

                  <div style={{ fontSize: 11, color: '#9aaa9b' }}>{p.sales} sold · {p.revenue}</div>

                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>

                  {p.trend>0 ? <ArrowUpRight size={12} color="#2d7a47" /> : <TrendingDown size={12} color="#e53e3e" />}

                  <span style={{ fontSize: 11, fontWeight: 700, color: p.trend>0?'#2d7a47':'#e53e3e' }}>{Math.abs(p.trend)}%</span>

                </div>

              </div>

            ))}

          </div>

          <div style={card}>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>

              <h3 style={cardTitle}>Low Stock</h3>

              <Link href="/admin/products" style={{ fontSize: 12, color: '#2d7a47', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}>Fix <ArrowRight size={12} /></Link>

            </div>

            {LOW_STOCK.map((p,i) => (

              <div key={p.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: '9px 0', borderBottom: i<LOW_STOCK.length-1?'1px solid #f4f6f4':'none' }}>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>

                  <div style={{ width: 26, height: 26, borderRadius: 6, background: p.crit?'#fef2f2':'#fdf6ea', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>

                    <AlertTriangle size={12} color={p.crit?'#e53e3e':'#d4952a'} />

                  </div>

                  <div>

                    <div style={{ fontSize: 12, fontWeight: 600, color: '#111b13' }}>{p.name}</div>

                    <div style={{ fontSize: 11, color: '#9aaa9b' }}>{p.category}</div>

                  </div>

                </div>

                <div style={{ textAlign: 'right', flexShrink: 0 }}>

                  <div style={{ fontSize: 13, fontWeight: 800, color: p.crit?'#e53e3e':'#d4952a' }}>{p.stock}</div>

                  <div style={{ fontSize: 10, color: '#9aaa9b' }}>{p.unit}</div>

                </div>

              </div>

            ))}

            <div style={{ marginTop: 12, padding: '8px 10px', background: '#fef2f2', borderRadius: 7, display: 'flex', alignItems: 'center', gap: 6 }}>

              <AlertTriangle size={11} color="#e53e3e" />

              <span style={{ fontSize: 11, color: '#e53e3e', fontWeight: 600 }}>2 critical — restock now</span>

            </div>

          </div>

        </div>

      </div>

      <style jsx>{`
        .admin-dashboard {
          margin-inline: auto;
        }

        .dashboard-chart-activity > *,
        .dashboard-bottom-grid > * {
          min-width: 0;
        }

        .orders-table-scroll {
          max-width: 100%;
          -webkit-overflow-scrolling: touch;
        }

        @media (max-width: 1100px) {
          .dashboard-bottom-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }

        @media (max-width: 900px) {
          .dashboard-chart-activity {
            grid-template-columns: minmax(0, 1fr) !important;
          }
        }

        @media (max-width: 640px) {
          .admin-dashboard {
            gap: 14px !important;
          }

          .dashboard-bottom-grid {
            grid-template-columns: minmax(0, 1fr) !important;
          }

          .dashboard-header-actions {
            width: 100%;
          }

          .dashboard-header-actions > * {
            flex: 1 1 auto;
            justify-content: center;
          }
        }
      `}</style>

    </AdminShell>

  );

}