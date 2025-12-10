import mongoose, { Schema, Document, Model } from 'mongoose';

// Interface cho ContactWeb
export interface IContactWeb extends Document {
    name: string;
    phone: string;
    email: string;
    subject: string;
    servicePackage: string;
    industry: string;
    message?: string;
    status: 'new' | 'processing' | 'completed' | 'cancelled';
    createdAt: Date;
    updatedAt: Date;
}

// Schema cho ContactWeb
const ContactWebSchema = new Schema<IContactWeb>(
    {
        name: {
            type: String,
            required: [true, 'Vui lòng nhập họ tên'],
            trim: true,
            minlength: [2, 'Họ tên phải có ít nhất 2 ký tự'],
        },
        phone: {
            type: String,
            required: [true, 'Vui lòng nhập số điện thoại'],
            trim: true,
            validate: {
                validator: function (v: string) {
                    return /^(\+84|0)[3|5|7|8|9][0-9]{8}$/.test(v.replace(/\s/g, ''));
                },
                message: 'Số điện thoại không hợp lệ',
            },
        },
        email: {
            type: String,
            required: [true, 'Vui lòng nhập email'],
            trim: true,
            lowercase: true,
            validate: {
                validator: function (v: string) {
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
                },
                message: 'Email không đúng định dạng',
            },
        },
        subject: {
            type: String,
            required: [true, 'Vui lòng chọn nội dung quan tâm'],
            enum: ['thiet-ke-website', 'thiet-ke-crm-erp', 'san-pham-so', 'phan-cung-thiet-bi'],
        },
        servicePackage: {
            type: String,
            required: [true, 'Vui lòng chọn gói dịch vụ'],
            enum: ['goi-co-ban', 'goi-nang-cao', 'goi-cao-cap', 'goi-tuy-chinh'],
        },
        industry: {
            type: String,
            required: [true, 'Vui lòng chọn lĩnh vực'],
            enum: [
                'thuong-mai-dien-tu',
                'bat-dong-san',
                'giao-duc',
                'y-te',
                'nha-hang-khach-san',
                'cong-nghe',
                'thoi-trang',
                'san-xuat',
                'khac',
            ],
        },
        message: {
            type: String,
            trim: true,
            maxlength: [1000, 'Nội dung không quá 1000 ký tự'],
        },
        status: {
            type: String,
            enum: ['new', 'processing', 'completed', 'cancelled'],
            default: 'new',
        },
    },
    {
        timestamps: true, // Tự động thêm createdAt và updatedAt
    }
);

// Index để tìm kiếm nhanh
ContactWebSchema.index({ status: 1, createdAt: -1 });
ContactWebSchema.index({ email: 1 });
ContactWebSchema.index({ phone: 1 });

// Kiểm tra model đã tồn tại chưa trước khi tạo mới
const ContactWeb: Model<IContactWeb> =
    mongoose.models.ContactWeb || mongoose.model<IContactWeb>('ContactWeb', ContactWebSchema);

export default ContactWeb;
