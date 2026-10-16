import { requireAdmin } from '@/lib/adminGuard';
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const snapshot = await db.collection('orders').orderBy('createdAt', 'desc').get();

    const orders = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}