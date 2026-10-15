'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';

const NAV = [
  {
    href: '/admin',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/admin/products',
    label: 'Products',
    icon: Package,
  },
  {
    href: '/admin/orders',
    label: 'Orders',
    icon: ShoppingBag,
  },
  {
    href: '/admin/customers',
    label: 'Customers',
    icon: Users,
  },
];

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const path = usePathname();
  const [open, setOpen] = useState(false);

  const currentPage =
    NAV.find(
      (n) =>
        n.href === path ||
        (n.href !== '/admin' && path.startsWith(n.href))
    )?.label || 'Admin';

  // Mobile menu close when navigating to another page.
  useEffect(() => {
    setOpen(false);
  }, [path]);

  // Prevent background page scrolling while mobile menu is open.
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <div className="admin-layout">
      {/* Mobile overlay */}
      {open && (
        <button
          type="button"
          className="admin-overlay"
          onClick={() => setOpen(false)}
          aria-label="Close navigation menu"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`admin-sidebar ${open ? 'sidebar-open' : ''}`}
      >
        {/* Logo */}
        <div className="admin-logo">
          <div className="admin-logo-content">
            <span className="admin-logo-icon">🥭</span>

            <div>
              <div className="admin-logo-title">
                Aan Al Khair
              </div>

              <div className="admin-logo-subtitle">
                Admin Panel
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="admin-nav">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active =
              path === href ||
              (href !== '/admin' && path.startsWith(href));

            return (             
              <Link
                key={href}
                href={href}
                className={`admin-nav-link ${active ? 'active' : ''}`}
                aria-current={active ? 'page' : undefined}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  gap: '8px',
                  width: '100%',
                  padding: '10px 9px',
                  fontSize: '15px',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  boxSizing: 'border-box',
                }}
              >
                <Icon
                  size={16}
                  style={{ flexShrink: 0, display: 'block' }}
                />
                <span
                  style={{
                    display: 'inline-block',
                    whiteSpace: 'nowrap',
                    flex: '1',
                  }}
                >
                  {label}
                </span>
              </Link>

            );
          })}
        </nav>

        {/* Bottom */}
        <div className="admin-sidebar-bottom">          
            <Link
              href="/"
              className="admin-store-link"
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: '8px',
                width: '100%',
                padding: '10px 9px',
                fontSize:'15px',
                fontWeight: 700,
                whiteSpace: 'nowrap',
                boxSizing: 'border-box',
        
              }}
            >
              <LogOut
                size={16}
                style={{ flexShrink: 0, display: 'block' }}
              />
              <span style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
                Back to Store
              </span>
            </Link>

        </div>
      </aside>

      {/* Main content area */}
      <div className="admin-main">
        {/* Topbar */}
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button
              type="button"
              onClick={() => setOpen((prev) => !prev)}
              className="mobile-menu-btn"
              aria-label={
                open ? 'Close navigation menu' : 'Open navigation menu'
              }
              aria-expanded={open}
            >
              {open ? <X size={21} /> : <Menu size={21} />}
            </button>

            <span className="admin-breadcrumb">
              {currentPage}
            </span>
          </div>

          <div className="admin-profile">
            <div className="admin-avatar">A</div>
            <span className="admin-profile-name">Admin</span>
          </div>
        </header>

        {/* Page content */}
        <main className="admin-page-content">
          {children}
        </main>
      </div>

      {/* Responsive styles */}
      <style jsx>{`
        .admin-layout {
          display: flex;
          width: 100%;
          min-height: 100vh;
          background: #f4f6f4;
          font-family: inherit;
          overflow-x: clip;
          box-sizing: border-box;
        }

        .admin-layout * {
          box-sizing: border-box;
        }

                
        /* Compact Sidebar */
        .admin-sidebar {
          width: 200px;
          min-width: 220px;
          height: 100vh;
          position: fixed;
          top: 0;
          left: 0;
          z-index: 100;
          display: flex;
          flex-direction: column;
          background: #111b13;
          color: #ffffff;
          overflow-y: auto;
          overflow-x: hidden;
        }

        /* Logo */
        .admin-logo {
          padding: 16px 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .admin-logo-content {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 8px;
          min-width: 0;
        }

        .admin-logo-icon {
          font-size: 21px;
          flex-shrink: 0;
        }

        .admin-logo-title {
          color: #fff;
          font-weight: 800;
          font-size: 15px;
          line-height: 1.2;
          white-space: nowrap;
        }

        .admin-logo-subtitle {
          color: #4caf70;
          font-size: 12px;
          margin-top: 4px;
        }

        /* Navigation */
        .admin-nav {
          flex: 1;
          padding: 10px 8px;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .admin-nav-link {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: flex-start;
          gap: 8px;
          width: 100%;
          padding: 10px 9px;
          border-radius: 7px;
          text-decoration: none;
          background: transparent;
          color: rgba(255, 255, 255, 0.8);
          font-size: 15px;
          line-height: 1.3;
          white-space: nowrap;
        }

        .admin-nav-link span {
          display: inline-block;
          white-space: nowrap;
        }

        .admin-nav-link :global(svg) {
          width: 16px;
          height: 16px;
          flex-shrink: 0;
        }

        .admin-nav-link:hover {
          background: rgba(255, 255, 255, 0.06);
          color: #fff;
        }

        .admin-nav-link.active {
          background: rgba(76, 175, 112, 0.15);
          color: #4caf70;
          font-weight: 700;
        }

        /* Main content alignment */
        .admin-main {
          flex: 1;
          min-width: 0;
          width: calc(100% - 190px);
          margin-left: 190px;
          display: flex;
          flex-direction: column;
        }

        /* Mobile */
        @media (max-width: 768px) {
          .admin-sidebar {
            width: 240px;
            min-width: 240px;
            max-width: 85vw;
            transform: translateX(-100%);
          }

          .admin-sidebar.sidebar-open {
            transform: translateX(0);
          }

          .admin-main {
            width: 100%;
            margin-left: 0;
          }
        }

        /* Navigation */
        .admin-nav {
           flex: 1;
           padding: 12px 10px;
           display: flex;
           flex-direction: column;
           align-items: stretch;
           gap: 4px;
           min-width: 0;
        }

        .admin-nav-link {
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: flex-start;
              gap: 10px;
              /* width: 100%; */
              min-width: 0;
              padding: 12px 12px;
              border-radius: 8px;
              text-decoration: none;
              background: transparent;
              color: rgba(255, 255, 255, 0.8);
              font-size: 14px;
              font-weight: 400;
              line-height: 1.4;
              white-space: nowrap;
              box-sizing: border-box;
              transition: background 0.15s ease, color 0.15s ease;        

        }

        .admin-nav-link:hover {
          background: rgba(255, 255, 255, 0.06);
          color: #fff;
        }

        .admin-nav-link span {
          display: inline-block;
          flex: 1;
          min-width: 0;
          white-space: nowrap;
        }

        .admin-nav-link.active {
          background: rgba(76, 175, 112, 0.15);
          color: #4caf70;
          font-weight: 700;
        }

        .admin-nav-link :global(svg) {
           display: block;
           width: 18px;
           height: 18px;
           flex-shrink: 0;
        }

        .admin-sidebar-bottom {
          padding: 12px 10px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .admin-store-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 8px;
          color: rgba(255, 255, 255, 0.55);
          font-size: 13px;
          text-decoration: none;
          transition: color 0.15s ease;
        }

        .admin-store-link:hover {
          color: #fff;
        }

        /* Main area */
        .admin-main {
          flex: 1;
          min-width: 0;
          width: calc(100% - 220px);
          margin-left: 220px;
          display: flex;
          flex-direction: column;
        }

        /* Topbar */
        .admin-topbar {
          min-height: 57px;
          width: 100%;
          padding: 12px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          background: #fff;
          border-bottom: 1px solid #eaefea;
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .admin-topbar-left {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
        }

        .admin-breadcrumb {
          font-size: 13px;
          color: #9aaa9b;
          overflow-wrap: anywhere;
        }

        .admin-profile {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .admin-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #111b13;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 12px;
          font-weight: 700;
          flex-shrink: 0;
        }

        .admin-profile-name {
          font-size: 13px;
          font-weight: 600;
          color: #111b13;
        }

        .mobile-menu-btn {
          display: none;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          flex-shrink: 0;
          border: 1px solid #eaefea;
          border-radius: 8px;
          background: #fff;
          color: #111b13;
          cursor: pointer;
        }

        .admin-page-content {
          flex: 1;
          width: 100%;
          min-width: 0;
          padding: 24px;
          overflow-x: clip;
        }

        .admin-overlay {
          display: none;
        }

        /* Tablet and mobile */
        @media (max-width: 768px) {
          .admin-sidebar {
            width: 260px;
            min-width: 260px;
            max-width: 85vw;
            left: 0;
            transform: translateX(-100%);
            box-shadow: none;
          }

          .admin-sidebar.sidebar-open {
            transform: translateX(0);
            box-shadow: 8px 0 30px rgba(0, 0, 0, 0.15);
          }

          .admin-main {
            width: 100%;
            margin-left: 0;
          }

          .mobile-menu-btn {
            display: flex;
          }

          .admin-overlay {
            display: block;
            position: fixed;
            inset: 0;
            width: 100%;
            height: 100%;
            padding: 0;
            margin: 0;
            border: none;
            background: rgba(0, 0, 0, 0.5);
            z-index: 99;
            cursor: pointer;
          }

          .admin-topbar {
            padding: 10px 16px;
          }

          .admin-page-content {
            padding: 20px 16px;
          }
        }

        /* Small mobile screens */
        @media (max-width: 480px) {
          .admin-topbar {
            padding: 10px 12px;
            gap: 8px;
          }

          .admin-topbar-left {
            gap: 9px;
          }

          .admin-page-content {
            padding: 16px 12px;
          }

          .admin-profile {
            gap: 6px;
          }

          .admin-avatar {
            width: 30px;
            height: 30px;
          }

          .admin-profile-name {
            font-size: 12px;
          }

          .mobile-menu-btn {
            width: 36px;
            height: 36px;
          }
        }
      `}</style>
    </div>
  );
}
