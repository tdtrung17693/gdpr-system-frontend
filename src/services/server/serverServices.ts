//import { PagedResultDto } from '../dto/pagedResultDto';
import { GetServerOutput} from './dto/GetServerOutput';
import { CreateServerInput } from './dto/CreateServerInput';

import axios from 'axios';
import { PagedResultDto } from '../dto/pagedResultDto';


const url = process.env.REACT_APP_REMOTE_SERVICE_BASE_URL;

class ServerService {
  public async create(createServerInput: CreateServerInput){
      let result = await axios.post(`${url}api/server/create`, createServerInput);
      return result.data;
  }

  public async getAll():Promise<PagedResultDto<GetServerOutput>> {  // Promise<PagedResultDto<GetServerOutput>>
    let result = await axios.get(`${url}api/server`, {
      headers: { 'Access-Control-Allow-Origin': '*' },
    });

    let resultList : PagedResultDto<GetServerOutput> = {
      items: result.data,
      totalCount: result.data.length,
    };
    return resultList;
  }

  public async get(serverId: string): Promise<GetServerOutput> {
    let result = await axios.get(`${url}api/server/detail/${serverId}`, {
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
    console.log(result.data);
    return result.data;
  }
}

export default new ServerService();