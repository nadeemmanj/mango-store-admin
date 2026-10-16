import { requireAdmin } from '@/lib/adminGuard';
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { FieldValue } from 'firebase-admin/firestore';

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const snapshot = await db.collection('products').orderBy('createdAt', 'desc').get();

    const products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ success: true, products });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const body = await req.json();

    const docRef = await db.collection('products').add({
      ...body,
      slug: body.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      images: body.image ? [body.image] : [],
      inStock: (body.stock ?? 0) > 0,
      pricePerKg: body.price,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    const newDoc = await docRef.get();
    const product = { id: newDoc.id, ...newDoc.data() };

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}