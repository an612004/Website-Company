import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import BlogCategory from '@/lib/models/blogCategory';

// GET - Lấy chi tiết danh mục
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        const category = await BlogCategory.findById(id).lean();

        if (!category) {
            return NextResponse.json(
                { success: false, error: 'Không tìm thấy danh mục' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: category });
    } catch (error) {
        console.error('Error fetching blog category:', error);
        return NextResponse.json(
            { success: false, error: 'Lỗi khi lấy thông tin danh mục' },
            { status: 500 }
        );
    }
}

// PUT - Cập nhật danh mục
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        const body = await request.json();
        const { name, description, order, isActive } = body;

        const category = await BlogCategory.findByIdAndUpdate(
            id,
            {
                ...(name && { name: name.trim() }),
                ...(description !== undefined && { description: description.trim() }),
                ...(order !== undefined && { order }),
                ...(isActive !== undefined && { isActive }),
            },
            { new: true, runValidators: true }
        );

        if (!category) {
            return NextResponse.json(
                { success: false, error: 'Không tìm thấy danh mục' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: category });
    } catch (error) {
        console.error('Error updating blog category:', error);
        return NextResponse.json(
            { success: false, error: 'Lỗi khi cập nhật danh mục' },
            { status: 500 }
        );
    }
}

// DELETE - Xóa danh mục
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        const category = await BlogCategory.findByIdAndDelete(id);

        if (!category) {
            return NextResponse.json(
                { success: false, error: 'Không tìm thấy danh mục' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, message: 'Đã xóa danh mục' });
    } catch (error) {
        console.error('Error deleting blog category:', error);
        return NextResponse.json(
            { success: false, error: 'Lỗi khi xóa danh mục' },
            { status: 500 }
        );
    }
}
