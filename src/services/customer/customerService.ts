import axios from 'axios';
import { UpdateCustomerInput } from './dto/updateCustomerInput';
import { CreateOrUpdateCustomerInput } from './dto/createOrUpdateCustomerInput';
import http from '../httpService';
// import { CreateOrUpdateUserInput } from './dto/createOrUpdateUserInput';
// import { EntityDto } from '../../services/dto/entityDto';
// import { GetAllUserOutput } from './dto/getAllUserOutput';
// import { PagedResultDto } from '../../services/dto/pagedResultDto';
// import { PagedUserResultRequestDto } from "./dto/PagedUserResultRequestDto";
// import { UpdateUserInput } from './dto/updateUserInput';
//import http from '../httpService';

class CustomerService{
    public async getCustomerList(): Promise<any> {
        axios.get('http://localhost:5000/api/Customer')
        .then( (response) =>{
          return response;
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    public async filter(keyword: any): Promise<any> {
        axios.get('http://localhost:5000/api/Customer/' + keyword, /*{headers : header}*/)
        .then( (response) =>{
          return response;
        })
        .catch(function (error) {
          console.log(error);
        });
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