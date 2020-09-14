import axios from 'axios';
// import Button from 'react-bootstrap/Button';
import { Table, Button, Tag } from 'antd';
import React from 'react';
//mobx
import { inject, observer } from 'mobx-react';
import RequestStore from '../../../../stores/requestStore';
import Stores from '../../../../stores/storeIdentifier';
//import CreateOrEditRequestModal from '../CreateOrEditRequestModal/CreateOrEditRequestModal';

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
    const columns = [
      {
        title: 'ID',
        dataIndex: 'index',
        key: 'index',
      },
      {
        title: 'Status',
        dataIndex: 'RequestStatus',
        key: 'RequestStatus',
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
      },
      {
        title: 'Update Date',
        dataIndex: 'UpdatedByNameEmail',
        key: 'updatedAt',
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
        key: 'startDate',
      },
      {
        title: 'Request To',
        dataIndex: 'EndDate',
        key: 'endDate',
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
