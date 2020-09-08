import { action, observable } from 'mobx';
//import { PagedResultDto } from '../services/dto/pagedResultDto';
import { GetServerOutput } from '../services/server/dto/GetServerOutput';
import serverService from '../services/server/serverServices';

class ServerStore {
  @observable servers: GetServerOutput[] = []; //PagedResultDto<GetServerOutput>[]

  @action
  async getAll() {
    let result = await serverService.getAll();
    //console.log(result);
    this.servers = result; 
    //console.log(this.servers);
  }
}
export default ServerStore;
