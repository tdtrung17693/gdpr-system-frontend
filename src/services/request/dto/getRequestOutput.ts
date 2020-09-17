export interface GetRequestOutput {
    Id: string;
    key?: string
    status: string;
    createdDate: string;
    createdBy: string;
    updatedDate: string;
    updatedBy: string;
    serverId: string;
    title: string;
    description?: string,
    startDate: string;
    endDate: string;
    Index?: number;
}