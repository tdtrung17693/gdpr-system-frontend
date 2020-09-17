import { ChangeLanguagaInput } from './dto/changeLanguageInput';
import { PagedResultDto } from '../../services/dto/pagedResultDto';
import { PagedUserResultRequestDto } from "./dto/PagedUserResultRequestDto";
import { UpdateUserInput } from './dto/updateUserInput';
import http from '../httpService';

export type User = {
  id?: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  roleId: string;
  roleName: string;
  status: boolean;
};

class UserService {
  public async create(createUserInput: User) {
    let result = await http.post('api/Users', createUserInput);
    return result.data.result;
  }

  public async update(userId: string, updateUserInput: UpdateUserInput) {
    let result = await http.put(`api/Users/${userId}`, updateUserInput);
    return result.data;
  }

  public async delete(userId: string) {
    let result = await http.delete(`api/Users/${userId}`);
    return result.data;
  }

  public async getRoles() {
    let result = await http.get('api/services/app/User/GetRoles');
    return result.data.result.items;
  }

  public async changeLanguage(changeLanguageInput: ChangeLanguagaInput) {
    let result = await http.post('api/services/app/User/ChangeLanguage', changeLanguageInput);
    return result.data;
  }

  public async get(userId: string): Promise<User> {
    let result = await http.get(`api/Users/${userId}`);
    return result.data;
  }

  public async getAll(pagedFilterAndSortedRequest: PagedUserResultRequestDto): Promise<PagedResultDto<User>> {
    let result = await http.get('api/Users', { params: pagedFilterAndSortedRequest });
    return result.data;
  }

  public async changeUsersStatus(ids: string[], status: boolean) {
    try {
      const endpoint = status ? 'activate' : 'deactivate';
      await http.post(`api/Users/${endpoint}`, ids)
      return true
    } catch (e) {
      throw e;
    }
  }

  public async getCurrentUser() {
    let result = await http.get('api/accounts/me');
    return result.data;
  }
}

export default new UserService();
