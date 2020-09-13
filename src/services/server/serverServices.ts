import { GetServerOutput } from './dto/GetServerOutput';
import { GetServerInput } from './dto/GetServerInput';
import { BulkServerStatus } from './dto/BulkServerStatus';
import { PagedResultDtoServer } from './dto/pagedResultDto';

import http from '../httpService';
import { GetListServerFilter } from './dto/GetListServerFilter';


const url = process.env.REACT_APP_REMOTE_SERVICE_BASE_URL;

class ServerService {
  public async create(createServerInput: GetServerInput) {
    let result = await http.post(`${url}api/server/create`, createServerInput);
    return result.data;
  }

  public async getAll(): Promise<PagedResultDtoServer<GetServerOutput>> {
    let result = await http.get(`${url}api/server/listServer`, {
      headers: { 'Access-Control-Allow-Origin': '*' },
    });

    let resultList: PagedResultDtoServer<GetServerOutput> = {
      items: result.data,
      totalCount: result.data.length,
    };
    return resultList;
  }

  public async get(serverId: string): Promise<any> {
    let result = await http.get(`${url}api/server/detail/${serverId}`, {
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
    return result.data;
  }

  public async update(serverId: string, server: GetServerInput) {
    await http.put(`${url}api/server`, server);
  }

  public async updateBulkServerStatus(bulkReq: BulkServerStatus) {
    await http.put(`${url}api/server/bulkStatus`, bulkReq);
  }

  public async importFileServer(file: FormData) {
    console.log(file);
    let result = await http.post(`${url}api/server/B461CC44-92A8-4CC4-92AD-8AB884EB1895/import`, file, {
      headers: {'Accept': '*/*', 'Content-Type': 'multipart/form-data  boundary=----WebKitFormBoundarymx2fSWqWSd0OxQqq'},
    });
    // , {
    //   headers : {'Content-Type': 'multipart/form-data'},
    // }
    console.log(result);
  }

  public async getListServerByFilter(filter: GetListServerFilter) {
    let result = await http.get(`${url}api/server/filter/${filter.filterKey}`);
    return result.data;
  }
}

export default new ServerService();
