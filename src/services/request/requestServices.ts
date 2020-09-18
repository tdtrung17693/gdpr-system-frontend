import { GetRequestOutput } from '../../services/request/dto/getRequestOutput';

import { PagedResultDto } from '../dto/pagedResultDto';
import { CreateRequestInput } from './dto/createRequestInput';
import http from '../httpService';
import serverServices from '../server/serverServices';
import {ManageAcceptDeclineInput} from './dto/manageAcceptDeclineInput';
import {BulkRequestExport} from './dto/bulkRequestExport';
class RequestService {
  public async create(createRequestInput: CreateRequestInput){
      let result = await http.post('api/request/create', createRequestInput);
      return result.data;
  }

  public async getAll():Promise<PagedResultDto<GetRequestOutput>> {  // Promise<PagedResultDto<GetRequestOutput>>
    let result = await http.get(`api/request`, {
      headers: { 'Access-Control-Allow-Origin': '*' },
    });

    let resultList : PagedResultDto<GetRequestOutput> = {
      items: result.data,
      totalItems: result.data.length,
    };
    return resultList;
  }

  public async getSearch(keywordInput: string):Promise<PagedResultDto<GetRequestOutput>> {  // Promise<PagedResultDto<GetRequestOutput>>
    let result = await http.get(`api/request`, {
      headers: { 'Access-Control-Allow-Origin': '*' },
      params: { keyword : keywordInput}
    });

    let resultList : PagedResultDto<GetRequestOutput> = {
      items: result.data,
      totalItems: result.data.length,
    };
    return resultList;
  }
  
  public async getFilter(filterStatusInput: string):Promise<PagedResultDto<GetRequestOutput>> {  // Promise<PagedResultDto<GetRequestOutput>>
    let result = await http.get(`api/request`, {
      headers: { 'Access-Control-Allow-Origin': '*' },
      params: { filterStatus: filterStatusInput}
    });

    let resultList : PagedResultDto<GetRequestOutput> = {
      items: result.data,
      totalItems: result.data.length,
    };
    return resultList;
  }
  

  public async get(requestId: string): Promise<any> {
    let result = await http.get(`api/request/${requestId}`, {
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
    console.log(result.data.RequestDetails)
    return result.data; 
    
  }

  public async update(requestId: string, request: CreateRequestInput){
    let result = await http.put(`api/request/update/${requestId}`, request);
    console.log(result);
  }

  //accept decline
  public async manage(request: ManageAcceptDeclineInput){
    let result = await http.put(`api/Request/manage`, request);
    console.log(result);
  }

  public async exportBulk(request: BulkRequestExport){
    let result = await http.put(`api/Request/manage/`, request);
    console.log(result);
  }

  public async getServerList(){
    //let result = await axios.get(`${url}/api/request`,{
    let result = await serverServices.getAll()
    return result.items; 
  }
}

export default new RequestService();
