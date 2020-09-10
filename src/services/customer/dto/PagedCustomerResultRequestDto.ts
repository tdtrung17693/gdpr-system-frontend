import { PagedFilterAndSortedRequest } from '../../dto/pagedFilterAndSortedRequest';

export interface PagedCustomerResultRequestDto extends PagedFilterAndSortedRequest  {
    keyword: string
}
