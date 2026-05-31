import { Controller, Get } from '@nestjs/common';

@Controller('ads')
export class AdsController {
  @Get()
  findAll() {
    return [
      {
        id: 1,
        title: 'Giảm giá mùa hè',
        subtitle: 'Ưu đãi tới 20% cho thiết bị điện và cơ khí.',
        image: 'https://images.unsplash.com/photo-1493679987494-4b53cd4cc041?auto=format&fit=crop&w=900&q=80',
        backgroundColor: '#ffedd5',
      },
      {
        id: 2,
        title: 'Mua 1 tặng 1',
        subtitle: 'Phụ kiện công nghiệp giá tốt cho khách hàng thân thiết.',
        image: 'https://images.unsplash.com/photo-1517638851339-4ff7b8c0d3b7?auto=format&fit=crop&w=900&q=80',
        backgroundColor: '#dbeafe',
      },
    ];
  }
}
