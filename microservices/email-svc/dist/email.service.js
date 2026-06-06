"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const nodemailer = require("nodemailer");
const email_entity_1 = require("./email.entity");
let EmailService = class EmailService {
    constructor(dataSource) {
        this.dataSource = dataSource;
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.EMAIL_PORT || '587'),
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    }
    get emailRepository() {
        return this.dataSource.getRepository(email_entity_1.EmailEntity);
    }
    async sendEmail(to, subject, body, template, templateData) {
        const email = this.emailRepository.create({
            to,
            subject,
            body,
            template,
            templateData,
            status: 'pending',
        });
        try {
            const mailOptions = {
                from: process.env.EMAIL_FROM || 'shoponlinedevices@gmail.com',
                to,
                subject,
                html: body,
            };
            const info = await this.transporter.sendMail(mailOptions);
            email.status = 'sent';
            email.messageId = info.messageId;
            email.sentAt = new Date();
            await this.emailRepository.save(email);
            return {
                success: true,
                messageId: info.messageId,
                emailId: email.id,
            };
        }
        catch (error) {
            email.status = 'failed';
            email.error = error instanceof Error ? error.message : 'Unknown error';
            await this.emailRepository.save(email);
            console.error('Email sending error:', error);
            return {
                success: false,
                error: email.error,
                emailId: email.id,
            };
        }
    }
    async getEmailHistory(limit = 50) {
        return this.emailRepository.find({
            order: { createdAt: 'DESC' },
            take: limit,
        });
    }
    async getEmailById(id) {
        return this.emailRepository.findOne({ where: { id } });
    }
    async getEmailsByRecipient(to, limit = 50) {
        return this.emailRepository.find({
            where: { to },
            order: { createdAt: 'DESC' },
            take: limit,
        });
    }
    async sendOrderConfirmationEmail(to, orderData) {
        const { orderId, totalAmount, orderLines, shippingAddress, customerName } = orderData;
        const subject = 'Xác nhận đơn hàng thành công - Shop Online Devices';
        const body = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Xác nhận đơn hàng</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      padding-bottom: 20px;
      border-bottom: 2px solid #ff6b00;
    }
    .header h1 {
      color: #ff6b00;
      margin: 0;
      font-size: 28px;
    }
    .content {
      padding: 20px 0;
    }
    .order-info {
      background-color: #fff9f5;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    .order-info p {
      margin: 8px 0;
      color: #333;
    }
    .order-info strong {
      color: #ff6b00;
    }
    .table-container {
      margin: 20px 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
    }
    th {
      background-color: #ff6b00;
      color: white;
      padding: 12px;
      text-align: left;
      font-weight: bold;
    }
    th:first-child {
      border-top-left-radius: 8px;
    }
    th:last-child {
      border-top-right-radius: 8px;
    }
    td {
      padding: 12px;
      border-bottom: 1px solid #e0e0e0;
    }
    tr:last-child td {
      border-bottom: none;
    }
    tr:nth-child(even) {
      background-color: #f9f9f9;
    }
    .product-name {
      font-weight: 600;
      color: #333;
    }
    .total-section {
      background-color: #fff9f5;
      padding: 15px;
      border-radius: 8px;
      margin-top: 20px;
    }
    .total-section .total-label {
      font-size: 16px;
      color: #666;
    }
    .total-section .total-amount {
      font-size: 24px;
      font-weight: bold;
      color: #ff6b00;
      margin-top: 5px;
    }
    .footer {
      text-align: center;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
      color: #666;
      font-size: 14px;
    }
    .thank-you {
      text-align: center;
      margin: 20px 0;
      font-size: 16px;
      color: #333;
    }
    .btn {
      display: inline-block;
      padding: 12px 30px;
      background-color: #ff6b00;
      color: white;
      text-decoration: none;
      border-radius: 5px;
      font-weight: bold;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🛒 Shop Online Devices</h1>
    </div>
    
    <div class="content">
      <div class="thank-you">
        <h2>Đơn hàng của bạn đã được đặt thành công!</h2>
        <p>Cảm ơn ${customerName || 'bạn'} đã mua hàng tại Shop Online Devices</p>
      </div>

      <div class="order-info">
        <p><strong>Mã đơn hàng:</strong> #${orderId}</p>
        <p><strong>Ngày đặt:</strong> ${new Date().toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        })}</p>
        ${shippingAddress ? `<p><strong>Địa chỉ giao hàng:</strong> ${shippingAddress}</p>` : ''}
      </div>

      <div class="table-container">
        <h3>Chi tiết đơn hàng:</h3>
        <table>
          <thead>
            <tr>
              <th>Sản phẩm</th>
              <th>Số lượng</th>
              <th>Đơn giá</th>
              <th>Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            ${orderLines.map(line => `
              <tr>
                <td class="product-name">${line.productName || `Sản phẩm #${line.productId}`}</td>
                <td>${line.quantity}</td>
                <td>${line.unitPrice.toLocaleString('vi-VN')} ₫</td>
                <td><strong>${line.totalPrice.toLocaleString('vi-VN')} ₫</strong></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div class="total-section">
        <p class="total-label">Tổng thanh toán:</p>
        <p class="total-amount">${totalAmount.toLocaleString('vi-VN')} ₫</p>
      </div>

      <div style="text-align: center;">
        <a href="#" class="btn">Theo dõi đơn hàng</a>
      </div>

      <p style="text-align: center; color: #666; font-size: 14px; margin-top: 20px;">
        Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua email hoặc hotline.
      </p>
    </div>

    <div class="footer">
      <p>© 2024 Shop Online Devices. All rights reserved.</p>
      <p>Email: support@shoponlinedevices.com | Hotline: 1900 xxxx</p>
    </div>
  </div>
</body>
</html>
    `;
        return this.sendEmail(to, subject, body);
    }
    async sendPasswordResetEmail(to, username, temporaryPassword) {
        const subject = 'Khôi phục mật khẩu - Shop Online Devices';
        const body = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Khôi phục mật khẩu</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      padding-bottom: 20px;
      border-bottom: 2px solid #3b82f6;
    }
    .header h1 {
      color: #3b82f6;
      margin: 0;
      font-size: 28px;
    }
    .content {
      padding: 20px 0;
    }
    .info-box {
      background-color: #eff6ff;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
      border-left: 4px solid #3b82f6;
    }
    .info-box p {
      margin: 8px 0;
      color: #333;
    }
    .info-box strong {
      color: #1e40af;
    }
    .password-box {
      background-color: #fef3c7;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
      text-align: center;
      border: 2px dashed #f59e0b;
    }
    .password-box .password {
      font-size: 24px;
      font-weight: bold;
      color: #dc2626;
      letter-spacing: 2px;
      margin: 10px 0;
    }
    .warning {
      background-color: #fef2f2;
      padding: 15px;
      border-radius: 8px;
      margin: 20px 0;
      border-left: 4px solid #dc2626;
    }
    .warning p {
      margin: 5px 0;
      color: #7f1d1d;
      font-size: 14px;
    }
    .footer {
      text-align: center;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
      color: #666;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔐 Shop Online Devices</h1>
    </div>
    
    <div class="content">
      <h2>Khôi phục mật khẩu của bạn</h2>
      <p>Chào bạn,</p>
      <p>Chúng tôi đã nhận được yêu cầu khôi phục mật khẩu cho tài khoản <strong>${username}</strong>.</p>
      
      <div class="info-box">
        <p><strong>Tên đăng nhập:</strong> ${username}</p>
        <p><strong>Thời gian:</strong> ${new Date().toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        })}</p>
      </div>

      <div class="password-box">
        <p>Mật khẩu tạm thời của bạn:</p>
        <div class="password">${temporaryPassword}</div>
      </div>

      <div class="warning">
        <p><strong>⚠️ Lưu ý quan trọng:</strong></p>
        <p>• Đây là mật khẩu tạm thời, vui lòng đổi mật khẩu sau khi đăng nhập</p>
        <p>• Mật khẩu này sẽ hết hiệu lực sau khi bạn đổi mật khẩu mới</p>
        <p>• Nếu bạn không yêu cầu khôi phục mật khẩu, vui lòng liên hệ ngay với chúng tôi</p>
      </div>

      <p>Để đăng nhập, vui lòng sử dụng mật khẩu tạm thời ở trên và sau đó đổi sang mật khẩu mới của bạn.</p>
      
      <p style="margin-top: 20px;">Trân trọng,</p>
      <p><strong>Đội ngũ Shop Online Devices</strong></p>
    </div>

    <div class="footer">
      <p>© 2024 Shop Online Devices. All rights reserved.</p>
      <p>Email: support@shoponlinedevices.com | Hotline: 1900 xxxx</p>
    </div>
  </div>
</body>
</html>
    `;
        return this.sendEmail(to, subject, body);
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], EmailService);
//# sourceMappingURL=email.service.js.map