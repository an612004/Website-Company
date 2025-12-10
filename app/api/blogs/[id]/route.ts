import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Blog from '@/lib/models/blog';
import mongoose from 'mongoose';

// GET - Lấy chi tiết bài viết (hỗ trợ cả id và slug)
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        
        // Kiểm tra xem id là ObjectId hay slug
        const isObjectId = mongoose.Types.ObjectId.isValid(id);
        
        let blog;
        if (isObjectId) {
            blog = await Blog.findById(id).populate('category', 'name slug').lean();
        } else {
            // Tìm theo slug và tăng view
            blog = await Blog.findOneAndUpdate(
                { slug: id },
                { $inc: { views: 1 } },
                { new: true }
            ).populate('category', 'name slug').lean();
        }

        if (!blog) {
            return NextResponse.json(
                { success: false, error: 'Không tìm thấy bài viết' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: blog });
    } catch (error) {
        console.error('Error fetching blog:', error);
        return NextResponse.json(
            { success: false, error: 'Lỗi khi lấy thông tin bài viết' },
            { status: 500 }
        );
    }
}

// PUT - Cập nhật bài viết
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        const body = await request.json();
        const { title, thumbnail, description, content, category, author, tags, isPublished, isFeatured } = body;

        const updateData: Record<string, unknown> = {};
        
        if (title) updateData.title = title.trim();
        if (thumbnail) updateData.thumbnail = thumbnail;
        if (description) updateData.description = description.trim();
        if (content) updateData.content = content;
        if (category) updateData.category = category;
        if (author) updateData.author = author;
        if (tags !== undefined) updateData.tags = tags;
        if (isPublished !== undefined) {
            updateData.isPublished = isPublished;
            if (isPublished) {
                updateData.publishedAt = new Date();
            }
        }
        if (isFeatured !== undefined) {
            updateData.isFeatured = isFeatured;
        }

        const blog = await Blog.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).populate('category', 'name slug');

        if (!blog) {
            return NextResponse.json(
                { success: false, error: 'Không tìm thấy bài viết' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: blog });
    } catch (error) {
        console.error('Error updating blog:', error);
        return NextResponse.json(
            { success: false, error: 'Lỗi khi cập nhật bài viết' },
            { status: 500 }
        );
    }
}

// DELETE - Xóa bài viết
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        const blog = await Blog.findByIdAndDelete(id);

        if (!blog) {
            return NextResponse.json(
                { success: false, error: 'Không tìm thấy bài viết' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, message: 'Đã xóa bài viết' });
    } catch (error) {
        console.error('Error deleting blog:', error);
        return NextResponse.json(
            { success: false, error: 'Lỗi khi xóa bài viết' },
            { status: 500 }
        );
    }
}
