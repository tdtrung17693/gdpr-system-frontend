import { action, observable } from 'mobx';

import notificationService from '../services/notification/notificationService';

interface Notification {
  id: string;
  fromUser?: string;
  toUser: string;
  data: string;
  notificationType: string;
}

class NotificationStore {
  @observable notifications: Notification[] = [];
  @action
  public setNotifications(notifications: Notification[]) {
    this.notifications = notifications;
  }

  @action
  public async markAsRead(notificationId: string) {
    console.log(notificationId)
    await notificationService.markAsRead(notificationId);
    this.notifications = this.notifications.filter(n => n.id != notificationId);
  }
}
export default NotificationStore;
