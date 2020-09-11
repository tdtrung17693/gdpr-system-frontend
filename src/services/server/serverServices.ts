//import { PagedResultDto } from '../dto/pagedResultDto';
import { GetServerOutput } from './dto/GetServerOutput';
//import { CreateServerInput } from './dto/CreateServerInput';

import axios from 'axios';
import { GetServerInput } from './dto/GetServerInput';
import { BulkServerStatus } from './dto/BulkServerStatus';
import { PagedResultDtoServer } from './dto/pagedResultDto';
//import { UpdateServerInput } from './dto/UpdateServerInput';

const url = process.env.REACT_APP_REMOTE_SERVICE_BASE_URL;

class ServerService {
  public async create(createServerInput: GetServerInput) {
    let result = await axios.post(`${url}api/server/create`, createServerInput);
    return result.data;
  }

  public async getAll(): Promise<PagedResultDtoServer<GetServerOutput>> {
    // Promise<PagedResultDto<GetServerOutput>>
    let result = await axios.get(`${url}api/server`, {
      headers: { 'Access-Control-Allow-Origin': '*' },
    });

    let resultList: PagedResultDtoServer<GetServerOutput> = {
      items: result.data,
      totalCount: result.data.length,
    };
    return resultList;
  }

  public async get(serverId: string): Promise<any> {
    let result = await axios.get(`${url}api/server/detail/${serverId}`, {
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
    return result.data;
  }

  public async update(serverId: string, server: GetServerInput) {
    await axios.put(`${url}api/server`, server);
  }

  public async updateBulkServerStatus(bulkReq: BulkServerStatus){
    let result = await axios.put(`${url}api/server/bulkStatus`, bulkReq);
    console.log(result);
  }
}

export default new ServerService();
