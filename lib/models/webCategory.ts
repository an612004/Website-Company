import mongoose, { Schema, Document } from 'mongoose';

export interface IWebCategory extends Document {
  name: string;
  createdAt: Date;
}

const WebCategorySchema: Schema = new Schema({
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.WebCategory || mongoose.model<IWebCategory>('WebCategory', WebCategorySchema);
