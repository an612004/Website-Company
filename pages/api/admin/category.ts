import type { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../../../app/lib/mongodb';
import Category from '../../../lib/models/category';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  if (req.method === 'POST') {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Thiếu tên loại sản phẩm.' });
    }
    try {
      const category = new Category({ name });
      await category.save();
      return res.status(201).json({ success: true, category });
    } catch (error) {
      return res.status(500).json({ error: 'Lỗi server.' });
    }
  }

  if (req.method === 'GET') {
    try {
      const categories = await Category.find();
      return res.status(200).json({ categories });
    } catch {
      return res.status(500).json({ error: 'Lỗi server.' });
    }
  }

  // Sửa loại sản phẩm
  if (req.method === 'PUT') {
    const { id, name } = req.body;
    if (!id || !name) {
      return res.status(400).json({ error: 'Thiếu thông tin.' });
    }
    try {
      const updated = await Category.findByIdAndUpdate(id, { name }, { new: true });
      if (!updated) return res.status(404).json({ error: 'Không tìm thấy loại.' });
      return res.status(200).json({ success: true, category: updated });
    } catch (error) {
      return res.status(500).json({ error: 'Lỗi server.' });
    }
  }

  // Xóa loại sản phẩm
  if (req.method === 'DELETE') {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: 'Thiếu id.' });
    try {
      const deleted = await Category.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ error: 'Không tìm thấy loại.' });
      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(500).json({ error: 'Lỗi server.' });
    }
  }

  res.status(405).json({ error: 'Phương thức không hỗ trợ.' });
}
