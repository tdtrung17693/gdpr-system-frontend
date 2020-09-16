import { action, observable } from 'mobx';

import LoginModel from '../models/Login/loginModel';
import tokenAuthService from '../services/tokenAuth/tokenAuthService';
import { ls } from '../services/localStorage';
import { AuthConfig } from '../config/auth';
import userService, { User } from '../services/user/userService';
import {stores as rootStore, stores} from '../stores/storeInitializer';
import signalRService from '../services/signalRService';
import { UpdateProfileInfoInput } from '../services/account/dto/updateProfileInfoInput';
import accountService from '../services/account/accountService';
import { ChangePasswordInput } from '../services/account/dto/changePasswordInput';

interface AppUser extends User {
  totalUnreadNotifications: number;
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
        await this.checkTokenValidity();
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
  public async updateCurrentUserInfo(updateInfo: UpdateProfileInfoInput) {
    await accountService.updateInfo(updateInfo);
    this.user!.firstName = updateInfo.firstName;
    this.user!.lastName = updateInfo.lastName;
  }

  public async changeUserPassword(values: ChangePasswordInput) {
    await accountService.changePassword(values);
  }

  @action
  public setCurrentUser(user: AppUser) {
    this.loggedIn = true;
    this.user = user;
    stores.notificationStore?.listenNotifications(String(user.id));
    rootStore.notificationStore?.setNotifications(user.notifications);
    rootStore.notificationStore?.setTotalUnread(user.totalUnreadNotifications);
  }

  protected async checkTokenValidity() {
    // Try getting current user using current JWT Token
    this.getCurrentUser()
      .catch(() => {
        // Log out if failed
        this.logout();
      })
  }

  public async refreshCurrentUser() {
    await this.getCurrentUser();
  }

  public async getCurrentUser() {
    let user = await userService.getCurrentUser();
    this.setCurrentUser(user);
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
