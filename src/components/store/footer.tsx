import Link from 'next/link';
import { Leaf, MapPin, Phone, Clock, Share2, MessageCircle, Send } from 'lucide-react';

const HOURS = [
  { day: 'Mon – Thu', time: '8:00 AM – 10:00 PM' },
  { day: 'Friday',    time: '8:00 AM – 12:00 PM, 2:00 PM – 10:00 PM' },
  { day: 'Sat – Sun', time: '9:00 AM – 10:00 PM' },
];

const SOCIALS = [
  { icon: Share2,        href: 'https://instagram.com/maanalkhair', label: 'Instagram' },
  { icon: MessageCircle, href: 'https://facebook.com/maanalkhair',  label: 'Facebook'  },
  { icon: Send,          href: 'https://wa.me/971500000000',         label: 'WhatsApp'  },
];

const ZONES = ['Dubai Marina', 'JBR', 'Downtown', 'Jumeirah', 'Al Barsha', 'Deira', 'Sharjah', 'Abu Dhabi'];

export default function Footer() {
  return (
    <footer style={{ position: 'relative', overflow: 'hidden', background: '#0f2a1a', padding: '56px 24px 28px' }}>
      <div style={{
        maxWidth: 1280, margin: '0 auto',
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 36,
      }}>

        {/* About */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <Leaf size={22} color="#4ade80" />
            <span style={{ fontFamily: 'var(--font-display)', color: '#fff', fontSize: 18, fontWeight: 700 }}>
              Maan Al Khair
            </span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, lineHeight: 1.7 }}>
            Premium mangoes, fruits &amp; vegetables delivered fresh across the UAE — same-day, every day.
          </p>
          <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
            {SOCIALS.map((s, i) => (
              <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                style={{
                  width: 34, height: 34, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)',
                  transition: 'background 0.2s, color 0.2s',
                }}>
                <s.icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* Hours */}
        <div>
          <h4 style={fh}>
            <Clock size={15} style={{ display: 'inline', marginRight: 6, verticalAlign: -2 }} />
            Opening Hours
          </h4>
          {HOURS.map((h, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <p style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>{h.day}</p>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12.5 }}>{h.time}</p>
            </div>
          ))}
        </div>

        {/* Delivery Zones */}
        <div>
          <h4 style={fh}>
            <MapPin size={15} style={{ display: 'inline', marginRight: 6, verticalAlign: -2 }} />
            We Deliver To
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {ZONES.map((z, i) => (
              <span key={i} style={{
                fontSize: 12, color: 'rgba(255,255,255,0.6)',
                background: 'rgba(255,255,255,0.06)', padding: '5px 10px', borderRadius: 50,
              }}>
                {z}
              </span>
            ))}
          </div>
        </div>

      </div>

      <div style={{
        maxWidth: 1280, margin: '40px auto 0', paddingTop: 20,
        borderTop: '1px solid rgba(255,255,255,0.08)',
        textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 12,
      }}>
        © {new Date().getFullYear()} Maan Al Khair L.L.C. All rights reserved.
      </div>
    </footer>
  );
}

const fh: React.CSSProperties = { fontFamily: 'var(--font-display)', color: '#fff', fontSize: 15, fontWeight: 600, marginBottom: 18, paddingBottom: 10, borderBottom: '1px solid rgba(255,255,255,0.08)' };
const fl: React.CSSProperties = { color: 'rgba(255,255,255,0.55)', textDecoration: 'none', fontSize: 14, display: 'inline-block' };