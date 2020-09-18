import http from '../httpService';
import { PagedResultDto } from '../dto/pagedResultDto';

export interface INotification {
    id: string;
    data: string;
    toUser: string;
    createdAt: Date;
    fromUser?: string;
    notificationType: string;
    isRead: boolean;
}

class NotificationService {
    public async refreshNotificationList(currentPage: number) {
        let result = await http.get(`api/Notifications/refresh?page=${currentPage}`);
        return result.data;
    }
    public async markAllAsRead() {
        let result = await http.put('api/Notifications/mark-read-all')
        return result.data;
    }

    public async getMoreNotifications(page: number): Promise<PagedResultDto<INotification>> {
        let result = await http.get(`api/Notifications/more?page=${page}`)
        return result.data
    }

    public async markAsRead(notificationId: string) {
        let result = await http.put(`api/Notifications/${notificationId}`)
        console.log(result)
        return result.data;
    }

    public async delete(notificationId: string) {
        await http.delete(`api/Notifications/${notificationId}`)
    }
}

export default new NotificationService();
