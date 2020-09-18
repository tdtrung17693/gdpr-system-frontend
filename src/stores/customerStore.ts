import { action, observable } from 'mobx';

import customerService from '../services/customer/customerService';
import { CreateOrUpdateCustomerInput } from '../services/customer/dto/createOrUpdateCustomerInput';
import { UpdateCustomerInput } from '../services/customer/dto/updateCustomerInput';
import { GetCustomerOutput} from '../services/customer/dto/getCustomerOutput';
import { PagedResultDto } from '../services/dto/pagedResultDto';
import { PagedCustomerResultRequestDto } from '../services/customer/dto/PagedCustomerResultRequestDto';
import http from '../services/httpService';
//import { EntityDto } from '../services/dto/entityDto';

class CustomerStore {
  @observable customers: any = [];
  @observable contactPoints: any = [];
  @observable editCustomer!: CreateOrUpdateCustomerInput;
  @observable servers!: PagedResultDto<GetCustomerOutput>;
  @observable loading: boolean = false;

  @action
  async create(createCustomerInput: CreateOrUpdateCustomerInput) {
    let result = await customerService.create(createCustomerInput);
    this.customers.items.push(result);
  }

  @action
  async update(updateCustomerInput: UpdateCustomerInput) {
    let result = await customerService.update(updateCustomerInput);
    this.customers.items = this.customers.items.map((x: GetCustomerOutput) => {
      if (x.key === updateCustomerInput.id) x = result;
      return x;
    });
  }

  @action
  async createCustomer() {
    this.editCustomer = {
        name: '',
        description: '',
        status: true,
        contractBeginDate: Date(),
        contratctEndDate: Date(),
        contactPoint: '',
        id: "",
    };
  }

  @action
  async getCustomerList(pagedFilterAndSortedRequest: PagedCustomerResultRequestDto) {
    this.loading = true;
    let result = await customerService.getCustomerList();
    this.customers = result;
    this.loading = false;
  }

  @action
  async getContactPoint() {
    this.loading = true
    let result = await http.get('api/customer/contact-point', /*{headers : header}*/)
    this.contactPoints = result.data;
    this.loading = false
  }

  @action
  async getFilteredCustomerList( queryString: string) {
    this.loading = true;
    let result = await customerService.filter(queryString);
    this.customers = result;
    this.loading = false;
  }
}

export default CustomerStore;
