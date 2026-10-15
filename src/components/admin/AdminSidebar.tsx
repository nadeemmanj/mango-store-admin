'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  UserCog,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Leaf,
  Store,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard', badge: null },
  { href: '/admin/products', icon: Package, label: 'Stock', badge: '4' },
  { href: '/admin/orders', icon: ShoppingBag, label: 'Orders', badge: '8' },
  { href: '/admin/customers', icon: Users, label: 'Customers', badge: null },
  { href: '/admin/staff', icon: UserCog, label: 'Staff', badge: null },
  { href: '/admin/reports', icon: BarChart3, label: 'Reports', badge: null },
];

const WHITE = '#FFFFFF';

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: collapsed ? 68 : 240,
        minWidth: collapsed ? 68 : 240,
        height: '100vh',
        boxSizing: 'border-box',
        backgroundColor: '#111b13',
        color: WHITE,
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        position: 'relative',
        overflow: 'visible',
        transition: 'width 0.2s ease, min-width 0.2s ease',
        fontFamily: 'Arial, Helvetica, sans-serif',
      }}
    >
      {/* Logo */}
      <div
        style={{
          minHeight: 64,
          padding: collapsed ? '0 20px' : '0 16px',
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          gap: 11,
          flexShrink: 0,
          overflow: 'hidden',
          borderBottom: '1px solid rgba(255,255,255,0.15)',
        }}
      >
        <div
          style={{
            width: 30,
            height: 30,
            minWidth: 30,
            borderRadius: 7,
            backgroundColor: '#2d7a47',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Leaf size={17} color={WHITE} strokeWidth={2.2} />
        </div>

        {!collapsed && (
          <div style={{ minWidth: 0, overflow: 'hidden' }}>
            <div
              style={{
                color: WHITE,
                fontSize: 14,
                fontWeight: 800,
                lineHeight: '20px',
                whiteSpace: 'nowrap',
                textShadow: '0 1px 2px rgba(0,0,0,0.5)',
              }}
            >
              Maan Al Khair
            </div>

            <div
              style={{
                color: WHITE,
                fontSize: 10,
                fontWeight: 600,
                lineHeight: '16px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
              }}
            >
              Admin Panel
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav
        aria-label="Admin navigation"
        style={{
          flex: 1,
          minHeight: 0,
          padding: '12px 8px',
          boxSizing: 'border-box',
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        {!collapsed && (
          <div
            style={{
              color: WHITE,
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              padding: '10px 11px 9px',
            }}
          >
            MENU
          </div>
        )}

        {NAV_ITEMS.map(({ href, icon: Icon, label, badge }) => {
          const active =
            pathname === href ||
            (href !== '/admin' && pathname.startsWith(`${href}/`));

          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              aria-current={active ? 'page' : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: collapsed ? 'center' : 'flex-start',
                gap: 11,
                width: '100%',
                minHeight: 43,
                boxSizing: 'border-box',
                padding: collapsed ? '10px 0' : '10px 11px',
                margin: '3px 0',
                borderRadius: 7,
                backgroundColor: active
                  ? '#245D37'
                  : 'transparent',
                color: WHITE,
                textDecoration: 'none',
                fontSize: 13,
                lineHeight: '20px',
                fontWeight: 700,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textShadow: '0 1px 2px rgba(0,0,0,0.45)',
                transition: 'background-color 0.15s ease',
              }}
            >
              <Icon
                size={18}
                color={WHITE}
                strokeWidth={2.2}
                style={{ flexShrink: 0 }}
              />

              {!collapsed && (
                <>
                  <span
                    style={{
                      flex: 1,
                      minWidth: 0,
                      color: WHITE,
                      fontWeight: 700,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {label}
                  </span>

                  {badge !== null && (
                    <span
                      style={{
                        minWidth: 23,
                        height: 21,
                        padding: '0 6px',
                        boxSizing: 'border-box',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        borderRadius: 12,
                        backgroundColor: '#FFFFFF',
                        color: '#111b13',
                        fontSize: 11,
                        fontWeight: 800,
                        lineHeight: '21px',
                        textShadow: 'none',
                      }}
                    >
                      {badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom links */}
      <div
        style={{
          padding: '8px',
          boxSizing: 'border-box',
          flexShrink: 0,
          borderTop: '1px solid rgba(255,255,255,0.15)',
        }}
      >
        <Link
          href="/"
          title={collapsed ? 'Visit Store' : undefined}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            gap: 11,
            minHeight: 42,
            boxSizing: 'border-box',
            padding: collapsed ? '9px 0' : '9px 11px',
            borderRadius: 7,
            color: WHITE,
            fontSize: 12,
            fontWeight: 700,
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            textShadow: '0 1px 2px rgba(0,0,0,0.45)',
          }}
        >
          <Store size={17} color={WHITE} strokeWidth={2.2} />
          {!collapsed && <span>Visit Store</span>}
        </Link>

        <Link
          href="/admin/settings"
          title={collapsed ? 'Settings' : undefined}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            gap: 11,
            minHeight: 42,
            boxSizing: 'border-box',
            padding: collapsed ? '9px 0' : '9px 11px',
            borderRadius: 7,
            color: WHITE,
            fontSize: 12,
            fontWeight: 700,
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            textShadow: '0 1px 2px rgba(0,0,0,0.45)',
          }}
        >
          <Settings size={17} color={WHITE} strokeWidth={2.2} />
          {!collapsed && <span>Settings</span>}
        </Link>
      </div>

      {/* Collapse button */}
      <button
        type="button"
        onClick={() => setCollapsed((current) => !current)}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        style={{
          position: 'absolute',
          top: 20,
          right: -11,
          width: 23,
          height: 23,
          padding: 0,
          boxSizing: 'border-box',
          borderRadius: '50%',
          backgroundColor: '#2d7a47',
          border: '2px solid #111b13',
          color: WHITE,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
        }}
      >
        {collapsed ? (
          <ChevronRight size={14} color={WHITE} />
        ) : (
          <ChevronLeft size={14} color={WHITE} />
        )}
      </button>
    </aside>
  );
}
