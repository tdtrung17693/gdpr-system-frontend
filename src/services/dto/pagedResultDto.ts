export interface PagedResultDto<T> {
  totalItems: number;
  totalPages: number;
  page: number;
  items: T[];
}
