import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { NotificationEntity } from '../../infrastructure/database/entities/notification.entity';

@Injectable()
export class NotificationService {
  constructor(
    @Inject('DATA_SOURCE')
    private readonly dataSource: DataSource,
  ) {}

  private get notificationRepository() {
    return this.dataSource.getRepository(NotificationEntity);
  }

  async getUserNotifications(userId: number) {
    return this.notificationRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async markAsRead(id: number) {
    try {
      const notificationId = typeof id === 'string' ? parseInt(id, 10) : id;
      console.log('Marking notification as read with ID:', notificationId, 'Type:', typeof notificationId);
      
      // Use createQueryBuilder for more reliable updates
      const result = await this.notificationRepository
        .createQueryBuilder()
        .update(NotificationEntity)
        .set({ 
          isRead: true,
          readAt: () => 'NOW()' 
        })
        .where('id = :id', { id: notificationId })
        .execute();
      
      console.log('Update result:', result);
      
      if (result.affected === 0) {
        console.log('No notification was updated with ID:', notificationId);
        throw new Error('Notification not found or not updated');
      }
      
      const updatedNotification = await this.notificationRepository.findOne({
        where: { id: notificationId }
      });
      
      console.log('Updated notification:', updatedNotification);
      
      return updatedNotification;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }
}
