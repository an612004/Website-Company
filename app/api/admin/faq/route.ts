import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import FAQ from '@/lib/models/faq';

export async function POST(request: Request) {
    await connectDB();
    const { question, answer } = await request.json();
    if (!question || !answer) {
        return NextResponse.json({ error: 'Missing question or answer' }, { status: 400 });
    }
    const faq = await FAQ.create({ question, answer });
    return NextResponse.json({ faq });
}

export async function GET() {
    await connectDB();
    const faqs = await FAQ.find().sort({ createdAt: -1 });
    return NextResponse.json({ faqs });
}
