import { action, observable } from 'mobx';

import notificationService from '../services/notification/notificationService';
import signalRService from '../services/signalRService';

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

  public async listenNotifications(userId: string) {
    // init notification store after logged in
    await signalRService.joinGroup(`notification:${userId}`)
    signalRService.on('newNotification', (notification: Notification) => {
      this.storeIncomingNotification(notification);
    })
  }

  public async stopListeningNotifications(userId: string) {
    // init notification store after logged in
    await signalRService.leaveGroup(`notification:${userId}`)
    signalRService.off('newNotification')
  }

  @action
  public storeIncomingNotification(newNotification: Notification) {
    this.notifications = [newNotification, ...this.notifications];
  }

  @action
  public async markAsRead(notificationId: string) {
    console.log(notificationId)
    await notificationService.markAsRead(notificationId);
    this.notifications = this.notifications.filter(n => n.id != notificationId);
  }
}
export default NotificationStore;
