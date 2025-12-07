import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  image: string;
  originalPrice: number;
  sellingPrice: number;
  isDiscount: boolean;
  stock: number;
  category: string; // category _id
  manufacturer: string; // manufacturer _id
  sold: number;
  rating: number;
  link: string; // link sản phẩm
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  originalPrice: { type: Number, required: true },
  sellingPrice: { type: Number, required: true },
  isDiscount: { type: Boolean, default: false },
  stock: { type: Number, default: 0 },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  manufacturer: { type: Schema.Types.ObjectId, ref: 'Manufacturer', required: true },
  sold: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  link: { type: String, default: '' },
});

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
