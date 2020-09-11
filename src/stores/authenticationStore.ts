import { action, observable } from 'mobx';

import LoginModel from '../models/Login/loginModel';
import tokenAuthService from '../services/tokenAuth/tokenAuthService';
import { ls } from '../services/localStorage';
import { Auth } from '../config/auth';
import userService, { User } from '../services/user/userService';
import { UpdateProfileInfoInput } from '../services/account/dto/registerInput copy';
import accountService from '../services/account/accountService';

interface AppUser extends User {
  permissions: string[];
}

class AuthenticationStore {
  @observable loginModel: LoginModel = new LoginModel();
  @observable loggedIn: boolean = false;
  @observable user: AppUser | null = null;
  constructor() {
    if (ls.get(Auth.TOKEN_NAME)) {
      this.checkTokenValidity();
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

  @action
  public setCurrentUser(user: AppUser) {
    this.loggedIn = true;
    this.user = user;
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
    ls.set(Auth.TOKEN_NAME, result.authToken);
    await this.getCurrentUser();
  }

  @action
  logout() {
    ls.remove(Auth.TOKEN_NAME);
    this.user = null;
    this.loggedIn = false;
  }

  isGranted(permission: string) {
    return this.isAuthenticated &&  this.user!.permissions?.indexOf(permission) > 0;
  }
}
export default AuthenticationStore;
