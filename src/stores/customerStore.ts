import { action, observable } from 'mobx';

import customerService from '../services/customer/customerService';
import { CreateOrUpdateCustomerInput } from '../services/customer/dto/createOrUpdateCustomerInput';
import { UpdateCustomerInput } from '../services/customer/dto/updateCustomerInput';
import { GetCustomerOutput} from '../services/customer/dto/getCustomerOutput';
import { PagedResultDto } from '../services/dto/pagedResultDto';
import { PagedCustomerResultRequestDto } from '../services/customer/dto/PagedCustomerResultRequestDto';
//import { EntityDto } from '../services/dto/entityDto';

class customerStore {
  @observable customers!: PagedResultDto<GetCustomerOutput>;
  @observable editCustomer!: CreateOrUpdateCustomerInput;
  @observable servers!: PagedResultDto<GetCustomerOutput>;

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

//   @action
//   async delete(entityDto: EntityDto) {
//     await customerService.delete(entityDto);
//     this.customers.items = this.customers.items.filter((x: GetcustomerOutput) => x.id !== entityDto.id);
//   }

//   @action
//   async get(entityDto: EntityDto) {
//     let result = await customerService.get(entityDto);
//     this.editCustomer = result;
//   }

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
    let result = await customerService.getCustomerList();
    this.customers = result;
  }
}

export default customerStore;
