import { action, observable } from 'mobx';
import historyLogService from '../services/historyLog/historyLogService';

export interface HistoryLogOutput {
    items : any;
}

class HistoryLogStore {
    @observable historyLog : HistoryLogOutput = {
        items: []
    };

    @action
    async getLogOfRequest(requestId: string){
        let result = await historyLogService.getLogOfRequest(requestId);
        this.historyLog = result;
    }
}
export default HistoryLogStore;