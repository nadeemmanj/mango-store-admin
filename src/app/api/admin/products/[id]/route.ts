import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { FieldValue } from 'firebase-admin/firestore';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();

    const docRef = db.collection('products').doc(id);
    const existing = await docRef.get();

    if (!existing.exists) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }

    const updateData: Record<string, any> = {
      ...body,
      images: body.image ? [body.image] : undefined,
      inStock: (body.stock ?? 0) > 0,
      pricePerKg: body.price,
      updatedAt: FieldValue.serverTimestamp(),
    };

    // undefined fields Firestore mein error deti hain, isliye clean karein
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === undefined) delete updateData[key];
    });

    await docRef.update(updateData);

    const updatedDoc = await docRef.get();
    const updated = { id: updatedDoc.id, ...updatedDoc.data() };

    return NextResponse.json({ success: true, product: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await db.collection('products').doc(id).delete();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}