import { CreateServerInput } from './../services/server/dto/CreateServerInput';
import { action, observable } from 'mobx';
//import { PagedResultDto } from '../services/dto/pagedResultDto';
import { GetServerOutput } from '../services/server/dto/GetServerOutput';
import serverService from '../services/server/serverServices';

class ServerStore {
  @observable servers: GetServerOutput[] = []; //PagedResultDto<GetServerOutput>[]

  @action
  async getAll() {
    let result = await serverService.getAll();
    this.servers = result; 
  }

  @action
  async create(server:CreateServerInput){
    let newServer : GetServerOutput = {
      createdBy: server.createdBy,
      name: server.name,
      ipAddress: server.ipAddress,
      startDate: server.startDate,
      endDate: server.endDate
    };
    await serverService.create(server);
    this.servers.push(newServer);
    console.log("DONE")
    
  }
}
export default ServerStore;
