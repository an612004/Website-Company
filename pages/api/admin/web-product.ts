import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../../app/lib/mongodb';
import WebProduct from '../../../lib/models/webProduct';
import '../../../lib/models/webCategory'; // Import để register model
import '../../../lib/models/webType'; // Import để register model

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  // Lấy danh sách sản phẩm web
  if (req.method === 'GET') {
    try {
      const products = await WebProduct.find()
        .populate('category')
        .populate('type')
        .sort({ createdAt: -1 });
      return res.status(200).json({ products });
    } catch (error) {
      console.error('GET web-product error:', error);
      return res.status(500).json({ error: 'Lỗi server.' });
    }
  }

  // Thêm sản phẩm web mới
  if (req.method === 'POST') {
    const { name, description, image, originalPrice, sellingPrice, isDiscount, category, type, link } = req.body;
    if (!name || !category || !type) {
      return res.status(400).json({ error: 'Thiếu thông tin bắt buộc.' });
    }
    try {
      const product = new WebProduct({
        name,
        description: description || '',
        image: image || '',
        originalPrice: originalPrice || 0,
        sellingPrice: sellingPrice || 0,
        isDiscount: isDiscount || false,
        category,
        type,
        link: link || ''
      });
      await product.save();
      return res.status(201).json({ success: true, product });
    } catch (error) {
      return res.status(500).json({ error: 'Lỗi server.' });
    }
  }

  // Sửa sản phẩm web
  if (req.method === 'PUT') {
    const { id, ...update } = req.body;
    if (!id) return res.status(400).json({ error: 'Thiếu id.' });
    try {
      const updated = await WebProduct.findByIdAndUpdate(id, update, { new: true })
        .populate('category')
        .populate('type');
      if (!updated) return res.status(404).json({ error: 'Không tìm thấy sản phẩm.' });
      return res.status(200).json({ success: true, product: updated });
    } catch (error) {
      return res.status(500).json({ error: 'Lỗi server.' });
    }
  }

  // Xóa sản phẩm web
  if (req.method === 'DELETE') {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: 'Thiếu id.' });
    try {
      const deleted = await WebProduct.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ error: 'Không tìm thấy sản phẩm.' });
      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(500).json({ error: 'Lỗi server.' });
    }
  }

  res.status(405).json({ error: 'Phương thức không hỗ trợ.' });
}
