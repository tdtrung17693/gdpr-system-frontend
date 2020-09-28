import { PagedResultDto } from './../dto/pagedResultDto';
import { GetServerOutput } from './dto/GetServerOutput';
import { GetServerInput } from './dto/GetServerInput';
import { BulkServerStatus } from './dto/BulkServerStatus';
import { PagedResultDtoServer } from './dto/pagedResultDto';

import http from '../httpService';
import { GetListServerFilter } from './dto/GetListServerFilter';

class ServerService {
  public async create(createServerInput: GetServerInput) {
    let result = await http.post(`api/server/create`, createServerInput);
    return result.data;
  }

  public async getAll(): Promise<PagedResultDtoServer<GetServerOutput>> {
    let result = await http.get(`api/server/listServer`, {
      headers: { 'Access-Control-Allow-Origin': '*' },
    });

    let resultList: PagedResultDtoServer<GetServerOutput> = {
      items: result.data,
      totalCount: result.data.length,
    };
    return resultList;
  }

  public async get(serverId: string): Promise<any> {
    let result = await http.get(`api/server/detail/${serverId}`, {
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
    return result.data;
  }

  public async update(serverId: string, server: GetServerInput) {
    await http.put(`api/server`, server);
  }

  public async updateBulkServerStatus(bulkReq: BulkServerStatus) {
    await http.put(`api/server/bulkStatus`, bulkReq);
  }

  public async importFileServer(listServer: any) {
    await http.post(`api/server/importExcel`, listServer);
  }

  public async getListServerByFilter(filter: GetListServerFilter) {
    let result = await http.get(`api/server/filter/${filter.filterKey}`);
    return result.data;
  }

  public async getServerListByPaging(pagingObj: any) {
    let result = await http.post(`api/server/count`, { filterString: pagingObj.filterBy });
    let result1 = await http.post(`api/server/paging`, pagingObj);
    let pagingList: PagedResultDto<GetServerOutput> = {
      totalItems: result.data[0].serverCount,
      totalPages: Math.floor(result.data[0].serverCount / pagingObj.pageSize) === 0 ? 1 : Math.floor(result.data[0].serverCount / pagingObj.pageSize),
      page: pagingObj.page,
      items: result1.data,
    };

    return pagingList;
  }
}

export default new ServerService();
