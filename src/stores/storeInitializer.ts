import RoleStore from './roleStore';
import UserStore from './userStore';
import SessionStore from './sessionStore';
import AuthenticationStore from './authenticationStore';
import ServerStore from './serverStore';
import customerStore from './customerStore';
import CommentStore from './commentStore';
import NotificationStore from './notificationStore';
import RequestStore from './requestStore';
import HistoryLogStore from './historyLogStore';

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

  await stores.authenticationStore?.init();
  await stores.roleStore?.init();

  return stores
};
