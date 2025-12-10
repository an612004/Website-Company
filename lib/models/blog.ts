import mongoose, { Schema, Document, Model } from 'mongoose';
import '../models/blogCategory';

export interface IBlog extends Document {
    title: string;
    slug: string;
    thumbnail: string;
    description: string;
    content: string;
    category: mongoose.Types.ObjectId;
    author: string;
    tags: string[];
    views: number;
    isPublished: boolean;
    isFeatured: boolean;
    publishedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const BlogSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, 'Vui lòng nhập tiêu đề'],
            trim: true,
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
        },
        thumbnail: {
            type: String,
            required: [true, 'Vui lòng thêm ảnh đại diện'],
        },
        description: {
            type: String,
            required: [true, 'Vui lòng nhập mô tả ngắn'],
            trim: true,
            maxlength: [500, 'Mô tả không quá 500 ký tự'],
        },
        content: {
            type: String,
            required: [true, 'Vui lòng nhập nội dung bài viết'],
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: 'BlogCategory',
            required: [true, 'Vui lòng chọn danh mục'],
        },
        author: {
            type: String,
            default: 'Admin',
        },
        tags: [{
            type: String,
            trim: true,
        }],
        views: {
            type: Number,
            default: 0,
        },
        isPublished: {
            type: Boolean,
            default: false,
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
        publishedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

// Tự động tạo slug từ title
BlogSchema.pre('save', async function () {
    if (this.isModified('title') || !this.slug) {
        this.slug = this.title
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
            + '-' + Date.now();
    }
});

// Index
BlogSchema.index({ category: 1, isPublished: 1, createdAt: -1 });
BlogSchema.index({ slug: 1 });

const Blog = (mongoose.models.Blog as Model<IBlog>) || mongoose.model<IBlog>('Blog', BlogSchema);
export default Blog;
