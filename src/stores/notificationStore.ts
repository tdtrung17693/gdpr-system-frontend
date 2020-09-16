import { action, observable } from 'mobx';

import signalRService from '../services/signalRService';
import notificationService, { INotification } from '../services/notification/notificationService';


class NotificationStore {
  @observable notifications: INotification[] = [];
  @observable totalUnreadNotifications: number = 0;

  @action
  public setNotifications(notifications: INotification[]) {
    this.notifications = notifications;
  }

  @action setTotalUnread(totalUnread: number) {
    this.totalUnreadNotifications = totalUnread;
  }

  @action
  public async getMoreNotifications(page: number) {
    let result = await notificationService.getMoreNotifications(page)
    this.notifications = [...this.notifications, ...result]
    return result.length
  }

  public async listenNotifications(userId: string) {
    // init notification store after logged in
    await signalRService.joinGroup(`notification:${userId}`)
    signalRService.on('newINotification', (notification: INotification) => {
      this.storeIncomingNotification(notification);
    })
  }

  public async stopListeningNotifications(userId: string) {
    // init notification store after logged in
    await signalRService.leaveGroup(`notification:${userId}`)
    signalRService.off('newINotification')
  }

  @action
  public storeIncomingNotification(newINotification: INotification) {
    this.notifications = [newINotification, ...this.notifications];
  }

  @action
  public async markAsRead(notificationId: string) {
    await notificationService.markAsRead(notificationId);
    let [notification] = this.notifications.filter(n => n.id === notificationId)
    if (notification) notification.isRead = true;
  }
}
export default NotificationStore;
