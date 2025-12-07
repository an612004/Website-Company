import mongoose, { Schema, Document } from 'mongoose';

export interface IContact extends Document {
    name: string;
    email: string;
    phone: string;
    service: string;
    message: string;
    status: 'new' | 'read' | 'replied' | 'archived';
    createdAt: Date;
    updatedAt: Date;
}

const ContactSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Vui lòng nhập tên của bạn'],
            trim: true,
            maxlength: [100, 'Tên không được vượt quá 100 ký tự'],
        },
        email: {
            type: String,
            required: [true, 'Vui lòng nhập địa chỉ email'],
            trim: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, 'Địa chỉ email không hợp lệ'],
        },
        phone: {
            type: String,
            required: [true, 'Vui lòng nhập số điện thoại'],
            trim: true,
            match: [/^0(3[2-9]|5[2689]|7[06-9]|8[1-9]|9[0-9])\d{7}$/, 'Số điện thoại không hợp lệ (VD: 0912345678)'],
        },
        service: {
            type: String,
            required: [true, 'Vui lòng cho biết dịch vụ bạn cần'],
            trim: true,
            maxlength: [200, 'Tên dịch vụ không được vượt quá 200 ký tự'],
        },
        message: {
            type: String,
            required: [true, 'Vui lòng nhập nội dung lời nhắn'],
            trim: true,
            maxlength: [2000, 'Nội dung không được vượt quá 2000 ký tự'],
        },
        status: {
            type: String,
            enum: ['new', 'read', 'replied', 'archived'],
            default: 'new',
        },
    },
    {
        timestamps: true,
    }
);

// Tạo index để tìm kiếm nhanh hơn
ContactSchema.index({ email: 1 });
ContactSchema.index({ status: 1 });
ContactSchema.index({ createdAt: -1 });

export default mongoose.models.Contact || mongoose.model<IContact>('Contact', ContactSchema);
