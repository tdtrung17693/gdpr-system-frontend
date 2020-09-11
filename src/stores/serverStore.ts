//import { CreateServerInput } from './../services/server/dto/CreateServerInput';
import { action, observable } from 'mobx';
import { GetServerOutput } from '../services/server/dto/GetServerOutput';
import { GetServerInput } from '../services/server/dto/GetServerInput';
import serverService from '../services/server/serverServices';
import { PagedResultDto } from '../services/dto/pagedResultDto';
import { BulkServerStatus } from '../services/server/dto/BulkServerStatus';
//import { UpdateServerInput } from '../services/server/dto/UpdateServerInput';

class ServerStore {
  @observable servers: PagedResultDto<GetServerOutput> = {
    totalCount: 0,
    items: [],
  };
  @observable editServer!: GetServerInput;

  @action
  async getAll() {
    let result = await serverService.getAll();
    this.servers.items = [...result.items];
    this.servers.totalCount = result.totalCount;
  }

  @action
  async create(server: GetServerInput) {
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
    this.servers.items[index].IsActive = this.servers.items[index].status?"active":"inactive";
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
  async update(serverId: string, server: GetServerInput) {
    await serverService.update(serverId, server);
    this.servers.items = this.servers.items.map((oldServer: GetServerOutput, index: number) => {
      if (oldServer?.id === serverId) {
        oldServer = { ...oldServer, status: server.Status, ...server };
      }
      return oldServer;
    });
  }

  @action
  async updateBulkServerStatus(bulkReq: BulkServerStatus){
    await serverService.updateBulkServerStatus(bulkReq);
  }
}
export default ServerStore;
