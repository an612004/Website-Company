import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../../app/lib/mongodb';
import WebType from '../../../lib/models/webType';
import '../../../lib/models/webCategory'; // Import để register model

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  // Lấy danh sách loại web
  if (req.method === 'GET') {
    try {
      const types = await WebType.find().populate('category').sort({ createdAt: -1 });
      return res.status(200).json({ types });
    } catch (error) {
      console.error('GET web-type error:', error);
      return res.status(500).json({ error: 'Lỗi server.' });
    }
  }

  // Thêm loại web mới
  if (req.method === 'POST') {
    const { name, description, category } = req.body;
    if (!name || !category) {
      return res.status(400).json({ error: 'Thiếu tên loại hoặc danh mục.' });
    }
    try {
      const type = new WebType({ name, description: description || '', category });
      await type.save();
      const populatedType = await WebType.findById(type._id).populate('category');
      return res.status(201).json({ success: true, type: populatedType });
    } catch (error) {
      console.error('POST web-type error:', error);
      return res.status(500).json({ error: 'Lỗi server.' });
    }
  }

  // Sửa loại web
  if (req.method === 'PUT') {
    const { id, name, description, category } = req.body;
    if (!id || !name || !category) {
      return res.status(400).json({ error: 'Thiếu thông tin.' });
    }
    try {
      const updated = await WebType.findByIdAndUpdate(id, { name, description, category }, { new: true }).populate('category');
      if (!updated) return res.status(404).json({ error: 'Không tìm thấy loại.' });
      return res.status(200).json({ success: true, type: updated });
    } catch (error) {
      console.error('PUT web-type error:', error);
      return res.status(500).json({ error: 'Lỗi server.' });
    }
  }

  // Xóa loại web
  if (req.method === 'DELETE') {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: 'Thiếu id.' });
    try {
      const deleted = await WebType.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ error: 'Không tìm thấy loại.' });
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('DELETE web-type error:', error);
      return res.status(500).json({ error: 'Lỗi server.' });
    }
  }

  res.status(405).json({ error: 'Phương thức không hỗ trợ.' });
}
