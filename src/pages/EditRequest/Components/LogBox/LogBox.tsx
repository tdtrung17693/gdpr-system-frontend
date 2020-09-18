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
    console.log(this.props.historyLogStore?.historyLog.items);
  }

  render() {
    let logData = this.props.historyLogStore?.historyLog.items.map((log: any) => {
      return {
        author:log.message,
        content: (
          log.updatedState === 'Created'?
          <p>
            <strong>{log.message}</strong> <i>created request</i>  
          </p>
          :
          <p>
            <strong>{log.message}</strong> <i>changed request status to</i> <strong>{log.updatedState}</strong> 
          </p>
        ),
        datetime: (
          <Tooltip title={moment(log.createdAt).format('YYYY-MM-DD HH:mm:ss')}>
            <span>{moment(log.createdAt).fromNow()}</span>
          </Tooltip>
        ),
      };
    });
    //console.log(logData);

    // const data = [
    //   {
    //     author: 'Han Solo',
    //     content: (
    //       <p>
    //         We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create
    //         their product prototypes beautifully and efficiently.
    //       </p>
    //     ),
    //     datetime: (
    //       <Tooltip title={moment().subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss')}>
    //         <span>{moment().subtract(1, 'days').fromNow()}</span>
    //       </Tooltip>
    //     ),
    //   },
    //   {
    //     author: 'Han Solo',
    //     content: (
    //       <p>
    //         We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create
    //         their product prototypes beautifully and efficiently.
    //       </p>
    //     ),
    //     datetime: (
    //       <Tooltip title={moment().subtract(2, 'days').format('YYYY-MM-DD HH:mm:ss')}>
    //         <span>{moment().subtract(2, 'days').fromNow()}</span>
    //       </Tooltip>
    //     ),
    //   },
    // ];

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
