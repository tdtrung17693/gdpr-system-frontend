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
    console.log()
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
  }

  @action
  async getServerList() {
    let result = await requestService.getServerList();
    this.serversList = result
  }

  @action
  async manage(request: ManageAcceptDeclineInput) {
    let result = await requestService.manage(request);
    console.log(result)
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
      serverIP: '',
      serverName: '',
      title: '',
      startDate: '',
      endDate: '',
      RoleName: '',
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
    console.log(result);
    this.editRequest = {
      id: result.RequestDetails.Id,
      status: result.RequestDetails.RequestStatus,
      createdDate: result.RequestDetails.CreatedAt,
      createdBy: result.RequestDetails.CreatedByNameEmail,
      updatedDate: result.RequestDetails.UpdatedAt,
      updatedBy: result.RequestDetails.UpdatedByNameEmail,
      serverId: result.RequestDetails.ServerId,
      serverIP: result.RequestDetails.ServerIP,
      serverName: result.RequestDetails.ServerName,
      title: result.RequestDetails.Title,
      startDate: result.RequestDetails.StartDate,
      endDate: result.RequestDetails.EndDate,
      RoleName: result.RequestDetails.RoleName,
    };
    console.log(this.editRequest)
  }

  

  @action
  async update(requestId: string, request: CreateRequestInput) {
    await requestService.update(requestId, request);
    // this.requests.items = this.requests.items.map((oldRequest:CreateRequestInput)=>{
    //   if(oldRequest?.id === requestId){
    //     oldRequest = {...oldRequest,...request};
    //   }
    //   return oldRequest;
    // });
  }
}
export default RequestStore;
