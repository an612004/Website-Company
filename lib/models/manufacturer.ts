import mongoose, { Schema, Document } from 'mongoose';

export interface IManufacturer extends Document {
  name: string;
  country: string;
}

const ManufacturerSchema: Schema = new Schema({
  name: { type: String, required: true },
  country: { type: String, required: true },
});

export default mongoose.models.Manufacturer || mongoose.model<IManufacturer>('Manufacturer', ManufacturerSchema);
