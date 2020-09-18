import { UpdateCustomerInput } from './dto/updateCustomerInput';
import { CreateOrUpdateCustomerInput } from './dto/createOrUpdateCustomerInput';
import http from '../httpService';

class CustomerService{
    public async getCustomerList(): Promise<any> {
      let result = await http.get('api/Customer')
      return result.data;
    }

    public async filter(keyword: any): Promise<any> {
      let result = await http.get(`api/Customer/${keyword}`)
      return result.data;
    }
    
    public async create(createCustomerInput: CreateOrUpdateCustomerInput) {
        let result = await http.post('api/Customer',{createCustomerInput})
        return result.data.result;
      }
    
    public async update(updateCustomerInput: UpdateCustomerInput) {
      let result = await http.put('api/Customer', updateCustomerInput);
      return result.data.result;
    }

    public async getAllServer(): Promise<any>{
      let result = await http.get('api/customer/server');
      return result.data
    }
}

export default new CustomerService()