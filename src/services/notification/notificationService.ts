import http from '../httpService';

class NotificationService {
    public async markAsRead(notificationId: string) {
        let result = await http.put(`api/Notifications/${notificationId}`)
        console.log(result)
        return result.data;
    }
}

export default new NotificationService();
