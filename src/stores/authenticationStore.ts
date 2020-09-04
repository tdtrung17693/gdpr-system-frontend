import { action, observable } from 'mobx';

import LoginModel from '../models/Login/loginModel';
import tokenAuthService from '../services/tokenAuth/tokenAuthService';

declare var abp: any;

class AuthenticationStore {
  @observable loginModel: LoginModel = new LoginModel();

  get isAuthenticated(): boolean {
    if (!abp.session.userId) return false;

    return true;
  }

  @action
  public async login(model: LoginModel) {
    let result = await tokenAuthService.authenticate({
      username: model.username,
      password: model.password,
      rememberClient: model.rememberMe,
    });

    var tokenExpireDate = model.rememberMe ? new Date(new Date().getTime() + 1000 * result.expiresIn) : undefined;
    console.log(result)
    abp.auth.setToken(result.authToken, tokenExpireDate);
  }

  @action
  logout() {
    localStorage.clear();
    sessionStorage.clear();
    abp.auth.clearToken();
  }
}
export default AuthenticationStore;
