import { PagedFilterAndSortedRequest } from '../../dto/pagedFilterAndSortedRequest';

export interface PagedUserResultRequestDto extends PagedFilterAndSortedRequest  {
    filterBy: string;
    sortedBy: string;
    sortOrder: string;
}
