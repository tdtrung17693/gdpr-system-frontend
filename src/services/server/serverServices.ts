//import { PagedResultDto } from '../dto/pagedResultDto';
import { GetServerOutput} from './dto/GetServerOutput';
import { CreateServerInput } from './dto/CreateServerInput';

import axios from 'axios';


const url = process.env.REACT_APP_REMOTE_SERVICE_BASE_URL;

class ServerService {
  public async create(createServerInput: CreateServerInput):Promise<any> {
      let result = await axios.post(`${url}api/server/create`, createServerInput);
      return result.data;
  }

  public async getAll():Promise<GetServerOutput[]> {  // Promise<PagedResultDto<GetServerOutput>>
    let result = await axios.get(`${url}api/server`, {
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
    return result.data;
  }
}

export default new ServerService();
