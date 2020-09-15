import { action, observable } from 'mobx';

import LoginModel from '../models/Login/loginModel';
import tokenAuthService from '../services/tokenAuth/tokenAuthService';
import { ls } from '../services/localStorage';
import { AuthConfig } from '../config/auth';
import userService, { User } from '../services/user/userService';
import {stores as rootStore, stores} from '../stores/storeInitializer';
import signalRService from '../services/signalRService';

interface AppUser extends User {
  permissions: string[];
  notifications: any;
}

class AuthenticationStore {
  @observable loginModel: LoginModel = new LoginModel();
  @observable loggedIn: boolean = false;
  @observable user: AppUser | null = null;

  public async init() {
    if (ls.get(AuthConfig.TOKEN_NAME)) {
      try {
        const user = await userService.getCurrentUser()
        this.setCurrentUser(user)
        rootStore.notificationStore?.setNotifications(user.notifications);
      } catch (e) {
        this.logout();
      }
    }
  }

  get isAuthenticated(): boolean {
    if (!this.loggedIn) return false;

    return true;
  }

  @action
  public setCurrentUser(user: AppUser) {
    this.loggedIn = true;
    this.user = user;
    stores.notificationStore?.listenNotifications(String(user.id));
  }

  public async login(model: LoginModel) {
    let result = await tokenAuthService.authenticate({
      username: model.username,
      password: model.password,
      rememberClient: model.rememberMe,
    });

    // TODO: Implement refresh token
    // var tokenExpireDate = model.rememberMe ? new Date(new Date().getTime() + 1000 * result.expiresIn) : undefined;
    ls.set(AuthConfig.TOKEN_NAME, result.authToken);
    let currentUser = await userService.getCurrentUser();
    await signalRService.start()
    this.setCurrentUser(currentUser);
    rootStore.notificationStore?.setNotifications(currentUser.notifications);
  }

  @action
  logout() {
    ls.remove(AuthConfig.TOKEN_NAME);
    this.user = null;
    this.loggedIn = false;
  }

  isGranted(permission: string) {
    return this.isAuthenticated &&  this.user!.permissions?.indexOf(permission) > 0;
  }
}
export default AuthenticationStore;
