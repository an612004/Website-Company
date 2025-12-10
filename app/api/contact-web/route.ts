import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ContactWeb from '@/lib/models/contactWeb';

// GET - Lấy danh sách liên hệ
export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const status = searchParams.get('status');
        const search = searchParams.get('search');

        // Build query
        const query: Record<string, unknown> = {};

        if (status && status !== 'all') {
            query.status = status;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } },
            ];
        }

        // Count total
        const total = await ContactWeb.countDocuments(query);

        // Get data with pagination
        const contacts = await ContactWeb.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean();

        // Count by status
        const counts = {
            all: await ContactWeb.countDocuments(),
            new: await ContactWeb.countDocuments({ status: 'new' }),
            processing: await ContactWeb.countDocuments({ status: 'processing' }),
            completed: await ContactWeb.countDocuments({ status: 'completed' }),
            cancelled: await ContactWeb.countDocuments({ status: 'cancelled' }),
        };

        return NextResponse.json({
            success: true,
            data: contacts,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
            counts,
        });
    } catch (error) {
        console.error('Error fetching contacts:', error);
        return NextResponse.json(
            { success: false, error: 'Lỗi khi lấy danh sách liên hệ' },
            { status: 500 }
        );
    }
}

// POST - Tạo liên hệ mới
export async function POST(request: NextRequest) {
    console.log('📥 [API contact-web] Nhận request POST');
    
    try {
        console.log('🔌 [API contact-web] Đang kết nối MongoDB...');
        await connectDB();
        console.log('✅ [API contact-web] Kết nối MongoDB thành công');

        const body = await request.json();
        const { name, phone, email, subject, servicePackage, industry, message } = body;

        console.log('📋 [API contact-web] Dữ liệu nhận được:', {
            name, phone, email, subject, servicePackage, industry, message: message?.substring(0, 50)
        });

        // Validate required fields
        if (!name || !phone || !email || !subject || !servicePackage || !industry) {
            console.log('❌ [API contact-web] Thiếu thông tin bắt buộc');
            return NextResponse.json(
                { success: false, error: 'Vui lòng điền đầy đủ thông tin bắt buộc' },
                { status: 400 }
            );
        }

        // Validate phone format
        const phoneRegex = /^(\+84|0)[3|5|7|8|9][0-9]{8}$/;
        if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
            console.log('❌ [API contact-web] Số điện thoại không hợp lệ:', phone);
            return NextResponse.json(
                { success: false, error: 'Số điện thoại không hợp lệ' },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.log('❌ [API contact-web] Email không hợp lệ:', email);
            return NextResponse.json(
                { success: false, error: 'Email không đúng định dạng' },
                { status: 400 }
            );
        }

        console.log('💾 [API contact-web] Đang lưu vào MongoDB...');

        // Create new contact
        const newContact = await ContactWeb.create({
            name: name.trim(),
            phone: phone.replace(/\s/g, ''),
            email: email.toLowerCase().trim(),
            subject,
            servicePackage,
            industry,
            message: message?.trim() || '',
            status: 'new',
        });

        console.log('✅ [API contact-web] Lưu thành công! ID:', newContact._id);

        return NextResponse.json(
            {
                success: true,
                message: 'Gửi thông tin thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.',
                data: newContact,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('❌ [API contact-web] Lỗi:', error);

        // Handle mongoose validation errors
        if (error instanceof Error && error.name === 'ValidationError') {
            console.error('❌ [API contact-web] Validation Error:', error.message);
            return NextResponse.json(
                { success: false, error: error.message },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: false, error: 'Lỗi khi gửi thông tin. Vui lòng thử lại.' },
            { status: 500 }
        );
    }
}
