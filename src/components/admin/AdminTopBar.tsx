'use client';

import { usePathname } from 'next/navigation';
import { Bell, Search, ChevronDown } from 'lucide-react';

const BREADCRUMBS: Record<string, string[]> = {
  '/admin': ['Dashboard'],
  '/admin/products': ['Dashboard', 'Stock Management'],
  '/admin/orders': ['Dashboard', 'Orders'],
  '/admin/customers': ['Dashboard', 'Customers'],
  '/admin/staff': ['Dashboard', 'Staff'],
  '/admin/reports': ['Dashboard', 'Reports'],
  '/admin/settings': ['Dashboard', 'Settings'],
};

export default function AdminTopbar() {
  const pathname = usePathname();
  const crumbs = BREADCRUMBS[pathname] ?? ['Dashboard'];

  return (
    <>
      <header className="admin-topbar">
        {/* Breadcrumb */}
        <div className="admin-breadcrumb">
          {crumbs.map((c, i) => (
            <span key={c} className="admin-crumb-item">
              {i > 0 && (
                <span style={{ color: '#ccd5cc', fontSize: 13 }}>
                  /
                </span>
              )}

              <span
                style={{
                  fontSize: 13,
                  color:
                    i === crumbs.length - 1 ? '#111b13' : '#9aaa9b',
                  fontWeight: i === crumbs.length - 1 ? 600 : 400,
                }}
              >
                {c}
              </span>
            </span>
          ))}
        </div>

        {/* Right actions */}
        <div className="admin-topbar-actions">
          {/* Search */}
          <div className="admin-search">
            <Search
              size={13}
              className="admin-search-icon"
            />

            <input
              placeholder="Search anything…"
              aria-label="Search anything"
              className="admin-search-input"
            />
          </div>

          {/* Notifications */}
          <button
            type="button"
            aria-label="Notifications"
            className="admin-notification"
          >
            <Bell size={14} />

            <span className="admin-notification-dot" />
          </button>

          {/* Divider */}
          <div className="admin-topbar-divider" />

          {/* Admin avatar */}
          <div className="admin-profile">
            <div className="admin-avatar">AD</div>

            <div className="admin-profile-info">
              <span className="admin-profile-name">Admin</span>
              <span className="admin-profile-role">Super Admin</span>
            </div>

            <ChevronDown size={12} color="#9aaa9b" />
          </div>
        </div>
      </header>

      <style jsx>{`
        .admin-topbar {
          min-height: 56px;
          background: #fff;
          border-bottom: 1px solid #eaefea;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 24px;
          gap: 16px;
          flex-shrink: 0;
          box-sizing: border-box;
          width: 100%;
          min-width: 0;
        }

        .admin-breadcrumb {
          display: flex;
          align-items: center;
          gap: 6px;
          min-width: 0;
          flex-wrap: wrap;
        }

        .admin-crumb-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .admin-topbar-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 0;
        }

        .admin-search {
          position: relative;
          width: 200px;
          min-width: 0;
          flex-shrink: 1;
        }

        .admin-search-icon {
          position: absolute;
          left: 9px;
          top: 50%;
          transform: translateY(-50%);
          color: #b0bbb0;
          pointer-events: none;
        }

        .admin-search-input {
          box-sizing: border-box;
          width: 100%;
          min-width: 0;
          padding: 6px 12px 6px 28px;
          border: 1px solid #eaefea;
          border-radius: 7px;
          font-size: 12px;
          background: #f8faf8;
          outline: none;
          color: #111b13;
          font-family: inherit;
        }

        .admin-notification {
          width: 32px;
          height: 32px;
          flex-shrink: 0;
          border-radius: 7px;
          border: 1px solid #eaefea;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #9aaa9b;
          position: relative;
          padding: 0;
        }

        .admin-notification-dot {
          position: absolute;
          top: 5px;
          right: 5px;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #e53e3e;
          border: 1.5px solid #fff;
        }

        .admin-topbar-divider {
          width: 1px;
          height: 20px;
          background: #eaefea;
          flex-shrink: 0;
        }

        .admin-profile {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          flex-shrink: 0;
        }

        .admin-avatar {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          background: #111b13;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6ee0a0;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.05em;
          flex-shrink: 0;
        }

        .admin-profile-info {
          line-height: 1.3;
          display: flex;
          flex-direction: column;
        }

        .admin-profile-name {
          font-size: 12px;
          font-weight: 600;
          color: #111b13;
        }

        .admin-profile-role {
          font-size: 10px;
          color: #9aaa9b;
        }

        @media (max-width: 768px) {
          .admin-topbar {
            padding: 10px 14px;
            gap: 8px;
          }

          .admin-search {
            width: 150px;
          }
        }

        @media (max-width: 480px) {
          .admin-topbar {
            padding: 10px;
            gap: 6px;
          }

          .admin-topbar-actions {
            gap: 6px;
          }

          .admin-search {
            width: 120px;
          }

          .admin-profile-info,
          .admin-profile > :last-child {
            display: none;
          }

          .admin-topbar-divider {
            display: none;
          }
        }

        @media (max-width: 360px) {
          .admin-search {
            width: 95px;
          }

          .admin-search-input {
            font-size: 11px;
            padding-right: 4px;
          }

          .admin-breadcrumb,
          .admin-crumb-item {
            gap: 4px;
          }

          .admin-breadcrumb span {
            font-size: 11px !important;
          }
        }
      `}</style>
    </>
  );
}
