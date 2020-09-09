export interface CreateRequestInput {
  id: string,
  requestStatus: string,
  createdDate: Date,
  updatedDate: Date,
  serverId: string,
  title: string,
  startDate: Date,
  endDate: Date,
}
