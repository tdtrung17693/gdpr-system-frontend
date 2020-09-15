import RoleStore from './roleStore';
import UserStore from './userStore';
import SessionStore from './sessionStore';
import AuthenticationStore from './authenticationStore';
import AccountStore from './accountStore';
import ServerStore from './serverStore';
import customerStore from './customerStore';
import CommentStore from './commentStore';
import NotificationStore from './notificationStore';
import RequestStore from './requestStore';

interface RootStore  {
  authenticationStore?: AuthenticationStore;
  roleStore?: RoleStore;
  userStore?: UserStore;
  sessionStore?: SessionStore;
  accountStore?: AccountStore;
  serverStore?: ServerStore;
  customerStore?: customerStore;
  commentStore?: CommentStore;
  notificationStore?: NotificationStore;
  requestStore?: RequestStore;
}
export let stores:RootStore = {};

export default function initializeStores() {

  stores = {
    authenticationStore: new AuthenticationStore(),
    roleStore: new RoleStore(),
    userStore: new UserStore(),
    sessionStore: new SessionStore(),
    accountStore: new AccountStore(),
    serverStore: new ServerStore(),
    customerStore: new customerStore(),
    commentStore: new CommentStore(),
    notificationStore: new NotificationStore(),
    requestStore: new RequestStore()
  };

  return stores
};
