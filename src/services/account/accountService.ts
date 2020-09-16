import { IsTenantAvaibleInput } from './dto/isTenantAvailableInput';
import { RegisterInput } from './dto/registerInput';
import IsTenantAvaibleOutput from './dto/isTenantAvailableOutput';
import { RegisterOutput } from './dto/registerOutput';
import http from '../httpService';
import { UpdateProfileInfoInput } from './dto/updateProfileInfoInput';
import { ChangePasswordInput } from './dto/changePasswordInput';

class AccountService {
  public async isTenantAvailable(isTenantAvaibleInput: IsTenantAvaibleInput): Promise<IsTenantAvaibleOutput> {
    let result = await http.post('api/services/app/Account/IsTenantAvailable', isTenantAvaibleInput);
    return result.data.result;
  }

  public async register(registerInput: RegisterInput): Promise<RegisterOutput> {
    let result = await http.post('api/services/app/Account/Register', registerInput);
    return result.data.result;
  }
  public async updateInfo(updateInfo: UpdateProfileInfoInput) {
    let result = await http.put('api/accounts/profile/info', updateInfo);
    return result.data;
  }
  public async changePassword(values: ChangePasswordInput) {
    let result = await http.put('api/accounts/profile/password', values);
    return result.data
  }
}

export default new AccountService();
