import { NextResponse } from 'next/server';
import cloudinary from 'cloudinary';
import type { UploadApiResponse } from 'cloudinary';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const file = data.get('file');
    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }
    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    // Upload to Cloudinary
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.v2.uploader.upload_stream(
        { resource_type: 'image', folder: 'banners' },
        (error: unknown, result?: UploadApiResponse) => {
          if (error || !result) reject(error ?? 'Unknown error');
          else resolve(result);
        }
      ).end(buffer);
    });
    return NextResponse.json({ url: result.secure_url });
  } catch (err) {
    return NextResponse.json({ error: 'Upload failed', details: String(err) }, { status: 500 });
  }
}
