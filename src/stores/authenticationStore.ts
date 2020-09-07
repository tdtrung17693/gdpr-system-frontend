import { action, observable } from 'mobx';

import LoginModel from '../models/Login/loginModel';
import tokenAuthService from '../services/tokenAuth/tokenAuthService';
import { ls } from '../services/localStorage';
import { Auth } from '../config/auth';
import userService, { User } from '../services/user/userService';

class AuthenticationStore {
  @observable loginModel: LoginModel = new LoginModel();
  @observable loggedIn: boolean = false;
  @observable user: User = null;

  constructor() {
    if (ls.get(Auth.TOKEN_NAME)) {
      userService.getCurrentUser()
        .then(user => {
          this.loggedIn = true;
          this.user = user;
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
    this.loggedIn = true;
    this.user = currentUser;
  }

  @action
  logout() {
    ls.remove(Auth.TOKEN_NAME);
    this.user = null;
    this.loggedIn = false;
  }
}
export default AuthenticationStore;
