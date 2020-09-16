import http from '../httpService';

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
    public async getMoreNotifications(page: number) {
        let result = await http.get(`api/Notifications/more?page=${page}`)
        console.log(result.data)
        return result.data
    }
    public async markAsRead(notificationId: string) {
        let result = await http.put(`api/Notifications/${notificationId}`)
        console.log(result)
        return result.data;
    }
}

export default new NotificationService();
