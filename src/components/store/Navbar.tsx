"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Menu, X, User, Search, LogIn, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useCartStore } from "@/store/cartStore";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const pathname = usePathname();
  const searchRef = useRef<HTMLInputElement>(null);

  const items = useCartStore((s) => s.items);
  const openCart = useCartStore((s) => s.openCart);
  const totalQty = items.reduce((s, i) => s + i.quantity, 0);
  const totalAmount = items.reduce(
    (s, i) => s + (Number(i.price) || 0) * i.quantity,
    0,
  );
  const fmt = (n: number) => n.toFixed(2);

  useEffect(() => { setMobileOpen(false); }, [pathname]);
  useEffect(() => { if (searchOpen) searchRef.current?.focus(); }, [searchOpen]);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".search-zone")) setSearchOpen(false);
    };
    if (searchOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(query)}`;
      setSearchOpen(false);
    }
  };

  const firstName = session?.user?.name?.split(' ')[0] || 'Account';

  const Logo = ({ iconSize = 62, fontSize = 20 }: { iconSize?: number; fontSize?: number }) => (
    <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
      <img
        src="/assets/logo-mark.png"
        alt="Maan Al Khair"
        style={{ width: iconSize, height: iconSize, objectFit: "contain" }}
      />
      <span style={{ lineHeight: 1, userSelect: "none" }}>
        <span style={{ display: "block", fontSize, fontWeight: 900, color: "#1a7a3c", letterSpacing: "-0.02em" }}>
          MAAN AL KHAIR
        </span>
        <span style={{ display: "block", fontSize: fontSize * 0.46, fontWeight: 600, letterSpacing: "0.22em", color: "#1a7a3c", opacity: 0.55, marginTop: 3 }}>
          FRUITS LLC
        </span>
      </span>
    </Link>
  );

  return (
    <>
      <header style={{ background: "#fff", borderBottom: "1px solid #e8e8e8", position: "sticky", top: 0, zIndex: 1000 }}>

        {/* ─── MOBILE ─── */}
        <div className="mobile-nav">
          {/* Row 1: Hamburger | Logo | spacer */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px 8px", borderBottom: "1px solid #f0f0f0" }}>
            <button onClick={() => setMobileOpen(!mobileOpen)} style={bare} aria-label="Menu">
              <Menu size={24} color="#444" strokeWidth={1.8} />
            </button>
            <Logo iconSize={62} fontSize={17} />
            <div style={{ width: 32 }} />
             <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px 10px" }}>
              {status === "authenticated" ? (
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  style={{ ...bare, color: "#555" }}
                  aria-label="Log Out"
                >
                  <LogOut size={18} color="#555" strokeWidth={1.6} />
                </button>
              ) : (
                <Link href="/login" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 4, color: "#555", fontSize: 13, fontWeight: 500, whiteSpace: "nowrap", flexShrink: 0 }}>
                  <LogIn size={18} color="#555" strokeWidth={1.6} />
                </Link>
              )}
              <button onClick={openCart} aria-label="Cart" style={{ display: "flex", alignItems: "center", gap: 6, borderRadius: 50, padding: "5px 10px 5px 8px", cursor: "pointer", flexShrink: 0, position: "relative", background: "none", border: "none" }}>
                <div style={{ position: "relative" }}>
                  <ShoppingCart size={22} color="#555" strokeWidth={1.6} />
                  <span style={{ position: "absolute", top: -7, right: -7, background: "#1a7a3c", color: "#fff", fontSize: 10, fontWeight: 900, width: 17, height: 17, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #fff", lineHeight: 1 }}>
                    {totalQty > 9 ? "9+" : totalQty}
                  </span>
                </div>
                <div style={{ lineHeight: 1.25, textAlign: "right" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#222" }}>{fmt(totalAmount)}</div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#888" }}>AED</div>
                </div>
              </button>
            </div>
          </div>

            {/* MOBILE SEARCH BAR — yahan add karo */}

              <form
                onSubmit={handleSearch}
                className="mobile-search"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  margin: "0 14px 10px",
                  padding: "10px 13px",
                  border: "1px solid #ddd",
                  borderRadius: 50,
                  background: "#f7f9f8",
                }}
              >
                <Search size={19} color="#555" />

                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search fruits, mangoes, vegetables..."
                  aria-label="Search products"
                  style={{
                    width: "100%",
                    minWidth: 0,
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    color: "#333",
                    fontFamily: "inherit",
                    fontSize: 14,
                  }}
                />

                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    aria-label="Clear search"
                    style={bare}
                  >
                    <X size={18} color="#555" />
                  </button>
                )}
              </form>
         </div>

        {/* ─── DESKTOP ─── */}
        <div className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: 16, padding: "0 32px", height: 72 }}>
          <Logo iconSize={54} fontSize={22} />

          {/* Nav links */}
          <nav style={{ display: "flex", alignItems: "center", gap: 4, marginLeft: 8, flex: 1 }}>
            {[["/#contact", "Contact"]].map(([href, label]) => (
              <Link key={href} href={href}
                style={{ padding: "6px 12px", fontSize: 14, fontWeight: 600, color: "#444", textDecoration: "none", borderRadius: 8, whiteSpace: "nowrap", transition: "background 0.15s, color 0.15s" }}
                onMouseEnter={(e) => { (e.target as HTMLElement).style.background = "#f0f9f4"; (e.target as HTMLElement).style.color = "#1a7a3c"; }}
                onMouseLeave={(e) => { (e.target as HTMLElement).style.background = "transparent"; (e.target as HTMLElement).style.color = "#444"; }}>
                {label}
              </Link>
            ))}
          </nav>

          {/* Right icons */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>

            {/* Expandable search */}
            <div className="search-zone" style={{ display: "flex", alignItems: "center", position: "relative" }}>
              <form onSubmit={handleSearch} style={{ display: "flex", alignItems: "center", overflow: "hidden", width: searchOpen ? 300 : 0, transition: "width 0.25s cubic-bezier(0.4,0,0.2,1)", opacity: searchOpen ? 1 : 0 }}>
                <input
                  ref={searchRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Escape" && setSearchOpen(false)}
                  placeholder="Search store…"
                  style={{ width: "100%", padding: "8px 16px 8px 14px", border: "1.5px solid #1a7a3c", borderRadius: 50, fontSize: 14, outline: "none", background: "#f7f9f8", fontFamily: "inherit", color: "#333", boxSizing: "border-box" }}
                />
              </form>
              <button onClick={() => setSearchOpen(!searchOpen)}
                style={{ ...bare, width: 38, height: 38, borderRadius: "50%", background: searchOpen ? "#f0f9f4" : "transparent", transition: "background 0.15s" }}
                aria-label="Toggle search">
                {searchOpen ? <X size={18} color="#1a7a3c" strokeWidth={2} /> : <Search size={20} color="#555" strokeWidth={1.7} />}
              </button>
            </div>

            {status === "authenticated" ? (
              <>
                {/* Logged-in user name */}
                <span style={{ fontSize: 13, fontWeight: 600, color: "#444", marginRight: 2, whiteSpace: "nowrap" }}>
                  Hi, {firstName}
                </span>

                {/* Log Out */}
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  style={{ display: "flex", alignItems: "center", gap: 5, background: "none", color: "#444", fontSize: 13, fontWeight: 600, padding: "7px 14px", border: "1.5px solid #ddd", borderRadius: 50, whiteSpace: "nowrap", cursor: "pointer", fontFamily: "inherit", transition: "border-color 0.15s, color 0.15s" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#e53e3e"; (e.currentTarget as HTMLElement).style.color = "#e53e3e"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#ddd"; (e.currentTarget as HTMLElement).style.color = "#444"; }}
                >
                  <LogOut size={15} strokeWidth={1.8} />
                  Log Out
                </button>
              </>
            ) : (
              <>
                {/* Account */}
                <Link href="/register"
                  style={{ ...bare, textDecoration: "none", width: 38, height: 38, borderRadius: "50%" }}
                  aria-label="Account"
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#f5f5f5")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}>
                  <User size={20} color="#555" strokeWidth={1.6} />
                </Link>

                {/* Log In */}
                <Link href="/login"
                  style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 5, color: "#444", fontSize: 13, fontWeight: 600, padding: "7px 14px", border: "1.5px solid #ddd", borderRadius: 50, whiteSpace: "nowrap", transition: "border-color 0.15s, color 0.15s" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#1a7a3c"; (e.currentTarget as HTMLElement).style.color = "#1a7a3c"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#ddd";    (e.currentTarget as HTMLElement).style.color = "#444"; }}>
                  <LogIn size={15} strokeWidth={1.8} />
                  Log In
                </Link>
              </>
            )}

            {/* Cart */}
            <button onClick={openCart} aria-label="Cart"
              style={{ display: "flex", alignItems: "center", gap: 7, background: "#1a7a3c", border: "none", borderRadius: 50, padding: "7px 14px 7px 10px", cursor: "pointer", flexShrink: 0, transition: "background 0.15s" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#156330")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#1a7a3c")}>
              <div style={{ position: "relative" }}>
                <ShoppingCart size={18} color="#fff" strokeWidth={1.8} />
                <span style={{ position: "absolute", top: -7, right: -7, background: "#fff", color: "#1a7a3c", fontSize: 9, fontWeight: 900, width: 15, height: 15, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}>
                  {totalQty > 9 ? "9+" : totalQty}
                </span>
              </div>
              <div style={{ lineHeight: 1.2, textAlign: "right" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{fmt(totalAmount)}</div>
                <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.7)", letterSpacing: "0.05em" }}>AED</div>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile slide-in menu */}
      {mobileOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1200, background: "#fff", overflowY: "auto" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #f0f0f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: "#1a7a3c" }}>Menu</span>
            <button onClick={() => setMobileOpen(false)} style={bare}><X size={24} color="#444" /></button>
          </div>
          <div style={{ padding: "8px 20px" }}>
            {[
              ["/", "🏠 Home"],
              ["/products?category=Mangoes",    "🥭 Mangoes"],
              ["/products?category=Fruits",     "🍎 Fruits"],
              ["/products?category=Vegetables", "🥦 Vegetables"],
              ["/#contact",                     "📞 Contact"],
            ].map(([href, label]) => (
              <Link key={href} href={href} onClick={() => setMobileOpen(false)}
                style={{ display: "block", padding: "15px 0", fontSize: 16, fontWeight: 600, color: "#222", textDecoration: "none", borderBottom: "1px solid #f5f5f5" }}>
                {label}
              </Link>
            ))}

            {status === "authenticated" ? (
              <div style={{ marginTop: 20 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#444", marginBottom: 10 }}>
                  Signed in as {session.user?.name || session.user?.email}
                </p>
                <button
                  onClick={() => { setMobileOpen(false); signOut({ callbackUrl: '/' }); }}
                  style={{ width: "100%", textAlign: "center", background: "#e53e3e", border: "none", borderRadius: 10, padding: "12px", fontSize: 14, fontWeight: 700, color: "#fff", cursor: "pointer", fontFamily: "inherit" }}
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                <Link href="/login"    onClick={() => setMobileOpen(false)} style={{ flex: 1, textAlign: "center", border: "1.5px solid #ddd", borderRadius: 10, padding: "12px", fontSize: 14, fontWeight: 600, color: "#333", textDecoration: "none" }}>Sign In</Link>
                <Link href="/register" onClick={() => setMobileOpen(false)} style={{ flex: 1, textAlign: "center", background: "#1a7a3c", borderRadius: 10, padding: "12px", fontSize: 14, fontWeight: 700, color: "#fff", textDecoration: "none" }}>Register</Link>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        .mobile-nav  { display: block; }
        .desktop-nav { display: none !important; }

        .mobile-search {
          display: flex;
        }

        @media (min-width: 768px) {
          .mobile-nav  { display: none !important; }
          .desktop-nav { display: flex !important; }

          .mobile-search {
            display: none !important;
          }
        }
      `}</style>

    </>
  );
}

const bare: React.CSSProperties = {
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: 4,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};
