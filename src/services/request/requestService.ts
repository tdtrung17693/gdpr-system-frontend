import { ChangeLanguageInput } from './dto/changeLanguageInput';
import { UpdateRequestInput } from './dto/updateRequestInput';
import { PagedResultDto } from '../../services/dto/pagedResultDto';
import { PagedUserResultRequestDto } from "./dto/PagedUserResultRequestDto";
import http from '../httpService';

export type Request = {
    id: string,
    requestStatus: string,
    createdDate: Date,
    updatedDate: Date,
    serverId: string,
    title: string,
    startDate: Date,
    endDate: Date,
  };

class RequestService {
  public async create(createRequestInput: Request) {
    let result = await http.post('api/Requests', createRequestInput);
    return result.data.result;
  }

  public async update(requestId: string, updateRequestInput: UpdateRequestInput) {
    let result = await http.put(`api/Requests/${requestId}`, updateRequestInput);
    return result.data.result;
  }

  public async delete(requestId: string) {
    let result = await http.delete(`api/Requests/${requestId}`);
    return result.data;
  }

  public async changeLanguage(changeLanguageInput: ChangeLanguageInput) {
    let result = await http.post('api/services/app/User/ChangeLanguage', changeLanguageInput);
    return result.data;
  }

  public async get(requestId: string): Promise<Request> {
    let result = await http.get(`api/Requests/${requestId}`);
    return result.data;
  }

  public async getAll(pagedFilterAndSortedRequest: PagedUserResultRequestDto): Promise<PagedResultDto<Request>> {
    let result = await http.get('api/Requests', { params: pagedFilterAndSortedRequest });
    return result.data;
  }
}

export default new RequestService();