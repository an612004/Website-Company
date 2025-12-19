import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import WebProduct from '@/lib/models/webProduct';

export async function GET(request: Request, { params }: { params: { id: string } }) {
    await connectDB();
    const id = params.id;
    try {
        const product = await WebProduct.findById(id)
            .populate('category', 'name')
            .populate('type', 'name')
            .lean();
        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }
        return NextResponse.json({ product });
    } catch (err) {
        return NextResponse.json({ error: 'Invalid ID or server error' }, { status: 400 });
    }
}
