//import { CreateServerInput } from './../services/server/dto/CreateServerInput';
import { action, observable } from 'mobx';
import { GetServerOutput } from '../services/server/dto/GetServerOutput';
import { GetServerInput } from '../services/server/dto/GetServerInput';
import serverService from '../services/server/serverServices';
import { BulkServerStatus } from '../services/server/dto/BulkServerStatus';
import { PagedResultDtoServer } from '../services/server/dto/pagedResultDto';
import { GetListServerFilter } from '../services/server/dto/GetListServerFilter';

import moment from 'moment';
//import { UpdateServerInput } from '../services/server/dto/UpdateServerInput';

class ServerStore {
  @observable servers: PagedResultDtoServer<GetServerOutput> = {
    totalCount: 0,
    items: [],
  };
  @observable editServer!: GetServerInput;

  @action
  async getAll() {
    let result = await serverService.getAll();
    this.servers.items = [...result.items];
    this.servers.totalCount = result.totalCount;
    console.log(this.servers);
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
    if (new Date(0).getFullYear() > new Date(this.servers.items[index].startDate).getFullYear()) {
      this.servers.items[index].startDate = null;
    }
    if (new Date(0).getFullYear() > new Date(this.servers.items[index].endDate).getFullYear()) {
      this.servers.items[index].endDate = null;
    }
    //this.servers.items[index].StartDate = ((new Date(0)).getFullYear() < (new Date(this.servers.items[index].StartDate)).getFullYear()) ? this.servers.items[index]?.StartDate : '',
    this.servers.items[index].key = '' + index;
    this.servers.items[index].Index = index + 1;
    this.servers.items[index].IsActive = this.servers.items[index].status ? 'active' : 'inactive';
    this.servers.items[index].startDate = this.servers.items[index].startDate? moment(this.servers.items[index].startDate).format("YYYY-MM-DD"): '';
    this.servers.items[index].endDate = this.servers.items[index].endDate? moment(this.servers.items[index].endDate).format("YYYY-MM-DD") : '';
    this.servers.items[index].cusName = this.servers.items[index].cusName? this.servers.items[index].cusName : '';
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
  async updateBulkServerStatus(bulkReq: BulkServerStatus) {
    await serverService.updateBulkServerStatus(bulkReq);
  }

  @action
  async importFileServer(listServer: any) {
    await serverService.importFileServer(listServer);
  }

  @action
  public async getListServerByFilter(filter: GetListServerFilter) {
    if (filter.filterKey.length !== 0) {
      let listServerByFilter = await serverService.getListServerByFilter(filter);
      this.servers.items = listServerByFilter;
      this.servers.totalCount = listServerByFilter.length;
    }
    else{
      this.getAll();
    }
  }
}
export default ServerStore;
