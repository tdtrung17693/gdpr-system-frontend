export interface GetRequestOutput {
    id: string;
    key?: string
    status: string;
    createdDate: string;
    createdBy: string;
    updatedDate: string;
    updatedBy: string;
    serverId: string;
    serverName: string;
    serverIp: string;
    title: string;
    description?: string,
    startDate: string;
    endDate: string;
    Index?: number;
}