import http from '../httpService';

export interface INotification {
    id: string;
    data: string;
    createdAt: Date;
    notificationType: string;
}

class NotificationService {
    public async markAsRead(notificationId: string) {
        let result = await http.put(`api/Notifications/${notificationId}`)
        console.log(result)
        return result.data;
    }
}

export default new NotificationService();
