import { requireAdmin } from '@/lib/adminGuard';
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { FieldValue } from 'firebase-admin/firestore';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    let productsRef: FirebaseFirestore.Query = db.collection('products');

    if (searchParams.get('featured') === 'true') {
      productsRef = productsRef.where('featured', '==', true);
    }
    if (searchParams.get('category')) {
      productsRef = productsRef.where('category', '==', searchParams.get('category'));
    }

    productsRef = productsRef.orderBy('createdAt', 'desc');

    const snapshot = await productsRef.get();
    const products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ success: true, products });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const body = await req.json();

    const docRef = await db.collection('products').add({
      ...body,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    const newDoc = await docRef.get();
    const product = { id: newDoc.id, ...newDoc.data() };

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
  }
}