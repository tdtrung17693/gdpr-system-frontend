export interface PagedResultDtoServer<T> {
  totalCount: number;
  items: T[];
}
