import { Table, Button } from 'antd';
import React, { Component } from 'react';
import axios from 'axios';
import RequestStore from '../../../../stores/requestStore';
import { inject, observer } from 'mobx-react';
import Stores from '../../../../stores/storeIdentifier';
export interface IUserProps {
  requestStore?: RequestStore;
}

@inject(Stores.RequestStore)
@observer
export default class ResultTable extends Component<IUserProps,any> {
  constructor(props: any){
    super(props);
    this.state = {
      index: '',
      datas: [],
      //for checkbox
      selectedRowKeys: [], 
      loading: false,
    }
  } 

  getRequestsData() {
    axios
        .get(`https://localhost:44387/api/Request`)
        .then( requests => {
          this.setState({
            datas: requests.data,
          });
        })
        .catch((error) => {
            console.log(error)
        })

  }

  componentDidMount(){
    this.getRequestsData();
    
  }
  
  //for checkbox
  onSelectChange = (selectedRowKeys: any) => {
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
        dataIndex: 'requestStatus',
        key: 'requestStatus',
      },
      {
        title: 'Create Date',
        dataIndex: 'createdDate',
        key: 'createdDate',
      },
      {
        title: 'Update Date',
        dataIndex: 'updatedDate',
        key: 'updatedDate',
      },
      {
        title: 'Server',
        dataIndex: 'serverId',
        key: 'serverId',
      },
      {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
      },
      {
        title: 'Request From',
        dataIndex: 'startDate',
        key: 'startDate',
      },
      {
        title: 'Request To',
        dataIndex: 'endDate',
        key: 'endDate',
      },
      {
        title: 'Action',
        dataIndex: 'button',
        key: 'button',
        render: () => <Button type='primary'  >Edit</Button>
      },
    ];

    const dataSrc = this.state.datas.map((data: { requestStatus: any; createdAt: any; updatedAt: any; serverId: any; title: any; startDate: any; endDate: any; },i: any) =>
      ({
        key: i,
        requestStatus: data.requestStatus,
        createdDate: data.createdAt,
        updatedDate: data.updatedAt,
        serverId: data.serverId,
        title: data.title,
        startDate: data.startDate,
        endDate: data.endDate

      })
    )

    //const dataSrc = this.props.requestStore?.requests.items;
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    return (
      
      <div>
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" >
            Accept/Decline
          </Button>
          <span style={{ marginLeft: 8 }}></span>
        </div>
        <Table rowSelection={rowSelection} dataSource={dataSrc} columns={columns} />
      </div>
    );
  }
}
