import { requireAdmin } from '@/lib/adminGuard';
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { Timestamp } from 'firebase-admin/firestore';

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = Timestamp.fromDate(today);

    const ordersRef = db.collection('orders');
    const usersRef = db.collection('users');

    const [todayOrdersSnap, allOrdersSnap, pendingOrdersSnap, customersSnap, paidOrdersSnap] =
      await Promise.all([
        ordersRef.where('createdAt', '>=', todayTimestamp).get(),
        ordersRef.get(),
        ordersRef.where('status', 'in', ['placed', 'confirmed', 'packed']).get(),
        usersRef.where('role', '==', 'customer').get(),
        ordersRef.where('paymentStatus', '==', 'paid').get(),
      ]);

    const revenue = paidOrdersSnap.docs.reduce((sum, doc) => {
      const data = doc.data();
      return sum + (data.total || 0);
    }, 0);

    return NextResponse.json({
      success: true,
      stats: {
        todayOrders: todayOrdersSnap.size,
        totalOrders: allOrdersSnap.size,
        pendingOrders: pendingOrdersSnap.size,
        totalCustomers: customersSnap.size,
        revenue,
      },
    });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
  }
}