import { action, observable } from 'mobx';

import notificationService from '../services/notification/notificationService';
import signalRService from '../services/signalRService';
import { stores } from './storeInitializer';

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

  public async listenNotifications() {
    // init notification store after logged in
    await signalRService.joinGroup(`notification:${stores.authenticationStore?.user?.id}`)
    signalRService.on('newNotification', (notification: Notification) => {
      this.storeIncomingNotification(notification);
    })
  }

  public async stopListeningNotifications() {
    // init notification store after logged in
    await signalRService.leaveGroup(`notification:${stores.authenticationStore?.user?.id}`)
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
