import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import BlogCategory from '@/lib/models/blogCategory';

// GET - Lấy danh sách danh mục
export async function GET() {
    try {
        await connectDB();
        const categories = await BlogCategory.find().sort({ order: 1, createdAt: -1 }).lean();
        
        return NextResponse.json({
            success: true,
            data: categories,
        });
    } catch (error) {
        console.error('Error fetching blog categories:', error);
        return NextResponse.json(
            { success: false, error: 'Lỗi khi lấy danh sách danh mục' },
            { status: 500 }
        );
    }
}

// POST - Tạo danh mục mới
export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const body = await request.json();
        const { name, description, order, isActive } = body;

        if (!name) {
            return NextResponse.json(
                { success: false, error: 'Vui lòng nhập tên danh mục' },
                { status: 400 }
            );
        }

        const newCategory = await BlogCategory.create({
            name: name.trim(),
            description: description?.trim() || '',
            order: order || 0,
            isActive: isActive !== false,
        });

        return NextResponse.json(
            { success: true, data: newCategory },
            { status: 201 }
        );
    } catch (error: unknown) {
        console.error('Error creating blog category:', error);
        
        if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
            return NextResponse.json(
                { success: false, error: 'Tên danh mục đã tồn tại' },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: false, error: 'Lỗi khi tạo danh mục' },
            { status: 500 }
        );
    }
}
