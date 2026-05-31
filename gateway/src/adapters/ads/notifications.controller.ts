import { Controller, Get, Param } from '@nestjs/common';

@Controller('notifications')
export class NotificationsController {
  @Get()
  findAll() {
    return [
      {
        id: 1,
        title: 'Đơn hàng mới',
        message: 'Bạn có 2 đơn hàng chờ xử lý.',
        unread: true,
      },
      {
        id: 2,
        title: 'Khuyến mãi thêm',
        message: 'Giảm 5% cho đơn hàng từ 5 sản phẩm.',
        unread: false,
      },
    ];
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return [
      {
        id: 1,
        userId: parseInt(userId),
        title: 'Đơn hàng mới',
        message: 'Bạn có 2 đơn hàng chờ xử lý.',
        type: 'order',
        isRead: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        userId: parseInt(userId),
        title: 'Khuyến mãi thêm',
        message: 'Giảm 5% cho đơn hàng từ 5 sản phẩm.',
        type: 'promotion',
        isRead: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  }
}
