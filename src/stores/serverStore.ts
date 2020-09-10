//import { CreateServerInput } from './../services/server/dto/CreateServerInput';
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
    console.log(this.servers);
  }

  @action
  async create(server: GetServerOutput) {
    await serverService.create(server);
  }

  @action
  async createServer() {
    this.editServer = {
      Id: '',
      Name: '',
      IpAddress: '',
      CreatedBy: '',
      Status: true,
      StartDate: '',
      EndDate: '',
    };
  }

  @action
  handleServerMember(status: boolean, index: number) {
    this.servers.items[index].key = '' + index;
    this.servers.items[index].Index = index + 1;
    this.servers.items[index].IsActive = this.servers.items[index].Status;
  }

  @action
  async get(serverId: string) {
    let result = await serverService.get(serverId);
    this.editServer = {
      Id: result.id,
      Name: result.name,
      IpAddress: result.ipAddress,
      CreatedBy: result.createdBy,
      Status: result.status,
      StartDate: result.startDate,
      EndDate: result.endDate,
    };
  }

  @action
  async update(serverId: string, server: GetServerOutput) {
    let result  = await serverService.update(serverId, server);
    console.log(result);
  }
}
export default ServerStore;
