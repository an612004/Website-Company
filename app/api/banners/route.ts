export async function DELETE(req: Request) {
  try {
    await connectDB();
    const mongoose = await connectDB();
    if (!mongoose.connection.db) throw new Error('MongoDB connection is not ready');
    const banners = mongoose.connection.db.collection('banners');
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    const result = await banners.deleteOne({ _id: new mongoose.mongo.ObjectId(id) });
    if (result.deletedCount === 1) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Banner not found or already deleted' }, { status: 404 });
    }
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { url, alt } = await req.json();
    if (!url) return NextResponse.json({ error: 'Missing url' }, { status: 400 });
    const mongoose = await connectDB();
    if (!mongoose.connection.db) throw new Error('MongoDB connection is not ready');
    const banners = mongoose.connection.db.collection('banners');
    const result = await banners.insertOne({ url, alt });
    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const mongoose = await connectDB();
    if (!mongoose.connection.db) throw new Error('MongoDB connection is not ready');
    const banners = mongoose.connection.db.collection('banners');
    const list = await banners.find({}).toArray();
    return NextResponse.json({ banners: list });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
