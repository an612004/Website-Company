import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBlogCategory extends Document {
    name: string;
    slug: string;
    description?: string;
    order: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const BlogCategorySchema = new Schema<IBlogCategory>(
    {
        name: {
            type: String,
            required: [true, 'Vui lòng nhập tên danh mục'],
            trim: true,
            unique: true,
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
        },
        description: {
            type: String,
            trim: true,
        },
        order: {
            type: Number,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// Tự động tạo slug từ name
BlogCategorySchema.pre('save', async function () {
    if (this.isModified('name') || !this.slug) {
        this.slug = this.name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
});

// Xóa model cũ nếu tồn tại (để tránh cache schema cũ)
if (mongoose.models.BlogCategory) {
    delete mongoose.models.BlogCategory;
}

const BlogCategory = mongoose.model<IBlogCategory>('BlogCategory', BlogCategorySchema);

export default BlogCategory;
