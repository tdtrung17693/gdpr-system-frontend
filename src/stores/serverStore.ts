import { CreateServerInput } from './../services/server/dto/CreateServerInput';
import { action, observable } from 'mobx';
import { GetServerOutput } from '../services/server/dto/GetServerOutput';
import serverService from '../services/server/serverServices';
import { PagedResultDto } from '../services/dto/pagedResultDto';

class ServerStore {
  @observable servers:  PagedResultDto<GetServerOutput> = {
    totalCount: 0 ,
    items: []
  };//PagedResultDto<GetServerOutput>[]

  @action
  async getAll() {
    let result = await serverService.getAll();
    this.servers = result; 
    //console.log(this.servers);
  }

  @action
  async create(server:CreateServerInput){
   
    await serverService.create(server);

  }
}
export default ServerStore;
