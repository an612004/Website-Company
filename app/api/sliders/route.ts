import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

export const runtime = 'nodejs';

// GET: Lấy danh sách slider
export async function GET() {
    try {
        const mongoose = await connectDB();
        if (!mongoose.connection.db) throw new Error('MongoDB connection is not ready');
        const sliders = mongoose.connection.db.collection('sliders');
        const list = await sliders.find({}).sort({ order: 1 }).toArray();
        return NextResponse.json({ sliders: list });
    } catch (error) {
        console.error('Lỗi lấy sliders:', error);
        return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
    }
}

// POST: Thêm slider mới
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { url, alt, order, link } = body;

        if (!url) {
            return NextResponse.json({ error: 'Thiếu URL ảnh' }, { status: 400 });
        }

        const mongoose = await connectDB();
        if (!mongoose.connection.db) throw new Error('MongoDB connection is not ready');
        const sliders = mongoose.connection.db.collection('sliders');

        // Kiểm tra số lượng slider hiện tại
        const count = await sliders.countDocuments();
        if (count >= 5) {
            return NextResponse.json({ error: 'Đã đạt tối đa 5 ảnh slider' }, { status: 400 });
        }

        const result = await sliders.insertOne({
            url,
            alt: alt || '',
            link: link || '',
            order: order ?? count,
            createdAt: new Date(),
        });

        return NextResponse.json({ 
            success: true, 
            sliderId: result.insertedId.toString() 
        });
    } catch (error) {
        console.error('Lỗi thêm slider:', error);
        return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
    }
}

// DELETE: Xóa slider
export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Thiếu ID slider' }, { status: 400 });
        }

        const mongoose = await connectDB();
        if (!mongoose.connection.db) throw new Error('MongoDB connection is not ready');
        const sliders = mongoose.connection.db.collection('sliders');

        const result = await sliders.deleteOne({
            _id: new mongoose.mongo.ObjectId(id)
        });

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: 'Không tìm thấy slider' }, { status: 404 });
        }

        // Cập nhật lại thứ tự sau khi xóa
        const remainingSliders = await sliders.find({}).sort({ order: 1 }).toArray();
        for (let i = 0; i < remainingSliders.length; i++) {
            await sliders.updateOne(
                { _id: remainingSliders[i]._id },
                { $set: { order: i } }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Lỗi xóa slider:', error);
        return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
    }
}

// PUT: Cập nhật thứ tự slider
export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();
        const { sliders: sliderList } = body;

        if (!sliderList || !Array.isArray(sliderList)) {
            return NextResponse.json({ error: 'Dữ liệu không hợp lệ' }, { status: 400 });
        }

        const mongoose = await connectDB();
        if (!mongoose.connection.db) throw new Error('MongoDB connection is not ready');
        const sliders = mongoose.connection.db.collection('sliders');

        // Cập nhật thứ tự cho từng slider
        for (let i = 0; i < sliderList.length; i++) {
            await sliders.updateOne(
                { _id: new mongoose.mongo.ObjectId(sliderList[i]._id) },
                { $set: { order: i } }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Lỗi cập nhật thứ tự slider:', error);
        return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
    }
}

// PATCH: Cập nhật tên và link slider
export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json();
        const { id, alt, link } = body;

        if (!id) {
            return NextResponse.json({ error: 'Thiếu ID slider' }, { status: 400 });
        }

        const mongoose = await connectDB();
        if (!mongoose.connection.db) throw new Error('MongoDB connection is not ready');
        const sliders = mongoose.connection.db.collection('sliders');

        const updateData: { alt?: string; link?: string } = {};
        if (alt !== undefined) updateData.alt = alt || '';
        if (link !== undefined) updateData.link = link || '';

        const result = await sliders.updateOne(
            { _id: new mongoose.mongo.ObjectId(id) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: 'Không tìm thấy slider' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Lỗi cập nhật tên slider:', error);
        return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
    }
}
