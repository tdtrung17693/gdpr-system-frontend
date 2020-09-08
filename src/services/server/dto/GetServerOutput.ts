export interface GetServerOutput {
    id : string;
    createdBy: string;
    createdAt: Date;
    deletedBy?: string;
    deletedAt?: Date;
    endDate: Date;
    ipAddress: string;
    isDeleted: boolean;
    name: string;
    startDate: Date;
    status: boolean;
    updatedAt? : any;
    updatedBy? : string
  }
  