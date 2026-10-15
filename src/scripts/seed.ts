import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
  console.error('❌ Firebase credentials not found in .env.local');
  process.exit(1);
}

const app = initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }),
});

const db = getFirestore(app);

// ── Products ───────────────────────────────────────────────────────────────────

const products = [
  // ─── PREMIUM MANGOES ──────────────────────────────────────────────────
  {
    name: 'Mango Chaunsa Premium',
    slug: 'mango-chaunsa-premium',
    image: '/assets/chaunsa33.jpg',
    images: ['/assets/chaunsa33.jpg'],
    origin: 'Pakistan', originFlag: '🇵🇰',
    price: 25, pricePerKg: 25,
    unit: 'Kg', category: 'Premium Mangoes',
    badge: 'Bestseller',
    description: 'The king of Pakistani mangoes — silky smooth, honey-sweet, and intensely aromatic. Harvested at peak ripeness from Multan orchards.',
    stock: 50, inStock: true, featured: true,
    tags: ['mango', 'featured', 'bestseller'],
    weightOptions: ['1 Kg', '3 Kg Box', '5 Kg Box'],
    variants: [
      { label: '3 Kg Box', unit: '3 Kg Box', price: 70 },
      { label: '5 Kg Box', unit: '5 Kg Box', price: 115 },
    ],
  },
  {
    name: 'Anwar Ratol Mangoes',
    slug: 'anwar-ratol-mangoes',
    image: '/assets/anwaratol.jpg',
    images: ['/assets/anwaratol.jpg'],
    origin: 'Pakistan', originFlag: '🇵🇰',
    price: 23, pricePerKg: 23,
    unit: 'Kg', category: 'Premium Mangoes',
    description: 'Small, fibre-free, and bursting with intense sweetness. A prized variety from Rahim Yar Khan with a loyal following across the UAE.',
    stock: 40, inStock: true, featured: true,
    tags: ['mango', 'featured'],
    weightOptions: ['1 Kg', '3 Kg Box', '5 Kg Box'],
    variants: [
      { label: '3 Kg Box', unit: '3 Kg Box', price: 60 },
      { label: '5 Kg Box', unit: '5 Kg Box', price: 100 },
    ],
  },
  {
    name: 'Mango Sindhri Royal',
    slug: 'mango-sindhri-royal',
    image: '/assets/Sindri22.jpg',
    images: ['/assets/Sindri22.jpg'],
    origin: 'Pakistan', originFlag: '🇵🇰',
    price: 20, pricePerKg: 20,
    unit: 'Kg', category: 'Premium Mangoes',
    description: "Large, golden, and melt-in-the-mouth. Sindhri is Sindh's pride — mild, sweet, and perfect for fresh eating or smoothies.",
    stock: 45, inStock: true, featured: true,
    tags: ['mango', 'featured'],
    weightOptions: ['1 Kg', '3 Kg Box', '5 Kg Box'],
    variants: [
      { label: '3 Kg Box', unit: '3 Kg Box', price: 55 },
      { label: '5 Kg Box', unit: '5 Kg Box', price: 90 },
    ],
  },
  {
    name: 'Mango Dusehri',
    slug: 'mango-dusehri',
    image: '/assets/Dussehri.webp',
    images: ['/assets/Dussehri.webp'],
    origin: 'Pakistan', originFlag: '🇵🇰',
    price: 20, pricePerKg: 20,
    unit: 'Kg', category: 'Premium Mangoes',
    description: 'Long, slender, and fragrant with a rich yellow flesh. Dusehri is a classic summer mango prized for its distinct aroma and sweet taste.',
    stock: 35, inStock: true,
    tags: ['mango'],
    weightOptions: ['1 Kg', '3 Kg Box', '5 Kg Box'],
    variants: [
      { label: '3 Kg Box', unit: '3 Kg Box', price: 55 },
      { label: '5 Kg Box', unit: '5 Kg Box', price: 90 },
    ],
  },

  // ─── SEASONAL ─────────────────────────────────────────────────────────
  {
    name: 'Pakistani Jamun',
    slug: 'pakistani-jamun',
    image: '/assets/jamuns.jpg',
    images: ['/assets/jamuns.jpg'],
    origin: 'Pakistan', originFlag: '🇵🇰',
    price: 28, pricePerKg: 28,
    unit: 'Kg', category: 'Seasonal',
    badge: 'In Season',
    description: 'Deep purple, tangy-sweet Java plums — a beloved summer fruit known for its health benefits. Available for a short window each year.',
    stock: 30, inStock: true,
    tags: ['seasonal', 'in-season'],
    weightOptions: ['1 Kg', '3 Kg Box', '5 Kg Box'],
    variants: [
      { label: '3 Kg Box', unit: '3 Kg Box', price: 78 },
      { label: '5 Kg Box', unit: '5 Kg Box', price: 130 },
    ],
  },
  {
    name: 'Fresh Lychee',
    slug: 'fresh-lychee',
    image: '/assets/lycheees.jpg',
    images: ['/assets/lycheees.jpg'],
    origin: 'Pakistan', originFlag: '🇵🇰',
    price: 32, pricePerKg: 32,
    unit: 'Kg', category: 'Seasonal',
    badge: 'New Arrival',
    description: 'Juicy, floral, and refreshing — Pakistani lychees are a summer treat. Thin red skin with translucent white flesh and a sweet aroma.',
    stock: 25, inStock: true,
    tags: ['seasonal', 'new-arrival'],
    weightOptions: ['1 Kg', '3 Kg Box', '5 Kg Box'],
    variants: [
      { label: '3 Kg Box', unit: '3 Kg Box', price: 90 },
      { label: '5 Kg Box', unit: '5 Kg Box', price: 150 },
    ],
  },
  {
    name: 'Red Cherries',
    slug: 'red-cherries',
    image: '/assets/cherry.jpg',
    images: ['/assets/cherry.jpg'],
    origin: 'Pakistan', originFlag: '🇵🇰',
    price: 45, pricePerKg: 45,
    unit: 'Kg', category: 'Seasonal',
    description: 'Plump, deep-red cherries from the mountains of northern Pakistan. Sweet with a slight tartness — exceptional flavour in every bite.',
    stock: 20, inStock: true,
    tags: ['seasonal'],
    weightOptions: ['1 Kg', '3 Kg Box', '5 Kg Box'],
    variants: [
      { label: '3 Kg Box', unit: '3 Kg Box', price: 128 },
      { label: '5 Kg Box', unit: '5 Kg Box', price: 210 },
    ],
  },
  {
    name: 'Golden Apricots',
    slug: 'golden-apricots',
    image: '/assets/apricots.jpg',
    images: ['/assets/apricots.jpg'],
    origin: 'Pakistan', originFlag: '🇵🇰',
    price: 18, pricePerKg: 18,
    unit: 'Kg', category: 'Seasonal',
    description: 'Sun-kissed apricots from Hunza valley — golden, fragrant, and naturally sweet. A short-season gem direct from the mountains.',
    stock: 30, inStock: true,
    tags: ['seasonal'],
    weightOptions: ['1 Kg', '3 Kg Box', '5 Kg Box'],
    variants: [
      { label: '3 Kg Box', unit: '3 Kg Box', price: 50 },
      { label: '5 Kg Box', unit: '5 Kg Box', price: 85 },
    ],
  },

  // ─── EVERYDAY ─────────────────────────────────────────────────────────
  {
    name: 'Fresh Strawberries',
    slug: 'fresh-strawberries',
    image: '/assets/strwaberries.jpg',
    images: ['/assets/strwaberries.jpg'],
    origin: 'Imported', originFlag: '🌍',
    price: 22, pricePerKg: 22,
    unit: 'Box (500g)', category: 'Everyday',
    description: 'Bright red, fragrant strawberries — perfect for desserts, smoothies, or snacking. Freshly imported and delivered to your door.',
    stock: 40, inStock: true,
    tags: ['everyday'],
    weightOptions: ['Box (500g)'],
  },
  {
    name: 'Premium Red Apples',
    slug: 'premium-red-apples',
    image: '/assets/apples2.jpg',
    images: ['/assets/apples2.jpg'],
    origin: 'Imported', originFlag: '🌍',
    price: 15, pricePerKg: 15,
    unit: 'Kg', category: 'Everyday',
    description: 'Crisp, juicy red apples — a household staple. Great for snacking, baking, or lunchboxes.',
    stock: 60, inStock: true,
    tags: ['everyday'],
    weightOptions: ['1 Kg', '3 Kg Box', '5 Kg Box'],
    variants: [
      { label: '3 Kg Box', unit: '3 Kg Box', price: 42 },
      { label: '5 Kg Box', unit: '5 Kg Box', price: 70 },
    ],
  },
  {
    name: 'Pakistani Guava',
    slug: 'pakistani-guava',
    image: '/assets/guavas.avif',
    images: ['/assets/guavas.avif'],
    origin: 'Pakistan', originFlag: '🇵🇰',
    price: 14, pricePerKg: 14,
    unit: 'Kg', category: 'Everyday',
    description: 'Creamy white-fleshed guavas with a sweet, musky aroma. A vitamin C powerhouse and a childhood favourite for many.',
    stock: 50, inStock: true,
    tags: ['everyday'],
    weightOptions: ['1 Kg', '3 Kg Box', '5 Kg Box'],
    variants: [
      { label: '3 Kg Box', unit: '3 Kg Box', price: 38 },
      { label: '5 Kg Box', unit: '5 Kg Box', price: 62 },
    ],
  },
  {
    name: 'Sweet Watermelon',
    slug: 'sweet-watermelon',
    image: '/assets/watermelon.jpg',
    images: ['/assets/watermelon.jpg'],
    origin: 'UAE', originFlag: '🇦🇪',
    price: 8, pricePerKg: 8,
    unit: 'Kg', category: 'Everyday',
    description: 'Locally grown UAE watermelons — thick red flesh, incredibly sweet and hydrating. Perfect for the summer heat.',
    stock: 30, inStock: true,
    tags: ['everyday'],
    weightOptions: ['Per Kg'],
  },
  {
    name: 'Ripe Bananas',
    slug: 'ripe-bananas',
    image: '/assets/banana.jpg',
    images: ['/assets/banana.jpg'],
    origin: 'Imported', originFlag: '🌍',
    price: 6, pricePerKg: 6,
    unit: 'Kg', category: 'Everyday',
    description: 'Perfectly ripe, naturally sweet bananas — great for breakfast, smoothies, or baking. A daily essential for the whole family.',
    stock: 80, inStock: true,
    tags: ['everyday'],
    weightOptions: ['1 Kg', '3 Kg Box', '5 Kg Box'],
    variants: [
      { label: '3 Kg Box', unit: '3 Kg Box', price: 16 },
      { label: '5 Kg Box', unit: '5 Kg Box', price: 27 },
    ],
  },
];

