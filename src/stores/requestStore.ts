import { action, observable } from 'mobx';

import { PagedResultDto } from '../services/dto/pagedResultDto';
import { PagedUserResultRequestDto } from '../services/user/dto/PagedUserResultRequestDto';
import requestService, { Request } from '../services/request/requestService';
//import { CreateRequestInput } from '../services/request/dto/createRequestInput';
import {UpdateRequestInput} from '../services/request/dto/updateRequestInput';
class RequestStore {
  @observable requests!: PagedResultDto<Request>;
  @observable editRequest!: Request;

  async create(createRequestInput: Request) {
    await requestService.create(createRequestInput);
  }

  @action
  async update(requestId: string, updateRequestInput: UpdateRequestInput) {
    await requestService.update(requestId, updateRequestInput);
    this.requests.items = this.requests.items.map((x: Request) => {
      console.log(x)
      if (x?.id === requestId) x = {...x, ...updateRequestInput};
      console.log(x)
      return x;
    });
  }

  @action
  async delete(requestId: string) {
    await requestService.delete(requestId);
    this.requests.items = this.requests.items.filter((x: Request) => x?.id !== requestId);
  }

  @action
  async get(requestId: string) {
    let result = await requestService.get(requestId);
    this.editRequest = result;
  }

  @action
  async createRequest() {
    this.editRequest = {
        id: '',
        createdDate: new Date(),
        updatedDate: new Date(),
        requestStatus: 'string',
        serverId: '',
        title: '',
        startDate: new Date(),
        endDate: new Date(),
    };
  }

  @action
  async getAll(pagedFilterAndSortedRequest: PagedUserResultRequestDto) {
    let result = await requestService.getAll(pagedFilterAndSortedRequest);
    this.requests = result;
  }

  async changeLanguage(languageName: string) {
    await requestService.changeLanguage({ languageName: languageName });
  }
}

export default RequestStore;
