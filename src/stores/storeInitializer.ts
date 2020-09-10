import RoleStore from './roleStore';
import UserStore from './userStore';
import SessionStore from './sessionStore';
import AuthenticationStore from './authenticationStore';
import AccountStore from './accountStore';
import ServerStore from './serverStore';
import customerStore from './customerStore';

export default function initializeStores() {
  return {
    authenticationStore: new AuthenticationStore(),
    roleStore: new RoleStore(),
    userStore: new UserStore(),
    sessionStore: new SessionStore(),
    accountStore: new AccountStore(),
    serverStore: new ServerStore(),
    customerStore: new customerStore(),
  };
}
