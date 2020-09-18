import { action, computed, observable } from 'mobx';

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

  @computed
  get hasMore () {
    return this.currentPage  < this.totalPages
  }

  @action
  public async refreshNotificationList() {
    let result = await notificationService.refreshNotificationList(this.currentPage);
    this.notifications = result;
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
    signalRService.on('newNotification', (notification: INotification) => {
      this.storeIncomingNotification(notification);
    })
  }

  public async stopListeningNotifications(userId: string) {
    // init notification store after logged in
    await signalRService.leaveGroup(`notification:${userId}`)
    signalRService.off('newNotification')
  }

  @action
  public storeIncomingNotification(newNotification: INotification) {
    this.notifications = [newNotification, ...this.notifications];
    this.totalUnreadNotifications += 1;
  }

  @action
  public async markAsRead(notificationId: string) {
    let [notification] = this.notifications.filter(n => n.id === notificationId)
    if (notification && notification.isRead) return;
    await notificationService.markAsRead(notificationId);
    if (notification) {
       notification.isRead = true;
       this.totalUnreadNotifications -= 1;
    }
  }

  @action
  public async delete(notificationId: string) {
    await notificationService.delete(notificationId);
    let notification = this.notifications.find(n => n.id === notificationId);
    if (notification && !notification.isRead) this.setTotalUnread(this.totalUnreadNotifications - 1);
    this.refreshNotificationList();
  }

  @action
  public async markAllAsRead() {
    await notificationService.markAllAsRead()
    this.notifications.filter(n => !n.isRead).forEach(n => {
      n.isRead = true;
    })
    this.setTotalUnread(0)
  }
}
export default NotificationStore;
