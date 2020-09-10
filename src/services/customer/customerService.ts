import axios from 'axios';
import { UpdateCustomerInput } from './dto/updateCustomerInput';
import { CreateOrUpdateCustomerInput } from './dto/createOrUpdateCustomerInput';
// import { CreateOrUpdateUserInput } from './dto/createOrUpdateUserInput';
// import { EntityDto } from '../../services/dto/entityDto';
// import { GetAllUserOutput } from './dto/getAllUserOutput';
// import { PagedResultDto } from '../../services/dto/pagedResultDto';
// import { PagedUserResultRequestDto } from "./dto/PagedUserResultRequestDto";
// import { UpdateUserInput } from './dto/updateUserInput';
//import http from '../httpService';

class CustomerService{
    public async getAll(): Promise<any> {
        axios.get('http://localhost:5000/api/Customer', /*{headers : header}*/)
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
        let result = await axios.post('http://localhost:5000/api/Customer',{createCustomerInput})
        return result.data.result;
      }
    
    public async update(updateCustomerInput: UpdateCustomerInput) {
        let result = await axios.put('http://localhost:5000/api/Customer', updateCustomerInput);
        return result.data.result;
    }
}

export default new CustomerService()