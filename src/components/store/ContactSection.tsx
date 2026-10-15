export default function ContactSection() {
  return (
    <section style={{ background: '#f8faf8', borderTop: '1px solid #e8f0e8', padding: '60px 24px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 40 }}>
        <div>
          <div style={{ fontSize: 28, marginBottom: 12 }}>🥭</div>
          <h3 style={{ fontWeight: 800, fontSize: 18, color: '#1a8a3c', marginBottom: 8 }}>Aan Al Khair L.L.C</h3>
          <p style={{ color: '#666', fontSize: 14, lineHeight: 1.7 }}>
            Premium mangoes from around the world, delivered fresh to your door across UAE.
          </p>
        </div>
        <div>
          <h4 style={{ fontWeight: 700, fontSize: 15, marginBottom: 12, color: '#222' }}>Quick Links</h4>
          {[
            { href: '/products', label: 'All Mangoes' },
            { href: '/track/search', label: 'Track Order' },
            { href: '/account', label: 'My Account' },
            { href: '/admin', label: 'Admin Panel' },
          ].map((l, i) => (
            <a key={i} href={l.href} style={{ display: 'block', color: '#666', fontSize: 14, marginBottom: 8, textDecoration: 'none' }}>
              → {l.label}
            </a>
          ))}
        </div>
        <div>
          <h4 style={{ fontWeight: 700, fontSize: 15, marginBottom: 12, color: '#222' }}>Contact Us</h4>
          <p style={{ color: '#666', fontSize: 14, lineHeight: 2 }}>
            📧 info@aanalkhair.ae<br />
            📞 +971 50 000 0000<br />
            📍 Dubai, UAE<br />
            ⏰ Sat–Thu: 8am–10pm
          </p>
        </div>
      </div>
    </section>
  );
}