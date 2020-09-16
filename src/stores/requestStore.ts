//import { CreateRequestInput } from './../services/Request/dto/CreateRequestInput';
import { action, observable } from 'mobx';
import { GetRequestOutput } from '../services/request/dto/getRequestOutput';
import requestService from '../services/request/requestServices';
import { PagedResultDto } from '../services/dto/pagedResultDto';
//import { UpdateRequestInput } from '../services/request/dto/UpdateRequestInput';
// import {ServerModel} from '../services/request/dto/serverModel'
import { CreateRequestInput } from '../services/request/dto/createRequestInput';
import { GetServerOutput } from '../services/server/dto/GetServerOutput';
import {ManageAcceptDeclineInput} from '../services/request/dto/manageAcceptDeclineInput';
class RequestStore {
  @observable requests: PagedResultDto<GetRequestOutput> = {
    totalItems: 0,
    items: [],
  };
  @observable editRequest!: GetRequestOutput;
  @observable serversList: GetServerOutput[] = [];
  @observable currentId!: string;

  @action
  async getAll() {
    let result = await requestService.getAll();
    this.requests.items = [...result.items];
    this.requests.totalItems = result.totalItems;
  }

  @action
  async manageAccDecl(requestId: string, request: ManageAcceptDeclineInput) {
    let result = await requestService.manage(requestId,request);
    console.log(result)
  }

  
  @action
  async getSearch(keywordInput: string) {
    let result = await requestService.getSearch(keywordInput);
    this.requests.items = [...result.items];
    this.requests.totalItems = result.totalItems;
  }

  async getFilter(filterStatus: string) {
    let result = await requestService.getFilter(filterStatus);
    this.requests.items = [...result.items];
    this.requests.totalItems = result.totalItems;
    console.log(this.requests.items)
  }

  @action
  async getServerList() {
    let result = await requestService.getServerList();
    this.serversList = result
  }

  @action
  async create(request: CreateRequestInput) {
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
      updatedBy: '',
      serverId: '',
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
      updatedBy: result.UpdatedByName,
      serverId: result.ServerId,
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
