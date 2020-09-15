//import { PagedResultDto } from '../dto/pagedResultDto';
import { GetRequestOutput } from '../../services/request/dto/getRequestOutput';
//import { CreateRequestInput } from './dto/CreateRequestInput';

import axios from 'axios';
import { PagedResultDto } from '../dto/pagedResultDto';
import { CreateRequestInput } from './dto/createRequestInput';
//import { UpdateRequestInput } from './dto/UpdateRequestInput';


const url = process.env.REACT_APP_REMOTE_SERVICE_BASE_URL;

class RequestService {
  public async create(createRequestInput: CreateRequestInput){
      let result = await axios.post(`${url}/api/request/create`, createRequestInput);
      return result.data;
  }

  public async getAll():Promise<PagedResultDto<GetRequestOutput>> {  // Promise<PagedResultDto<GetRequestOutput>>
    let result = await axios.get(`${url}/api/request`, {
      headers: { 'Access-Control-Allow-Origin': '*' },
    });

    let resultList : PagedResultDto<GetRequestOutput> = {
      items: result.data,
      totalItems: result.data.length,
    };
    return resultList;
  }

  public async getSearch(keywordInput: string):Promise<PagedResultDto<GetRequestOutput>> {  // Promise<PagedResultDto<GetRequestOutput>>
    let result = await axios.get(`${url}/api/request`, {
      headers: { 'Access-Control-Allow-Origin': '*' },
      params: { keyword : keywordInput}
    });

    let resultList : PagedResultDto<GetRequestOutput> = {
      items: result.data,
      totalCount: result.data.length,
    };
    return resultList;
  }
  
  public async getFilter(filterStatusInput: string):Promise<PagedResultDto<GetRequestOutput>> {  // Promise<PagedResultDto<GetRequestOutput>>
    let result = await axios.get(`${url}/api/request`, {
      headers: { 'Access-Control-Allow-Origin': '*' },
      params: { filterStatus: filterStatusInput}
    });

    let resultList : PagedResultDto<GetRequestOutput> = {
      items: result.data,
      totalCount: result.data.length,
    };
    return resultList;
  }
  

  public async get(requestId: string): Promise<any> {
    let result = await axios.get(`${url}/api/request/detail/${requestId}`, {
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
    return result.data; 
  }

  public async update(requestId: string, request: GetRequestOutput){
    let result = await axios.put(`${url}/api/request`, request);
    console.log(result);
  }

  public async getServerList(){
    //let result = await axios.get(`${url}/api/request`,{
    let result = await axios.get(`https://localhost:44317/api/Server`,{
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
    return result.data; 
  }
}

export default new RequestService();
