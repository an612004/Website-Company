import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../../app/lib/mongodb';
import WebCategory from '../../../lib/models/webCategory';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  // Lấy danh sách danh mục web
  if (req.method === 'GET') {
    try {
      const categories = await WebCategory.find().sort({ createdAt: -1 });
      return res.status(200).json({ categories });
    } catch (error) {
      return res.status(500).json({ error: 'Lỗi server.' });
    }
  }

  // Thêm danh mục web mới
  if (req.method === 'POST') {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Thiếu tên danh mục.' });
    }
    try {
      const category = new WebCategory({ name });
      await category.save();
      return res.status(201).json({ success: true, category });
    } catch (error) {
      return res.status(500).json({ error: 'Lỗi server.' });
    }
  }

  // Sửa danh mục web
  if (req.method === 'PUT') {
    const { id, name } = req.body;
    if (!id || !name) {
      return res.status(400).json({ error: 'Thiếu thông tin.' });
    }
    try {
      const updated = await WebCategory.findByIdAndUpdate(id, { name }, { new: true });
      if (!updated) return res.status(404).json({ error: 'Không tìm thấy danh mục.' });
      return res.status(200).json({ success: true, category: updated });
    } catch (error) {
      return res.status(500).json({ error: 'Lỗi server.' });
    }
  }

  // Xóa danh mục web
  if (req.method === 'DELETE') {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: 'Thiếu id.' });
    try {
      const deleted = await WebCategory.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ error: 'Không tìm thấy danh mục.' });
      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(500).json({ error: 'Lỗi server.' });
    }
  }

  res.status(405).json({ error: 'Phương thức không hỗ trợ.' });
}
