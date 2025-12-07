import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../../lib/mongodb';
import Contact from '../../../lib/models/contact';
import nodemailer from 'nodemailer';

type ResponseData = {
    success: boolean;
    message?: string;
    data?: unknown;
    error?: string;
};

// Cấu hình nodemailer với Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

// Hàm gửi email xác nhận
async function sendConfirmationEmail(to: string, name: string, service: string, message: string) {
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Xác nhận đã nhận liên hệ</title>
        <style>
            /* Reset cơ bản */
            body { margin: 0; padding: 0; background-color: #f7f8fc; }
            a { text-decoration: none; color: #c81d4e; }
            /* Cảm giác nâng lên cho nội dung chính */
            .main-container {
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08); /* Đổ bóng nhẹ */
            }
        </style>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f7f8fc;">
        <div class="main-container" style="max-width: 600px; margin: 30px auto; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
            <div style="background: linear-gradient(135deg, #c81d4e 0%, #ff4e50 60%, #fc913a 100%); padding: 30px 30px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 26px; letter-spacing: 1px; font-weight: 700;">
                    ✨ ANBI COMPANY
                </h1>
                <p style="color: rgba(255,255,255,0.8); margin: 5px 0 0 0; font-size: 14px;">
                    Digital Marketing & Solutions
                </p>
            </div>
            
            <div style="padding: 40px 30px 25px 30px;">
               <div style="text-align: center; margin-bottom: 30px;">
                    <img 
                        src="https://res.cloudinary.com/dbrqeq09u/image/upload/v1764688429/Screenshot_2025-12-02_220744_wjga3b.png" 
                        alt="Xác nhận thành công" 
                        width="60" 
                        height="60" 
                        style="display: block; margin: 0 auto 15px; border-radius: 50%; object-fit: cover; border: 4px solid #10b981; padding: 2px; box-shadow: 0 2px 10px rgba(16, 185, 129, 0.3);"
                    >
                    <h2 style="color: #1f2937; margin: 0 0 5px 0; font-size: 22px; font-weight: 600;">
                        Liên hệ của bạn đã được ghi nhận
                    </h2>
                </div>
                
                <p style="color: #374151; font-size: 16px; line-height: 1.7; margin-bottom: 20px;">
                    Xin chào <strong style="color: #c81d4e; font-weight: 700;">${name}</strong>,
                </p>
                
                <p style="color: #374151; font-size: 16px; line-height: 1.7; margin-bottom: 25px;">
                    Cảm ơn bạn đã quan tâm đến **Anbi Company**! Chúng tôi đã nhận được thông tin và sẽ phản hồi đến bạn trong thời gian sớm nhất (thường trong vòng **24 giờ làm việc**).
                </p>
                
                <div style="background-color: #fffbeb; border-radius: 8px; padding: 20px; margin-bottom: 25px; border-left: 5px solid #f59e0b;">
                    <h3 style="color: #92400e; margin: 0 0 10px 0; font-size: 15px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                        📝 Chi tiết yêu cầu của bạn:
                    </h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 6px 0; color: #78716c; font-size: 14px; width: 140px; border-bottom: 1px dashed #fde68a;">Dịch vụ quan tâm:</td>
                            <td style="padding: 6px 0; color: #1f2937; font-size: 14px; font-weight: 600; border-bottom: 1px dashed #fde68a;">${service}</td>
                        </tr>
                        <tr>
                            <td style="padding: 6px 0; color: #78716c; font-size: 14px; vertical-align: top;">Nội dung tin nhắn:</td>
                            <td style="padding: 6px 0; color: #1f2937; font-size: 14px; word-break: break-word;">${message}</td>
                        </tr>
                    </table>
                </div>
                
                <div style="background-color: #f0f4ff; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 30px; border: 1px solid #d4e0ff;">
                    <h3 style="color: #374151; margin: 0 0 15px 0; font-size: 18px;">
                        Cần hỗ trợ gấp?
                    </h3>
                    <a href="tel:0847755599" style="background-color: #c81d4e; color: #ffffff; padding: 12px 25px; border-radius: 6px; font-size: 16px; font-weight: bold; display: inline-block; text-transform: uppercase; letter-spacing: 0.5px;">
                        📞 Gọi Hotline: 084.77555.99
                    </a>
                    <p style="margin: 15px 0 0 0; color: #6b7280; font-size: 14px;">
                        Hoặc gửi email đến: <a href="mailto:cskh@websiteviet.vn" style="color: #3b82f6; text-decoration: underline;">cskh@websiteviet.vn</a>
                    </p>
                </div>
                
                <p style="color: #6b7280; font-size: 14px; line-height: 1.6; text-align: center; margin-bottom: 0;">
                    Chúng tôi mong sớm được hợp tác cùng bạn!
                </p>
            </div>
            
            <div style="background-color: #1f2937; padding: 30px 30px 20px 30px; text-align: center;">
                <p style="color: #9ca3af; font-size: 14px; margin: 0 0 8px 0;">
                    © ${new Date().getFullYear()} Anbi Company. All rights reserved.
                </p>
                <p style="color: #6b7280; font-size: 12px; margin: 0 0 15px 0; line-height: 1.5;">
                    Toà nhà Thanh Niên Holdings, Số 633 Trần Xuân Soạn, P. Tân Hưng, Quận 7, TP.HCM
                </p>
                <div style="margin-top: 15px;">
                    <a href="#" style="display: inline-block; margin: 0 8px; color: #9ca3af; font-size: 18px; line-height: 1; padding: 6px; border-radius: 4px; border: 1px solid #374151;">
                        <span style="font-family: Arial, sans-serif;">f</span>
                    </a>
                    <a href="#" style="display: inline-block; margin: 0 8px; color: #9ca3af; font-size: 18px; line-height: 1; padding: 6px; border-radius: 4px; border: 1px solid #374151;">
                        <span style="font-family: Arial, sans-serif;">ig</span>
                    </a>
                    <a href="#" style="display: inline-block; margin: 0 8px; color: #9ca3af; font-size: 18px; line-height: 1; padding: 6px; border-radius: 4px; border: 1px solid #374151;">
                        <span style="font-family: Arial, sans-serif;">in</span>
                    </a>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;

    const mailOptions = {
        from: `"Anbi Company" <${process.env.GMAIL_USER}>`,
        to: to,
        subject: '✅ Xác nhận đã nhận liên hệ - Anbi Company',
        html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    await connectDB();

    switch (req.method) {
        case 'GET':
            return getContacts(req, res);
        case 'POST':
            return createContact(req, res);
        default:
            res.setHeader('Allow', ['GET', 'POST']);
            return res.status(405).json({
                success: false,
                error: `Method ${req.method} không được hỗ trợ`,
            });
    }
}

// GET - Lấy danh sách liên hệ (cho admin)
async function getContacts(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    try {
        const { status, page = 1, limit = 20 } = req.query;

        const query: Record<string, unknown> = {};
        if (status && status !== 'all') {
            query.status = status;
        }

        const skip = (Number(page) - 1) * Number(limit);

        const [contacts, total] = await Promise.all([
            Contact.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit))
                .lean(),
            Contact.countDocuments(query),
        ]);

        // Đếm theo trạng thái
        const statusCounts = await Contact.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                },
            },
        ]);

        const counts = {
            all: total,
            new: 0,
            read: 0,
            replied: 0,
            archived: 0,
        };

        statusCounts.forEach((item: { _id: string; count: number }) => {
            counts[item._id as keyof typeof counts] = item.count;
        });

        return res.status(200).json({
            success: true,
            data: {
                contacts: contacts.map((c) => ({
                    id: c._id.toString(),
                    name: c.name,
                    email: c.email,
                    phone: c.phone,
                    service: c.service,
                    message: c.message,
                    status: c.status,
                    createdAt: c.createdAt,
                })),
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total,
                    totalPages: Math.ceil(total / Number(limit)),
                },
                counts,
            },
        });
    } catch (error) {
        console.error('Error fetching contacts:', error);
        return res.status(500).json({
            success: false,
            error: 'Lỗi khi lấy danh sách liên hệ',
        });
    }
}

