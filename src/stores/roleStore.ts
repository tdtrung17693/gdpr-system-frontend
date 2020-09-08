import { action, observable } from 'mobx';

import { CreateRoleInput } from '../services/role/dto/createRoleInput';
import { GetAllPermissionsOutput } from '../services/role/dto/getAllPermissionsOutput';
import { Role } from '../services/role/dto/Role';
import RoleEditModel from '../models/Roles/roleEditModel';
import roleService from '../services/role/roleService';

class RoleStore {
  @observable roles: Role[] = [];
  @observable roleEdit: RoleEditModel = new RoleEditModel();
  @observable allPermissions: GetAllPermissionsOutput[] = [];

  constructor() {
    this.getAll();
  }

  @action
  async create(createRoleInput: CreateRoleInput) {
    await roleService.create(createRoleInput);
  }

  @action
  async getAllPermissions() {
    var result = await roleService.getAllPermissions();
    this.allPermissions = result;
  }

  @action
  async getAll() {
    let result = await roleService.getAll();
    this.roles = result;
  }
}

export default RoleStore;
