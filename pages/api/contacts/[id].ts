import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../../lib/mongodb';
import Contact from '../../../lib/models/contact';
import mongoose from 'mongoose';

type ResponseData = {
    success: boolean;
    message?: string;
    data?: unknown;
    error?: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    await connectDB();

    const { id } = req.query;

    // Validate ObjectId
    if (!id || !mongoose.Types.ObjectId.isValid(id as string)) {
        return res.status(400).json({
            success: false,
            error: 'ID không hợp lệ',
        });
    }

    switch (req.method) {
        case 'GET':
            return getContact(req, res, id as string);
        case 'PUT':
        case 'PATCH':
            return updateContact(req, res, id as string);
        case 'DELETE':
            return deleteContact(req, res, id as string);
        default:
            res.setHeader('Allow', ['GET', 'PUT', 'PATCH', 'DELETE']);
            return res.status(405).json({
                success: false,
                error: `Method ${req.method} không được hỗ trợ`,
            });
    }
}

// GET - Lấy chi tiết liên hệ
async function getContact(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>,
    id: string
) {
    try {
        const contact = await Contact.findById(id).lean();

        if (!contact) {
            return res.status(404).json({
                success: false,
                error: 'Không tìm thấy liên hệ',
            });
        }

        return res.status(200).json({
            success: true,
            data: {
                id: contact._id.toString(),
                name: contact.name,
                email: contact.email,
                phone: contact.phone,
                service: contact.service,
                message: contact.message,
                status: contact.status,
                createdAt: contact.createdAt,
                updatedAt: contact.updatedAt,
            },
        });
    } catch (error) {
        console.error('Error fetching contact:', error);
        return res.status(500).json({
            success: false,
            error: 'Lỗi khi lấy thông tin liên hệ',
        });
    }
}

// PUT/PATCH - Cập nhật liên hệ (chủ yếu là cập nhật status)
async function updateContact(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>,
    id: string
) {
    try {
        const { status } = req.body;

        // Validate status
        const validStatuses = ['new', 'read', 'replied', 'archived'];
        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                error: 'Trạng thái không hợp lệ',
            });
        }

        const contact = await Contact.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        ).lean();

        if (!contact) {
            return res.status(404).json({
                success: false,
                error: 'Không tìm thấy liên hệ',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Cập nhật trạng thái thành công',
            data: {
                id: contact._id.toString(),
                status: contact.status,
            },
        });
    } catch (error) {
        console.error('Error updating contact:', error);
        return res.status(500).json({
            success: false,
            error: 'Lỗi khi cập nhật liên hệ',
        });
    }
}

// DELETE - Xóa liên hệ
async function deleteContact(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>,
    id: string
) {
    try {
        const contact = await Contact.findByIdAndDelete(id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                error: 'Không tìm thấy liên hệ',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Xóa liên hệ thành công',
        });
    } catch (error) {
        console.error('Error deleting contact:', error);
        return res.status(500).json({
            success: false,
            error: 'Lỗi khi xóa liên hệ',
        });
    }
}
