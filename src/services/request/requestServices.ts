import { GetRequestOutput } from '../../services/request/dto/getRequestOutput';

import { PagedResultDto } from '../dto/pagedResultDto';
import { CreateRequestInput } from './dto/createRequestInput';
import http from '../httpService';
import serverServices from '../server/serverServices';
import {ManageAcceptDeclineInput} from './dto/manageAcceptDeclineInput';
import {BulkRequestExport} from './dto/bulkRequestExport';
//import { result } from 'lodash';
class RequestService {
  public async create(createRequestInput: CreateRequestInput){
      let result = await http.post('api/request/create', createRequestInput);
      return result.data;
  }

  public async getAll():Promise<PagedResultDto<GetRequestOutput>> {  // Promise<PagedResultDto<GetRequestOutput>>
    let result = await http.get(`api/request`, {
      headers: { 'Access-Control-Allow-Origin': '*' },
      // params: {
      //   _pageNo: pageNo,
      // }
    });

    let resultList : PagedResultDto<GetRequestOutput> = {
      items: result.data,
      totalItems: result.data.length,
    };
    return resultList;
  }

  public async getRequestPaging(pagingObj: any) {
    let result = await http.get(`api/request/totalRows`,{
    params: {
      searchKey: (pagingObj.filterBy)?pagingObj.filterBy:''
    }}
    );
    let result1 = await http.get(`api/request`, {
      params: {
        _pageNo: pagingObj.page,
        _pageSize: pagingObj.pageSize,
        keyword: (pagingObj.filterBy)?pagingObj.filterBy:''
      }
    }
    );
    let pagingList: PagedResultDto<GetRequestOutput> = {
      totalItems: result.data[0].column1/* - pagingObj.pageSize*/,
      totalPages: Math.floor(result.data[0].column1 / pagingObj.pageSize) === 0 ? 1 : Math.floor(result.data[0].column1 / pagingObj.pageSize),
      page: pagingObj.page,
      items: result1.data,
    };
    return pagingList;
  }

  public async getRowsCount(){
    let result = await http.get(`api/request/totalRows`, {
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
    return result;
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
    
    return result.data; 
    
  }

  public async update(requestId: string, request: CreateRequestInput){
    await http.put(`api/request/update/${requestId}`, request);
  }

  //accept decline
  public async manage(request: ManageAcceptDeclineInput){
    await http.put(`api/Request/manage`, request);
  }

  public async exportBulk(request: BulkRequestExport){
    await http.put(`api/Request/manage/`, request);
    
  }

  public async getServerList(){
    let result = await serverServices.getAll()
    return result.items; 
  }
}

export default new RequestService();
