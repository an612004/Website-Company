import mongoose, { Schema, Document } from 'mongoose';

export interface IWebType extends Document {
  name: string;
  description: string;
  category: mongoose.Types.ObjectId;
  createdAt: Date;
}

const WebTypeSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  category: { type: Schema.Types.ObjectId, ref: 'WebCategory', required: true },
  createdAt: { type: Date, default: Date.now },
});

// Xóa model cũ nếu có (để cập nhật schema mới)
if (mongoose.models.WebType) {
  delete mongoose.models.WebType;
}

export default mongoose.model<IWebType>('WebType', WebTypeSchema);
