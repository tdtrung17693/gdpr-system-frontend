import { CreateServerInput } from './../services/server/dto/CreateServerInput';
import { action, observable } from 'mobx';
import { GetServerOutput } from '../services/server/dto/GetServerOutput';
import serverService from '../services/server/serverServices';
import { PagedResultDto } from '../services/dto/pagedResultDto';
//import { UpdateServerInput } from '../services/server/dto/UpdateServerInput';

class ServerStore {
  @observable servers: PagedResultDto<GetServerOutput> = {
    totalCount: 0,
    items: [],
  };
  @observable editServer!: GetServerOutput;

  @action
  async getAll() {
    let result = await serverService.getAll();
    this.servers = result;
    //console.log(this.servers);
  }

  @action
  async create(server: CreateServerInput) {
    await serverService.create(server);
  }

  @action
  async createServer() {
    this.editServer = {
      id: '',
      name: '',
      ipAddress: '',
      createdBy: '',
      status: true,
      startDate: '',
      endDate: '',
    };
  }

  @action
  handleServerMember(status: boolean, index: number) {
    this.servers.items[index].key = '' + index;
    this.servers.items[index].index = index + 1;
    this.servers.items[index].isActive = this.servers.items[index].status;
  }

  @action
  async get(serverId: string) {
    let result = await serverService.get(serverId);
    this.editServer = {
      id: result.id,
      name: result.name,
      ipAddress: result.ipAddress,
      createdBy: result.createdBy,
      status: result.status,
      startDate: result.startDate,
      endDate: result.endDate,
    };
    console.log(this.editServer);
  }

  @action
  async update(serverId: string, server: GetServerOutput) {
    let result  = await serverService.update(serverId, server);
    console.log(result);
  }
}
export default ServerStore;
