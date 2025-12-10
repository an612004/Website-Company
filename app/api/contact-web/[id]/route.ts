import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ContactWeb from '@/lib/models/contactWeb';
import mongoose from 'mongoose';

// GET - Lấy chi tiết một liên hệ
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { success: false, error: 'ID không hợp lệ' },
                { status: 400 }
            );
        }

        const contact = await ContactWeb.findById(id).lean();

        if (!contact) {
            return NextResponse.json(
                { success: false, error: 'Không tìm thấy liên hệ' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: contact,
        });
    } catch (error) {
        console.error('Error fetching contact:', error);
        return NextResponse.json(
            { success: false, error: 'Lỗi khi lấy thông tin liên hệ' },
            { status: 500 }
        );
    }
}

// PUT - Cập nhật trạng thái liên hệ
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { success: false, error: 'ID không hợp lệ' },
                { status: 400 }
            );
        }

        const body = await request.json();
        const { status } = body;

        // Validate status
        const validStatuses = ['new', 'processing', 'completed', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return NextResponse.json(
                { success: false, error: 'Trạng thái không hợp lệ' },
                { status: 400 }
            );
        }

        const updatedContact = await ContactWeb.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        ).lean();

        if (!updatedContact) {
            return NextResponse.json(
                { success: false, error: 'Không tìm thấy liên hệ' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Cập nhật trạng thái thành công',
            data: updatedContact,
        });
    } catch (error) {
        console.error('Error updating contact:', error);
        return NextResponse.json(
            { success: false, error: 'Lỗi khi cập nhật trạng thái' },
            { status: 500 }
        );
    }
}

// DELETE - Xóa liên hệ
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { success: false, error: 'ID không hợp lệ' },
                { status: 400 }
            );
        }

        const deletedContact = await ContactWeb.findByIdAndDelete(id);

        if (!deletedContact) {
            return NextResponse.json(
                { success: false, error: 'Không tìm thấy liên hệ' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Xóa liên hệ thành công',
        });
    } catch (error) {
        console.error('Error deleting contact:', error);
        return NextResponse.json(
            { success: false, error: 'Lỗi khi xóa liên hệ' },
            { status: 500 }
        );
    }
}
