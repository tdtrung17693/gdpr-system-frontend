import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Card } from 'antd';
import HistoryLogStore from '../../../../stores/historyLogStore';
import Stores from '../../../../stores/storeIdentifier';
import { Comment, Tooltip, List } from 'antd';
import moment from 'moment';
interface LogProps {
  historyLogStore?: HistoryLogStore;
  requestId: string;
}

interface LogState {}

@inject(Stores.HistoryLogStore)
@observer
export class LogBox extends React.Component<LogProps, LogState> {
  componentDidMount() {
    this.getListLogs();
  }

  async getListLogs() {
    await this.props.historyLogStore?.getLogOfRequest(this.props.requestId);
    
  }

  renderLogItem = (log: any) => {
    if (log.updatedField === 'RequestStatus') {
      if (log.updatedState === 'Open') {
        return <p>{log.message} has accepted the request</p>
      } else if (log.updatedState === "Close" && log.previousState === "New") {
        return <p>{log.message} has rejected the request</p>
      } else if (log.updatedState === 'New') {
        return <p>{log.message} has created the request</p>
      }
    }

    return <p>{log.message} has updated the field {log.updatedField}: {log.previousState} {'->'} {log.updatedState}</p>
  }

  render() {
    let logData = this.props.historyLogStore?.historyLog.items.map((log: any) => {
      return {
        author:log.message,
        content: (
          this.renderLogItem(log)
        ),
        datetime: (
          <Tooltip title={moment.utc(log.createdAt).local().format('YYYY-MM-DD HH:mm:ss')}>
            <span>{moment.utc(log.createdAt).fromNow()}</span>
          </Tooltip>
        ),
      };
    });

    return (
      <Card bordered={true} style={{ marginBottom: 10 }}>
        <List
          className="comment-list"
          header={`${logData.length} Log Changes`}
          itemLayout="horizontal"
          dataSource={logData}
          renderItem={(item: any) => (
            <li>
              <Comment author={item.author} content={item.content} datetime={item.datetime} />
            </li>
          )}
        />
      </Card>
    );
  }
}

export default LogBox;
