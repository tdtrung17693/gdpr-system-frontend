import { action, observable } from 'mobx';

import signalRService from '../services/signalRService';
import notificationService, { INotification } from '../services/notification/notificationService';
import { PagedResultDto } from '../services/dto/pagedResultDto';


class NotificationStore {
  @observable notifications: INotification[] = [];
  @observable currentPage = 1;
  @observable totalPages = -1;
  @observable totalUnreadNotifications: number = 0;

  @action
  public setNotifications(pagedNotifications: PagedResultDto<INotification>) {
    this.notifications = pagedNotifications.items;
    this.currentPage = pagedNotifications.page!;
    this.totalPages = pagedNotifications.totalPages!;
  }

  @action setTotalUnread(totalUnread: number) {
    this.totalUnreadNotifications = totalUnread;
  }

  @action
  public async getMoreNotifications(page: number) {
    let result = await notificationService.getMoreNotifications(page)
    this.notifications = [...this.notifications, ...result.items]
    return result
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
