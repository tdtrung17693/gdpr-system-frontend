import { action, observable } from 'mobx';

import { PagedResultDto } from '../services/dto/pagedResultDto';
import { PagedUserResultRequestDto } from '../services/user/dto/PagedUserResultRequestDto';
import { UpdateUserInput } from '../services/user/dto/updateUserInput';
import userService, { User } from '../services/user/userService';

class UserStore {
  @observable users!: PagedResultDto<User>;
  @observable editUser!: User;

  async create(createUserInput: User) {
    await userService.create(createUserInput);
  }

  @action
  async update(userId: string, updateUserInput: UpdateUserInput) {
    await userService.update(userId, updateUserInput);
    this.users.items = this.users.items.map((x: User) => {
      console.log(x)
      if (x?.id === userId) x = {...x, ...updateUserInput};

      return x;
    });
  }

  @action
  async delete(userId: string) {
    await userService.delete(userId);
    this.users.items = this.users.items.filter((x: User) => x?.id !== userId);
  }

  @action
  async get(userId: string) {
    let result = await userService.get(userId);
    this.editUser = result;
  }

  @action
  async createUser() {
    this.editUser = {
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      status: true,
      roleId: '',
      roleName: '',
      id: "",
    };
  }

  @action
  async getAll(pagedFilterAndSortedRequest: PagedUserResultRequestDto) {
    let result = await userService.getAll(pagedFilterAndSortedRequest);
    this.users = result;
  }

  @action
  async changeUsersStatus(ids: string[], status: boolean) {
      let result = await userService.changeUsersStatus(ids, status);
      return result;
  }

  async changeLanguage(languageName: string) {
    await userService.changeLanguage({ languageName: languageName });
  }
}

export default UserStore;
