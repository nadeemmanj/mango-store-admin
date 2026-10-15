import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { FieldValue } from 'firebase-admin/firestore';
import { generateOrderNumber, calculateDeliveryFee } from '@/lib/utils';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const subtotal = body.items.reduce((s: number, i: any) => s + i.subtotal, 0);
    const deliveryFee = calculateDeliveryFee(subtotal);

    const docRef = await db.collection('orders').add({
      ...body,
      orderNumber: generateOrderNumber(),
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee - (body.discount || 0),
      timeline: [{ status: 'placed', timestamp: new Date(), note: 'Order received' }],
      createdAt: FieldValue.serverTimestamp(),
    });

    const newDoc = await docRef.get();
    const order = { id: newDoc.id, ...newDoc.data() };

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    let ordersRef: FirebaseFirestore.Query = db.collection('orders');

    if (userId) {
      ordersRef = ordersRef.where('userId', '==', userId);
    }

    ordersRef = ordersRef.orderBy('createdAt', 'desc');

    const snapshot = await ordersRef.get();
    const orders = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ success: true, orders });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
  }
}