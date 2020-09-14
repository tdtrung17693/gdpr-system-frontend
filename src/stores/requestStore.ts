//import { CreateRequestInput } from './../services/Request/dto/CreateRequestInput';
import { action, observable } from 'mobx';
import { GetRequestOutput } from '../services/request/dto/getRequestOutput';
import requestService from '../services/request/requestServices';
import { PagedResultDto } from '../services/dto/pagedResultDto';
//import { UpdateRequestInput } from '../services/request/dto/UpdateRequestInput';
import {ServerModel} from '../services/request/dto/serverModel'
class RequestStore {
  @observable requests: PagedResultDto<GetRequestOutput> = {
    totalCount: 0,
    items: [],
  };
  @observable editRequest!: GetRequestOutput;
  @observable serversList!: ServerModel[];

  @action
  async getAll() {
    let result = await requestService.getAll();
    this.requests.items = [...result.items];
    this.requests.totalCount = result.totalCount;
    console.log(this.requests.items)
  }

  @action
  async getServerList() {
    let result = await requestService.getServerList();
    console.log(result)
    this.serversList = result
    console.log(this.serversList)
  }


  @action
  async create(request: GetRequestOutput) {
    await requestService.create(request);
  }

  @action
  async createRequest() {
    this.editRequest = {
      id: '',
      status: '',
      createdDate: '',
      createdBy: '',
      updatedDate: '',
      serverName: '',
      title: '',
      startDate: '',
      endDate: '',

    };
  }

  @action
  handleRequestMember(status: boolean, index: number) {
    this.requests.items[index].key = '' + index;
    this.requests.items[index].Index = index + 1;
  }

  @action
  async get(requestId: string) {
    let result = await requestService.get(requestId);
    this.editRequest = {
      id: result.Id,
      status: result.RequestStatus,
      createdDate: result.CreatedAt,
      createdBy: result.CreatedByName,
      updatedDate: result.UpdatedAt,
      serverName: result.ServerName,
      title: result.Title,
      startDate: result.StartDate,
      endDate: result.EndDate,
    };
  }

  @action
  async update(requestId: string, request: GetRequestOutput) {
    await requestService.update(requestId, request);
    this.requests.items = this.requests.items.map((oldRequest:GetRequestOutput)=>{
      if(oldRequest?.id === requestId){
        oldRequest = {...oldRequest,...request};
      }
      return oldRequest;
    });
  }
}
export default RequestStore;