// POST - Tạo liên hệ mới (từ form người dùng)
async function createContact(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    try {
        const { name, email, phone, service, message } = req.body;

        // Validate dữ liệu
        if (!name || !email || !phone || !service || !message) {
            return res.status(400).json({
                success: false,
                error: 'Vui lòng điền đầy đủ thông tin',
            });
        }

        // Validate email
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                error: 'Địa chỉ email không hợp lệ',
            });
        }

        // Chuẩn hóa số điện thoại Việt Nam
        let cleanPhone = phone.replace(/[^\d]/g, '');
        // Nếu bắt đầu bằng 84, chuyển thành 0
        if (cleanPhone.startsWith('84') && cleanPhone.length > 10) {
            cleanPhone = '0' + cleanPhone.slice(2);
        }
        
        // Validate phone theo chuẩn Việt Nam
        // 10 số, bắt đầu bằng 0, số thứ 2 là 3,5,7,8,9
        const vnPhoneRegex = /^0(3[2-9]|5[2689]|7[06-9]|8[1-9]|9[0-9])\d{7}$/;
        if (!vnPhoneRegex.test(cleanPhone)) {
            return res.status(400).json({
                success: false,
                error: 'Số điện thoại không hợp lệ (VD: 0912345678 hoặc +84912345678)',
            });
        }

        // Tạo liên hệ mới
        const contact = await Contact.create({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            phone: cleanPhone,
            service: service.trim(),
            message: message.trim(),
            status: 'new',
        });

        // Gửi email xác nhận cho người dùng
        try {
            await sendConfirmationEmail(
                email.trim().toLowerCase(),
                name.trim(),
                service.trim(),
                message.trim()
            );
            console.log('Confirmation email sent to:', email);
        } catch (emailError) {
            // Log lỗi nhưng không fail request vì liên hệ đã được lưu
            console.error('Error sending confirmation email:', emailError);
        }

        return res.status(201).json({
            success: true,
            message: 'Gửi liên hệ thành công! Chúng tôi đã gửi email xác nhận đến bạn.',
            data: {
                id: contact._id.toString(),
            },
        });
    } catch (error) {
        console.error('Error creating contact:', error);

        // Handle mongoose validation error
        if (error instanceof Error && error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                error: error.message,
            });
        }

        return res.status(500).json({
            success: false,
            error: 'Lỗi khi gửi liên hệ. Vui lòng thử lại sau.',
        });
    }
}
