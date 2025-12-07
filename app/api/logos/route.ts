import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

export const runtime = 'nodejs';

// GET: Lấy danh sách logo nhãn hàng
export async function GET() {
    try {
        const mongoose = await connectDB();
        if (!mongoose.connection.db) throw new Error('MongoDB connection is not ready');
        const logos = mongoose.connection.db.collection('logos');
        const list = await logos.find({}).sort({ order: 1 }).toArray();
        return NextResponse.json({ logos: list });
    } catch (error) {
        console.error('Lỗi lấy logos:', error);
        return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
    }
}

// POST: Thêm logo mới
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { url, alt, link, order } = body;

        if (!url) {
            return NextResponse.json({ error: 'Thiếu URL ảnh' }, { status: 400 });
        }

        const mongoose = await connectDB();
        if (!mongoose.connection.db) throw new Error('MongoDB connection is not ready');
        const logos = mongoose.connection.db.collection('logos');

        // Kiểm tra số lượng logo hiện tại
        const count = await logos.countDocuments();
        if (count >= 10) {
            return NextResponse.json({ error: 'Đã đạt tối đa 10 logo nhãn hàng' }, { status: 400 });
        }

        const result = await logos.insertOne({
            url,
            alt: alt || '',
            link: link || '',
            order: order ?? count,
            createdAt: new Date(),
        });

        return NextResponse.json({ 
            success: true, 
            logoId: result.insertedId.toString() 
        });
    } catch (error) {
        console.error('Lỗi thêm logo:', error);
        return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
    }
}

// DELETE: Xóa logo
export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Thiếu ID logo' }, { status: 400 });
        }

        const mongoose = await connectDB();
        if (!mongoose.connection.db) throw new Error('MongoDB connection is not ready');
        const logos = mongoose.connection.db.collection('logos');

        const result = await logos.deleteOne({
            _id: new mongoose.mongo.ObjectId(id)
        });

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: 'Không tìm thấy logo' }, { status: 404 });
        }

        // Cập nhật lại thứ tự sau khi xóa
        const remainingLogos = await logos.find({}).sort({ order: 1 }).toArray();
        for (let i = 0; i < remainingLogos.length; i++) {
            await logos.updateOne(
                { _id: remainingLogos[i]._id },
                { $set: { order: i } }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Lỗi xóa logo:', error);
        return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
    }
}

// PATCH: Cập nhật thông tin logo
export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json();
        const { id, alt, link } = body;

        if (!id) {
            return NextResponse.json({ error: 'Thiếu ID logo' }, { status: 400 });
        }

        const mongoose = await connectDB();
        if (!mongoose.connection.db) throw new Error('MongoDB connection is not ready');
        const logos = mongoose.connection.db.collection('logos');

        const updateData: Record<string, string | Date> = { updatedAt: new Date() };
        if (alt !== undefined) updateData.alt = alt;
        if (link !== undefined) updateData.link = link;

        const result = await logos.updateOne(
            { _id: new mongoose.mongo.ObjectId(id) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: 'Không tìm thấy logo' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Lỗi cập nhật logo:', error);
        return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
    }
}
