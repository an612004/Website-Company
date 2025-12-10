import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Blog from '@/lib/models/blog';

// GET - Lấy danh sách bài viết
export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const category = searchParams.get('category');
        const search = searchParams.get('search');
        const isPublished = searchParams.get('isPublished');

        // Build query
        const query: Record<string, unknown> = {};

        if (category) {
            query.category = category;
        }

        if (isPublished !== null && isPublished !== undefined && isPublished !== '') {
            query.isPublished = isPublished === 'true';
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        const total = await Blog.countDocuments(query);
        const blogs = await Blog.find(query)
            .populate('category', 'name slug')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean();

        return NextResponse.json({
            success: true,
            data: blogs,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Error fetching blogs:', error);
        return NextResponse.json(
            { success: false, error: 'Lỗi khi lấy danh sách bài viết' },
            { status: 500 }
        );
    }
}

// POST - Tạo bài viết mới
export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const body = await request.json();
        const { title, thumbnail, description, content, category, author, tags, isPublished, isFeatured } = body;

        if (!title || !thumbnail || !description || !content || !category) {
            return NextResponse.json(
                { success: false, error: 'Vui lòng điền đầy đủ thông tin bắt buộc' },
                { status: 400 }
            );
        }

        const newBlog = await Blog.create({
            title: title.trim(),
            thumbnail,
            description: description.trim(),
            content,
            category,
            author: author || 'Admin',
            tags: tags || [],
            isPublished: isPublished || false,
            isFeatured: isFeatured || false,
            publishedAt: isPublished ? new Date() : undefined,
        });

        return NextResponse.json(
            { success: true, data: newBlog },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating blog:', error);
        return NextResponse.json(
            { success: false, error: 'Lỗi khi tạo bài viết' },
            { status: 500 }
        );
    }
}
