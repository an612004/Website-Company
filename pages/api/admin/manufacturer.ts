import type { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../../../app/lib/mongodb';
import Manufacturer from '../../../lib/models/manufacturer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  if (req.method === 'POST') {
    const { name, country } = req.body;
    if (!name || !country) {
      return res.status(400).json({ error: 'Thiếu tên hoặc quốc gia.' });
    }
    try {
      const manufacturer = new Manufacturer({ name, country });
      await manufacturer.save();
      return res.status(201).json({ success: true, manufacturer });
    } catch (error) {
      return res.status(500).json({ error: 'Lỗi server.' });
    }
  }

  if (req.method === 'GET') {
    try {
      const manufacturers = await Manufacturer.find();
      return res.status(200).json({ manufacturers });
    } catch {
      return res.status(500).json({ error: 'Lỗi server.' });
    }
  }

  // Sửa hãng sản xuất
  if (req.method === 'PUT') {
    const { id, name, country } = req.body;
    if (!id || !name || !country) {
      return res.status(400).json({ error: 'Thiếu thông tin.' });
    }
    try {
      const updated = await Manufacturer.findByIdAndUpdate(id, { name, country }, { new: true });
      if (!updated) return res.status(404).json({ error: 'Không tìm thấy hãng.' });
      return res.status(200).json({ success: true, manufacturer: updated });
    } catch (error) {
      return res.status(500).json({ error: 'Lỗi server.' });
    }
  }

  // Xóa hãng sản xuất
  if (req.method === 'DELETE') {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: 'Thiếu id.' });
    try {
      const deleted = await Manufacturer.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ error: 'Không tìm thấy hãng.' });
      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(500).json({ error: 'Lỗi server.' });
    }
  }

  res.status(405).json({ error: 'Phương thức không hỗ trợ.' });
}
