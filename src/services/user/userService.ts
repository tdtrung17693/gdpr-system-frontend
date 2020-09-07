import { ChangeLanguagaInput } from './dto/changeLanguageInput';
import { CreateOrUpdateUserInput } from './dto/createOrUpdateUserInput';
import { EntityDto } from '../../services/dto/entityDto';
import { GetAllUserOutput } from './dto/getAllUserOutput';
import { PagedResultDto } from '../../services/dto/pagedResultDto';
import { PagedUserResultRequestDto } from "./dto/PagedUserResultRequestDto";
import { UpdateUserInput } from './dto/updateUserInput';
import http from '../httpService';

export type User = {
  firstName: string;
  lastName: string;
  username: string;
} | null;

class UserService {
  public async create(createUserInput: CreateOrUpdateUserInput) {
    let result = await http.post('api/services/app/User/Create', createUserInput);
    return result.data.result;
  }

  public async update(updateUserInput: UpdateUserInput) {
    let result = await http.put('api/services/app/User/Update', updateUserInput);
    return result.data.result;
  }

  public async delete(entityDto: EntityDto) {
    let result = await http.delete('api/services/app/User/Delete', { params: entityDto });
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

  public async get(entityDto: EntityDto): Promise<CreateOrUpdateUserInput> {
    let result = await http.get('api/services/app/User/Get', { params: entityDto });
    return result.data.result;
  }

  public async getAll(pagedFilterAndSortedRequest: PagedUserResultRequestDto): Promise<PagedResultDto<GetAllUserOutput>> {
    let result = await http.get('api/Users', { params: pagedFilterAndSortedRequest });
    return result.data;
  }

  public async getCurrentUser() {
    let result = await http.get('api/accounts/me');
    return result.data;
  }
}

export default new UserService();
