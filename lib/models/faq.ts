import mongoose, { Schema, Document } from 'mongoose';

export interface IFAQ extends Document {
  question: string;
  answer: string;
  createdAt: Date;
}

const FAQSchema: Schema = new Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
}, { collection: 'faqs' });

export default mongoose.models.FAQ || mongoose.model<IFAQ>('FAQ', FAQSchema);
