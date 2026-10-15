'use client';

import { useEffect, useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import { RefreshCw, Eye, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';

const STATUS_OPTIONS = [
  { value: 'placed', label: 'Placed', color: '#2563eb', bg: '#eff6ff' },
  { value: 'confirmed', label: 'Confirmed', color: '#7c3aed', bg: '#f5f3ff' },
  { value: 'packed', label: 'Packed', color: '#d4952a', bg: '#fdf6ea' },
  { value: 'out_for_delivery', label: 'Out for Delivery', color: '#0891b2', bg: '#ecfeff' },
  { value: 'delivered', label: 'Delivered', color: '#2d7a47', bg: '#edf7f1' },
  { value: 'cancelled', label: 'Cancelled', color: '#e53e3e', bg: '#fef2f2' },
];

interface Order {
  _id: string;
  orderNumber: string;
  deliveryAddress: {
    fullName: string;
    phone: string;
    emirate: string;
  };
  items: { name: string; quantity: number }[];
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  createdAt: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);

    try {
      const res = await fetch('/api/admin/orders');
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to load orders');
      }

      setOrders(Array.isArray(data.orders) ? data.orders : []);
    } catch {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchOrders();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);

    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setOrders((prev) =>
          prev.map((order) =>
            order._id === id ? { ...order, status } : order
          )
        );

        toast.success('Order status updated!');
      } else {
        toast.error(data.message || 'Failed to update');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setUpdating(null);
    }
  };

  const filtered = orders.filter(
    (order) =>
      statusFilter === 'all' || order.status === statusFilter
  );

  const getStatus = (value: string) =>
    STATUS_OPTIONS.find((status) => status.value === value) ||
    STATUS_OPTIONS[0];

  return (
    <AdminShell>
      <div style={{ maxWidth: 1200, width: '100%', minWidth: 0 }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 20,
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div>
            <h2
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: '#111b13',
                margin: 0,
              }}
            >
              Orders
            </h2>

            <p
              style={{
                fontSize: 13,
                color: '#9aaa9b',
                margin: '3px 0 0',
              }}
            >
              {orders.length} total orders
            </p>
          </div>

          <button onClick={fetchOrders} style={iconBtn}>
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>

        {/* Status filter pills */}
        <div
          style={{
            display: 'flex',
            gap: 8,
            marginBottom: 16,
            flexWrap: 'wrap',
          }}
        >
          {[{ value: 'all', label: 'All Orders' }, ...STATUS_OPTIONS].map(
            (status) => (
              <button
                key={status.value}
                onClick={() => setStatusFilter(status.value)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 50,
                  fontSize: 12,
                  fontWeight: 600,
                  border: '1.5px solid',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  borderColor:
                    statusFilter === status.value ? '#111b13' : '#eaefea',
                  background:
                    statusFilter === status.value ? '#111b13' : '#fff',
                  color:
                    statusFilter === status.value ? '#fff' : '#5a6b61',
                }}
              >
                {status.label}

                <span style={{ marginLeft: 5, opacity: 0.7 }}>
                  (
                  {status.value === 'all'
                    ? orders.length
                    : orders.filter(
                        (order) => order.status === status.value
                      ).length}
                  )
                </span>
              </button>
            )
          )}
        </div>

        {/* Orders table */}
        <div
          style={{
            background: '#fff',
            borderRadius: 12,
            border: '1px solid #eaefea',
            overflow: 'hidden',
            minWidth: 0,
          }}
        >
          {loading ? (
            <div
              style={{
                padding: 48,
                textAlign: 'center',
                color: '#9aaa9b',
              }}
            >
              Loading orders…
            </div>
          ) : filtered.length === 0 ? (
            <div
              style={{
                padding: 48,
                textAlign: 'center',
                color: '#9aaa9b',
              }}
            >
              <div style={{ fontSize: 36, marginBottom: 8 }}>📦</div>
              No orders yet. They'll appear here when customers place orders.
            </div>
          ) : (
            <div style={{ overflowX: 'auto', width: '100%' }}>
              <table
                style={{
                  width: '100%',
                  minWidth: 850,
                  borderCollapse: 'collapse',
                  fontSize: 13,
                }}
              >
                <thead>
                  <tr
                    style={{
                      background: '#fafcfa',
                      borderBottom: '1px solid #eaefea',
                    }}
                  >
                    {[
                      'Order #',
                      'Customer',
                      'Items',
                      'Total',
                      'Payment',
                      'Status',
                      'Date',
                      'Actions',
                    ].map((heading) => (
                      <th
                        key={heading}
                        style={{
                          padding: '10px 14px',
                          textAlign: 'left',
                          fontSize: 10,
                          fontWeight: 700,
                          color: '#9aaa9b',
                          textTransform: 'uppercase',
                          letterSpacing: '0.07em',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {filtered.map((order, index) => {
                    const status = getStatus(order.status);

                    // Use a stable unique key for each order.
                    // The index is only a fallback for records without an ID.
                    const orderKey =
                      order._id ||
                      order.orderNumber ||
                      `order-${index}`;

                    return (
                      <tr
                        key={orderKey}
                        style={{
                          borderTop: '1px solid #f4f6f4',
                          background:
                            index % 2 === 0 ? '#fff' : '#fdfeff',
                        }}
                      >
                        <td
                          style={{
                            padding: '12px 14px',
                            fontWeight: 700,
                            color: '#111b13',
                            fontSize: 12,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {order.orderNumber || '—'}
                        </td>

                        <td style={{ padding: '12px 14px' }}>
                          <div
                            style={{
                              fontWeight: 600,
                              color: '#111b13',
                            }}
                          >
                            {order.deliveryAddress?.fullName || 'Guest'}
                          </div>

                          <div
                            style={{ fontSize: 11, color: '#9aaa9b' }}
                          >
                            {order.deliveryAddress?.phone}
                          </div>

                          <div
                            style={{ fontSize: 11, color: '#9aaa9b' }}
                          >
                            {order.deliveryAddress?.emirate}
                          </div>
                        </td>

                        <td
                          style={{
                            padding: '12px 14px',
                            color: '#5a6b61',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {order.items?.length ?? 0} items
                        </td>

                        <td
                          style={{
                            padding: '12px 14px',
                            fontWeight: 700,
                            color: '#111b13',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          AED {(order.total ?? 0).toFixed(2)}
                        </td>

                        <td style={{ padding: '12px 14px' }}>
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 600,
                              padding: '2px 8px',
                              borderRadius: 5,
                              background:
                                order.paymentMethod === 'cod'
                                  ? '#fdf6ea'
                                  : '#eff6ff',
                              color:
                                order.paymentMethod === 'cod'
                                  ? '#d4952a'
                                  : '#2563eb',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {order.paymentMethod === 'cod'
                              ? '💵 COD'
                              : '💳 Card'}
                          </span>
                        </td>

                        <td style={{ padding: '12px 14px' }}>
                          <div
                            style={{
                              position: 'relative',
                              display: 'inline-block',
                            }}
                          >
                            <select
                              value={order.status}
                              disabled={updating === order._id}
                              onChange={(event) =>
                                updateStatus(order._id, event.target.value)
                              }
                              aria-label={`Status for order ${order.orderNumber}`}
                              style={{
                                appearance: 'none',
                                WebkitAppearance: 'none',
                                background: status.bg,
                                color: status.color,
                                border: `1.5px solid ${status.color}40`,
                                borderRadius: 6,
                                padding: '4px 24px 4px 8px',
                                fontSize: 11,
                                fontWeight: 700,
                                cursor: 'pointer',
                                fontFamily: 'inherit',
                                outline: 'none',
                                opacity:
                                  updating === order._id ? 0.6 : 1,
                              }}
                            >
                              {STATUS_OPTIONS.map((option) => (
                                <option
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </option>
                              ))}
                            </select>

                            <ChevronDown
                              size={11}
                              style={{
                                position: 'absolute',
                                right: 6,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: status.color,
                                pointerEvents: 'none',
                              }}
                            />
                          </div>
                        </td>

                        <td
                          style={{
                            padding: '12px 14px',
                            color: '#9aaa9b',
                            fontSize: 12,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString(
                                'en-AE',
                                {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                }
                              )
                            : '—'}
                        </td>

                        <td style={{ padding: '12px 14px' }}>
                          <a
                            href={`/track/${order._id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`View order ${order.orderNumber}`}
                            style={{
                              width: 30,
                              height: 30,
                              border: '1px solid #eaefea',
                              borderRadius: 6,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: '#fff',
                              textDecoration: 'none',
                              color: '#5a6b61',
                            }}
                          >
                            <Eye size={13} />
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}

const iconBtn: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  background: '#fff',
  border: '1px solid #eaefea',
  color: '#5a6b61',
  borderRadius: 8,
  padding: '8px 14px',
  fontSize: 13,
  fontWeight: 500,
  cursor: 'pointer',
  fontFamily: 'inherit',
};
