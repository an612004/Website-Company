import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import FAQ from '@/lib/models/faq';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    await connectDB();
    const id = params.id;
    try {
        const result = await FAQ.findByIdAndDelete(id);
        if (!result) return NextResponse.json({ error: 'FAQ not found' }, { status: 404 });
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'Delete failed' }, { status: 400 });
    }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    await connectDB();
    const id = params.id;
    const { question, answer } = await request.json();
    try {
        const result = await FAQ.findByIdAndUpdate(id, { question, answer }, { new: true });
        if (!result) return NextResponse.json({ error: 'FAQ not found' }, { status: 404 });
        return NextResponse.json({ faq: result });
    } catch {
        return NextResponse.json({ error: 'Update failed' }, { status: 400 });
    }
}
