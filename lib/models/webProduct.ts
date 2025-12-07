import mongoose, { Schema, Document } from 'mongoose';

export interface IWebProduct extends Document {
  name: string;
  description: string;
  image: string;
  originalPrice: number;
  sellingPrice: number;
  isDiscount: boolean;
  category: string; // webCategory _id
  type: string; // webType _id
  link: string;
  createdAt: Date;
}

const WebProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  originalPrice: { type: Number, required: true, default: 0 },
  sellingPrice: { type: Number, required: true, default: 0 },
  isDiscount: { type: Boolean, default: false },
  category: { type: Schema.Types.ObjectId, ref: 'WebCategory', required: true },
  type: { type: Schema.Types.ObjectId, ref: 'WebType', required: true },
  link: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.WebProduct || mongoose.model<IWebProduct>('WebProduct', WebProductSchema);