// ── Seed ───────────────────────────────────────────────────────────────────────

async function seed() {
  try {
    console.log('🔄 Connecting to Firestore...');

    // Purana products data delete karein
    const productsRef = db.collection('products');
    const existingProducts = await productsRef.get();
    const deleteBatch = db.batch();
    existingProducts.docs.forEach((doc) => deleteBatch.delete(doc.ref));
    await deleteBatch.commit();

    // Naya products data insert karein
    const insertBatch = db.batch();
    products.forEach((product) => {
      const docRef = productsRef.doc(); // Auto-generated ID (MongoDB _id jaisa)
      insertBatch.set(docRef, {
        ...product,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });
    await insertBatch.commit();

    console.log(`✅ Seeded ${products.length} products`);
    console.log('   Premium Mangoes : Chaunsa, Anwar Ratol, Sindhri, Dusehri');
    console.log('   Seasonal        : Jamun, Lychee, Cherries, Apricots');
    console.log('   Everyday        : Strawberries, Apples, Guava, Watermelon, Bananas\n');

    // ── Admin user ─────────────────────────────────────────────────────────
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@store.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Husnain2244@';

    const usersRef = db.collection('users');
    const existingAdmin = await usersRef.where('email', '==', adminEmail).get();
    const adminDeleteBatch = db.batch();
    existingAdmin.docs.forEach((doc) => adminDeleteBatch.delete(doc.ref));
    await adminDeleteBatch.commit();

    await usersRef.add({
      name: 'Admin',
      email: adminEmail,
      passwordHash: await bcrypt.hash(adminPassword, 12),
      role: 'admin',
      phone: '+971 4 000 0000',
      addresses: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log(`✅ Admin user created`);
    console.log(`   Email:    ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
    console.log('\n💡 Update ADMIN_EMAIL and ADMIN_PASSWORD in .env.local to change credentials.');

    console.log('\n🎉 Seed complete! Aan Al Khair store is ready.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
}

seed();