import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { FieldValue } from 'firebase-admin/firestore';
import { generateOrderNumber, calculateDeliveryFee } from '@/lib/utils';
import { getSessionUser, isAdminRole } from '@/lib/adminGuard';

// Anyone can place an order (guest checkout), but the client may NOT decide
// privileged fields such as status, paymentStatus, discount or userId.
export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json({ success: false, error: 'Cart is empty' }, { status: 400 });
    }

    const user = await getSessionUser();
    const subtotal = body.items.reduce(
      (s: number, i: { subtotal?: number }) => s + (Number(i.subtotal) || 0),
      0
    );
    const deliveryFee = calculateDeliveryFee(subtotal);

    const docRef = await db.collection('orders').add({
      items: body.items,
      deliveryAddress: body.deliveryAddress ?? null,
      paymentMethod: body.paymentMethod ?? null,
      userId: user?.id ?? null,
      orderNumber: generateOrderNumber(),
      subtotal,
      deliveryFee,
      discount: 0,
      total: subtotal + deliveryFee,
      status: 'placed',
      paymentStatus: 'pending',
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

// Customers only ever see their own orders; admins may list all or filter by userId.
export async function GET(req: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const admin = isAdminRole(user.role);
    const userId = admin ? searchParams.get('userId') : user.id ?? null;

    if (!admin && !userId) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

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
