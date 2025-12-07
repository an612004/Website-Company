import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../../app/lib/mongodb';
import Product from '../../../lib/models/product';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  if (req.method === 'POST') {
    const { name, description, image, originalPrice, sellingPrice, isDiscount, stock, category, manufacturer, sold, rating } = req.body;
    if (!name || !category || !manufacturer) {
      return res.status(400).json({ error: 'Thiếu thông tin bắt buộc.' });
    }
    try {
      const product = new Product({ name, description, image, originalPrice, sellingPrice, isDiscount, stock, category, manufacturer, sold, rating });
      await product.save();
      return res.status(201).json({ success: true, product });
    } catch (error) {
      return res.status(500).json({ error: 'Lỗi server.' });
    }
  }

  if (req.method === 'GET') {
    try {
      const products = await Product.find().populate('category').populate('manufacturer');
      return res.status(200).json({ products });
    } catch {
      return res.status(500).json({ error: 'Lỗi server.' });
    }
  }

  if (req.method === 'PUT') {
    const { id, ...update } = req.body;
    if (!id) return res.status(400).json({ error: 'Thiếu id.' });
    try {
      const updated = await Product.findByIdAndUpdate(id, update, { new: true });
      if (!updated) return res.status(404).json({ error: 'Không tìm thấy sản phẩm.' });
      return res.status(200).json({ success: true, product: updated });
    } catch (error) {
      return res.status(500).json({ error: 'Lỗi server.' });
    }
  }

  if (req.method === 'DELETE') {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: 'Thiếu id.' });
    try {
      const deleted = await Product.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ error: 'Không tìm thấy sản phẩm.' });
      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(500).json({ error: 'Lỗi server.' });
    }
  }

  res.status(405).json({ error: 'Phương thức không hỗ trợ.' });
}
