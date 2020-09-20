import { HistoryLogOutput } from '../../stores/historyLogStore';
import http from '../httpService';

class HistoryLogService {
  public async getLogOfRequest(requestId: string) {
    let listLogs: HistoryLogOutput = {
        items: []
    };
    await http.get(`api/historylog/${requestId}`).then((res:any) => {
        listLogs.items = res.data;
    });
    
    return listLogs;
  }
}

export default new HistoryLogService();

// createdAt: "2020-09-17T14:26:11.53"
// createdBy: "af511e50-993b-4405-a455-4da084e27074"
// message: "FName 68 LName 68"
// previousState: ""
// updatedField: ""
// updatedState: "Approved"
