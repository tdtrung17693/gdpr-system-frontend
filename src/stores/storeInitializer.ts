import RoleStore from './roleStore';
import UserStore from './userStore';
import SessionStore from './sessionStore';
import AuthenticationStore, { AppUser } from './authenticationStore';
import ServerStore from './serverStore';
import customerStore from './customerStore';
import CommentStore from './commentStore';
import NotificationStore from './notificationStore';
import RequestStore from './requestStore';
import HistoryLogStore from './historyLogStore';
import signalRService from '../services/signalRService';

interface RootStore  {
  authenticationStore?: AuthenticationStore;
  roleStore?: RoleStore;
  userStore?: UserStore;
  sessionStore?: SessionStore;
  serverStore?: ServerStore;
  customerStore?: customerStore;
  commentStore?: CommentStore;
  notificationStore?: NotificationStore;
  requestStore?: RequestStore;
  historyLogStore? : HistoryLogStore;
}
export let stores:RootStore = {};

export default async function  initializeStores() {

  stores = {
    authenticationStore: new AuthenticationStore(),
    roleStore: new RoleStore(),
    userStore: new UserStore(),
    sessionStore: new SessionStore(),
    serverStore: new ServerStore(),
    customerStore: new customerStore(),
    commentStore: new CommentStore(),
    notificationStore: new NotificationStore(),
    requestStore: new RequestStore(),
    historyLogStore: new HistoryLogStore(),
  };

  stores.authenticationStore?.onLoggedIn(async (user: AppUser) => {
    stores.notificationStore?.listenNotifications(String(user.id));
    stores.notificationStore?.setNotifications(user.notifications);
    stores.notificationStore?.setTotalUnread(user.totalUnreadNotifications);
    stores.roleStore?.init();
    await signalRService.start();
  })

  stores.authenticationStore?.onLoggedOut(async (user: AppUser) => {
    if (!user) return;
    await stores.notificationStore?.stopListeningNotifications(String(user.id));
    signalRService.stop();
  })

  await stores.authenticationStore?.init();

  return stores
};
