import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Map các giá trị sang tiếng Việt
const servicePackageMap: { [key: string]: string } = {
    'basic': 'Gói Basic - Website cơ bản',
    'standard': 'Gói Standard - Website chuyên nghiệp',
    'premium': 'Gói Premium - Website cao cấp',
    'ecommerce': 'Gói E-commerce - Website bán hàng',
    'custom': 'Gói Custom - Thiết kế riêng'
};

const industryMap: { [key: string]: string } = {
    'technology': 'Công nghệ',
    'healthcare': 'Y tế - Sức khỏe',
    'education': 'Giáo dục',
    'retail': 'Bán lẻ',
    'food': 'Thực phẩm - Nhà hàng',
    'real-estate': 'Bất động sản',
    'finance': 'Tài chính - Ngân hàng',
    'travel': 'Du lịch - Khách sạn',
    'other': 'Lĩnh vực khác'
};

const subjectMap: { [key: string]: string } = {
    'new-website': 'Thiết kế website mới',
    'redesign': 'Thiết kế lại website',
    'maintenance': 'Bảo trì website',
    'seo': 'Tối ưu SEO',
    'other': 'Khác'
};

export async function POST(request: NextRequest) {
    console.log('📧 [API send-email] Nhận request gửi email xác nhận');
    
    try {
        const body = await request.json();
        const { name, email, phone, subject, servicePackage, industry, message } = body;

        console.log('📋 [API send-email] Thông tin:', { name, email, phone, subject });

        // Validate required fields
        if (!name || !email) {
            console.log('❌ [API send-email] Thiếu name hoặc email');
            return NextResponse.json(
                { success: false, error: 'Thiếu thông tin bắt buộc' },
                { status: 400 }
            );
        }

        // Check Gmail configuration
        const gmailUser = process.env.GMAIL_USER;
        const gmailAppPassword = process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, '');

        console.log('🔧 [API send-email] Gmail config:', { 
            gmailUser, 
            hasPassword: !!gmailAppPassword,
            passwordLength: gmailAppPassword?.length 
        });

        if (!gmailUser || !gmailAppPassword) {
            console.error('❌ [API send-email] Gmail configuration missing');
            return NextResponse.json(
                { success: false, error: 'Cấu hình email chưa được thiết lập' },
                { status: 500 }
            );
        }

        console.log('📤 [API send-email] Đang tạo transporter và gửi email...');

        // Create transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: gmailUser,
                pass: gmailAppPassword,
            },
        });

        // Format current date
        const currentDate = new Date().toLocaleDateString('vi-VN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        // Email content
        const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #FFFFFF;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.15); overflow: hidden;">
                    <!-- Header -->
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
                    
                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 40px;">
                            <!-- Greeting -->
                            <div style="margin-bottom: 30px;">
                                <h2 style="color: #1e293b; font-size: 20px; margin: 0 0 10px 0;">Xin chào ${name}! 👋</h2>
                                <p style="color: #64748b; font-size: 15px; line-height: 1.6; margin: 0;">
                                    Cảm ơn bạn đã quan tâm đến dịch vụ thiết kế website của <strong style="color: #667eea;">Anbi Company</strong>. 
                                    Chúng tôi đã nhận được yêu cầu của bạn và sẽ liên hệ lại trong thời gian sớm nhất!
                                </p>
                            </div>

                            <!-- Info Box -->
                            <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-radius: 12px; padding: 25px; margin-bottom: 30px; border-left: 4px solid #667eea;">
                                <h3 style="color: #334155; font-size: 16px; margin: 0 0 20px 0; display: flex; align-items: center;">
                                    📋 Thông tin yêu cầu của bạn:
                                </h3>
                                
                                <table width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                                            <span style="color: #64748b; font-size: 13px;">Họ và tên:</span>
                                        </td>
                                        <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">
                                            <strong style="color: #1e293b; font-size: 14px;">${name}</strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                                            <span style="color: #64748b; font-size: 13px;">Email:</span>
                                        </td>
                                        <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">
                                            <strong style="color: #667eea; font-size: 14px;">${email}</strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                                            <span style="color: #64748b; font-size: 13px;">Số điện thoại:</span>
                                        </td>
                                        <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">
                                            <strong style="color: #1e293b; font-size: 14px;">${phone || 'Chưa cung cấp'}</strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                                            <span style="color: #64748b; font-size: 13px;">Quan tâm:</span>
                                        </td>
                                        <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">
                                            <span style="background: #dbeafe; color: #1e40af; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 500;">${subjectMap[subject] || subject || 'Chưa chọn'}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                                            <span style="color: #64748b; font-size: 13px;">Gói dịch vụ:</span>
                                        </td>
                                        <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">
                                            <span style="background: #f3e8ff; color: #7c3aed; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 500;">${servicePackageMap[servicePackage] || servicePackage || 'Chưa chọn'}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                                            <span style="color: #64748b; font-size: 13px;">Lĩnh vực:</span>
                                        </td>
                                        <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">
                                            <span style="background: #fef3c7; color: #d97706; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 500;">${industryMap[industry] || industry || 'Chưa chọn'}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0;">
                                            <span style="color: #64748b; font-size: 13px;">Thời gian gửi:</span>
                                        </td>
                                        <td style="padding: 8px 0; text-align: right;">
                                            <strong style="color: #1e293b; font-size: 14px;">${currentDate}</strong>
                                        </td>
                                    </tr>
                                </table>

                                ${message ? `
                                <div style="margin-top: 20px; padding-top: 15px; border-top: 1px dashed #cbd5e1;">
                                    <span style="color: #64748b; font-size: 13px;">Nội dung tin nhắn:</span>
                                    <p style="color: #334155; font-size: 14px; line-height: 1.6; margin: 10px 0 0 0; padding: 12px; background: #ffffff; border-radius: 8px;">${message}</p>
                                </div>
                                ` : ''}
                            </div>

                            <!-- What's Next -->
                            <div style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border-radius: 12px; padding: 20px; margin-bottom: 30px;">
                                <h3 style="color: #065f46; font-size: 15px; margin: 0 0 15px 0;">✨ Bước tiếp theo:</h3>
                                <ul style="color: #047857; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
                                    <li>Đội ngũ của chúng tôi sẽ xem xét yêu cầu của bạn</li>
                                    <li>Liên hệ lại trong vòng <strong>24 giờ làm việc</strong></li>
                                    <li>Tư vấn miễn phí và báo giá chi tiết</li>
                                </ul>
                            </div>

                            <!-- Contact Info -->
                            <div style="text-align: center; padding: 20px; background: #f8fafc; border-radius: 12px;">
                                <p style="color: #64748b; font-size: 14px; margin: 0 0 15px 0;">Nếu có thắc mắc, vui lòng liên hệ:</p>
                                <p style="margin: 5px 0;">
                                    <a href="tel:0909123456" style="color: #667eea; text-decoration: none; font-weight: 500;">📞 0909 123 456</a>
                                </p>
                                <p style="margin: 5px 0;">
                                    <a href="mailto:contact@anbicompany.com" style="color: #667eea; text-decoration: none; font-weight: 500;">✉️ contact@anbicompany.com</a>
                                </p>
                            </div>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background: #1e293b; padding: 25px 40px; text-align: center;">
                            <p style="color: #94a3b8; font-size: 13px; margin: 0 0 10px 0;">
                                © ${new Date().getFullYear()} Anbi Company. All rights reserved.
                            </p>
                            <p style="color: #64748b; font-size: 12px; margin: 0;">
                                Đây là email tự động, vui lòng không trả lời email này.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
        `;

        // Plain text version
        const textContent = `
Xin chào ${name}!

Cảm ơn bạn đã quan tâm đến dịch vụ thiết kế website của Anbi Company.
Chúng tôi đã nhận được yêu cầu của bạn và sẽ liên hệ lại trong thời gian sớm nhất!

📋 Thông tin yêu cầu của bạn:
- Họ và tên: ${name}
- Email: ${email}
- Số điện thoại: ${phone || 'Chưa cung cấp'}
- Quan tâm: ${subjectMap[subject] || subject || 'Chưa chọn'}
- Gói dịch vụ: ${servicePackageMap[servicePackage] || servicePackage || 'Chưa chọn'}
- Lĩnh vực: ${industryMap[industry] || industry || 'Chưa chọn'}
- Thời gian gửi: ${currentDate}
${message ? `- Nội dung: ${message}` : ''}

✨ Bước tiếp theo:
• Đội ngũ của chúng tôi sẽ xem xét yêu cầu của bạn
• Liên hệ lại trong vòng 24 giờ làm việc
• Tư vấn miễn phí và báo giá chi tiết

Nếu có thắc mắc, vui lòng liên hệ:
📞 0909 123 456
✉️ contact@anbicompany.com

---
© ${new Date().getFullYear()} Anbi Company. All rights reserved.
Đây là email tự động, vui lòng không trả lời email này.
        `;

        // Send email
        const emailResult = await transporter.sendMail({
            from: `"Anbi Company" <${gmailUser}>`,
            to: email,
            subject: '✅ Xác nhận yêu cầu liên hệ - Anbi Company',
            text: textContent,
            html: htmlContent,
        });

        console.log(`✅ [API send-email] Email đã gửi thành công đến ${email}`, emailResult);

        return NextResponse.json({
            success: true,
            message: 'Email xác nhận đã được gửi'
        });

    } catch (error) {
        console.error('❌ [API send-email] Lỗi gửi email:', error);
        return NextResponse.json(
            { success: false, error: 'Không thể gửi email xác nhận' },
            { status: 500 }
        );
    }
}
