import { action, observable } from 'mobx';

import LoginModel from '../models/Login/loginModel';
import tokenAuthService from '../services/tokenAuth/tokenAuthService';
import { ls } from '../services/localStorage';
import { Auth } from '../config/auth';
import userService, { User } from '../services/user/userService';

interface AppUser extends User {
  permissions: string[];
}

class AuthenticationStore {
  @observable loginModel: LoginModel = new LoginModel();
  @observable loggedIn: boolean = false;
  @observable user: AppUser | null = null;
  constructor() {
    if (ls.get(Auth.TOKEN_NAME)) {
      userService.getCurrentUser()
        .then(user => {
          this.setCurrentUser(user)
        })
        .catch(() => {
          this.logout();
        })
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
    let currentUser = await userService.getCurrentUser();
    this.setCurrentUser(currentUser);
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
