import { requireAdmin } from '@/lib/adminGuard';
import { NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { db } from '@/lib/firebase';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const { id } = await params;
    const { status, note } = await req.json();

    const docRef = db.collection('orders').doc(id);
    const existing = await docRef.get();

    if (!existing.exists) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }

    await docRef.update({
    status,
    timeline: FieldValue.arrayUnion({ status, timestamp: new Date(), note: note || '' }), 
    });
    
    const updatedDoc = await docRef.get();
    const order = { id: updatedDoc.id, ...updatedDoc.data() };

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}