import { Table, Button, Tag } from 'antd';
import React from 'react';
import { inject, observer } from 'mobx-react';
import RequestStore from '../../../../stores/requestStore';
import Stores from '../../../../stores/storeIdentifier';
import { ColumnProps } from 'antd/lib/table/Column';
import { GetRequestOutput } from '../../../../services/request/dto/getRequestOutput';
import moment from 'moment';

interface IRequests {
  key: string;
  id: string;
  status: string;
  createdDate: string;
  createdBy: string;
  updatedDate: string;
  serverName: string;
  serverIP: string,
  title: string;
  startDate: string;
  endDate: string;
  index: number;
}

interface RequestsProps {
  requestStore: RequestStore;
  handleModalOpen: any;
}

interface RequestStates {
  requests: IRequests[];
  selectedRowKeys: any;
  loading: boolean;
}

@inject(Stores.RequestStore)
@observer
export default class ResultTable extends React.Component<RequestsProps, RequestStates> {
  constructor(props: any) {
    super(props);
    this.state = {
      requests: [],
      selectedRowKeys: [],
      loading: false,
    };
  }

  componentDidMount() {
    this.getAllRequests();
  }

  async getAllRequests() {
    await this.props.requestStore.getAll();
  }

  start = () => {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({
        selectedRowKeys: [],
        loading: false,
      });
    }, 1000);
  };

  onSelectChange = (selectedRowKeys: any) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };

  render() {
    //const sorter = (a: string, b: string) => (a == null && b == null ? (a || '').localeCompare(b || '') : a - b);
    const columns:ColumnProps<GetRequestOutput>[] = [
      {
        title: 'ID',
        dataIndex: 'index',
        key: 'index',
      },
      {
        title: 'Status',
        dataIndex: 'RequestStatus',
        key: 'RequestStatus',
        filters: [
          {
            text: 'New',
            value: 'New',
          },
          {
            text: 'Open',
            value: 'Open',
          },
          {
            text: 'Closed',
            value: 'Closed',
          }
        ],
        onFilter: (value: any, record: any) => record.RequestStatus.indexOf(value) === 0,
        render: (requestStatus: string) => (
          <>            
                <Tag color={requestStatus === 'New' ? 'blue' : (requestStatus === 'Open' ? 'green' : 'red')} key={requestStatus}>
                  {requestStatus}
                </Tag>
          </>
        ),
      },
      {
        title: 'Create Date',
        dataIndex: 'CreatedByNameEmail',
        key: 'createdAt',
        sorter: (a: any, b: any) => moment(a.CreatedAt).unix() - moment(b.contractBeginDate).unix(),
        sortDirections: ['descend', 'ascend']
      },
      {
        title: 'Update Date',
        dataIndex: 'UpdatedByNameEmail',
        key: 'updatedAt',
        sorter: (a: any, b: any) => moment(a.UpdatedAt).unix() - moment(b.contractBeginDate).unix(),
        sortDirections: ['descend', 'ascend']
      },
      {
        title: 'Server',
        dataIndex: 'ServerName',
        key: 'serverId',
      },
      {
        title: 'ServerIP',
        dataIndex: 'ServerIP',
        key: 'serverIP',
      },
      {
        title: 'Title',
        dataIndex: 'Title',
        key: 'title',
      },
      {
        title: 'Request From',
        dataIndex: 'StartDate',
        sorter: (a: any, b: any) => moment(a.StartDate).unix() - moment(b.contractBeginDate).unix(),
        sortDirections: ['descend', 'ascend']
      },
      {
        title: 'Request To',
        dataIndex: 'EndDate',
        key: 'endDate',
        sorter: (a: any, b: any) => moment(a.EndDate).unix() - moment(b.contractBeginDate).unix(),
        sortDirections: ['descend', 'ascend']
      },
      {
        title: 'Action',
        dataIndex: 'button',
        key: 'button',
        render: () => <Button type="primary" size="small">Edit</Button>
      },
    ];

    if (this.props.requestStore.requests.items.length !== 0) {
      this.props.requestStore.requests.items.forEach((requestObject: any, index: number) => {
        this.props.requestStore.handleRequestMember(requestObject.status, index);
      });
    }
    const { loading, selectedRowKeys }: any = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    return (
      <div>
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" onClick={this.start} disabled={!hasSelected} loading={loading}>
            Export
          </Button>
          <span style={{ marginLeft: 8 }}>{hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}</span>
        </div>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={this.props.requestStore.requests.items.length <= 0 ? [] : this.props.requestStore.requests.items}
        />
      </div>
    );
  }
}
