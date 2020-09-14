﻿import React, { Component } from 'react';
import { Collapse, Button, Card, Col, Row, Input, DatePicker } from 'antd';
import Search from 'antd/lib/input/Search';
import './index.css';

//mobx
import { inject, observer } from 'mobx-react';

import ResultTable from './Components/ResultTable/ResultTable';
import ImportButton from './Components/ImportButton/ImportButton';

import { EditOutlined } from '@ant-design/icons';
import Stores from '../../stores/storeIdentifier';
import ServerStore from '../../stores/serverStore';
import CreateOrUpdateModal from './Components/CreateOrEditServerModal/CreateOrUpdateModal';
import { Store } from 'antd/lib/form/interface';
import { GetServerInput } from '../../services/server/dto/GetServerInput';
import { GetListServerFilter } from '../../services/server/dto/GetListServerFilter';
import AuthenticationStore from '../../stores/authenticationStore';

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

import axios from 'axios';

const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const fileExtension = '.xlsx';

const exportToCSV = (csvData: any, fileName: any) => {
  const csvDataRequest = csvData.map((e: any) => e[0]);

  const ws = XLSX.utils.json_to_sheet(csvDataRequest);
  //console.log(ws);
  const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: fileType });
  FileSaver.saveAs(data, fileName + fileExtension);
};

const { Panel } = Collapse;
//const { Option } = Select;
//let mockusers: string[] = ['long.dao@netpower.no1', 'long.dao@netpower.no2', 'long.dao@netpower.no3'];
//let mockadmins: string[] = ['long.dao@netpower.no4', 'long.dao@netpower.no5', 'long.dao@netpower.no6'];

interface IServerProps {
  serverStore: ServerStore;
  authenticationStore: AuthenticationStore;
}

@inject(Stores.ServerStore, Stores.AuthenticationStore)
@observer
export default class Servers extends Component<IServerProps> {
  modalRef = React.createRef<CreateOrUpdateModal>();
  constructor(props: IServerProps) {
    super(props);
    this.createOrUpdateModalOpen = this.createOrUpdateModalOpen.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleExport = this.handleExport.bind(this);
  }
  state = {
    modalVisible: false,
    editingServerId: '',
    fromDate: Date(),
    toDate: Date(),
    guids: [],
  };

  async createOrUpdateModalOpen(params: any) {
    if (params.id && params.id.length > 0) {
      await this.props.serverStore.get(params.id);
    } else {
      await this.props.serverStore.createServer();
    }

    this.setState({
      editingServerId: this.props.serverStore.editServer!.Id,
    });
    this.toggleModal(() => {
      this.modalRef.current?.setFieldsValues(this.props.serverStore.editServer);
    });
  }

  toggleModal = (cb: Function = () => {}) => {
    this.setState({ modalVisible: !this.state.modalVisible }, () => {
      cb();
    });
  };

  handleSave = async (server: GetServerInput | null, validatingErrors: Store) => {
    if (server) {
      if (this.state.editingServerId) {
        server = {
          ...server,
          Id: this.state.editingServerId,
        };
        await this.props.serverStore.update(this.state.editingServerId, server);
      } else {
        await this.props.serverStore.create(server);
      }
      this.toggleModal(async () => {
        await this.props.serverStore.getAll();
      });
    }
  };

  async handleSearch(value: string) {
    let filter: GetListServerFilter = {
      filterKey: value,
    };
    await this.props.serverStore.getListServerByFilter(filter);
  }

  async handleExport(e: any) {
    axios
      .post('http://localhost:5000/api/server/export-csv', {
        fromDate: this.state.fromDate,
        toDate: this.state.toDate,
        guids: [],
      })
      .then((response) => {
        //console.log(response.data.responsedRequest);
        exportToCSV(response.data.responsedRequest, 'xfilename');
      })
      // .catch(function (error) {
      //   console.log(error);
      // });
  }

  render() {
    return (
      <div style={{ overflow: 'scroll' }}>
        <h2>Servers Management</h2>
        <Collapse defaultActiveKey={['1']}>
          <Panel header="Export Requests By Servers" key="0">
            <div className="site-card-wrapper">
              <Row gutter={16}>
                <Col span={12}>
                  <Card hoverable={true} title="FromDate:" bordered={false}>
                    <Input.Group compact>
                      <EditOutlined />
                      <DatePicker onChange={value => this.setState({fromDate: value})} style={{ width: '100%' }} />
                    </Input.Group>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card hoverable={true} title="ToDate:" bordered={false}>
                    <Input.Group compact>
                      <EditOutlined />
                      <DatePicker  onChange={value => this.setState({toDate: value})} style={{ width: '100%' }} />
                    </Input.Group>
                  </Card>
                </Col>
              </Row>
            </div>
            <Button type="primary" onClick={this.handleExport}>
              Process Exports
            </Button>
          </Panel>
        </Collapse>
        <div className="create-filter">
          <div>
            <Button
              type="primary"
              onClick={() => this.createOrUpdateModalOpen({ id: '' })}
            >
              Create new server
            </Button>
            <ImportButton serverStore={this.props.serverStore} />
          </div>
          <Search style={{ width: '400px' }} placeholder="input search text" enterButton="Search" size="large" onSearch={this.handleSearch} />
        </div>
        <ResultTable serverStore={this.props.serverStore} createOrUpdateModalOpen={this.createOrUpdateModalOpen} />

        <CreateOrUpdateModal
          ref={this.modalRef}
          visible={this.state.modalVisible}
          onCancel={() =>
            this.setState({
              modalVisible: false,
            })
          }
          modalType={this.state.editingServerId === '' ? 'create' : 'edit'}
          onSave={this.handleSave}
          {...this.props}
        />
      </div>
    );
  }
}

//data={this.state.servers}

// useEffect(() => {
//   async function getAllServers() {
//     let modifiedData: IServers[] = [];
//     await axios
//       .get(`${url}api/server`, {
//         headers: { 'Access-Control-Allow-Origin': '*' },
//       })
//       .then((res) => {
//         let { data }: any = res;
//         //console.log(data);
//         data.map((server: any, index: number) => {
//           let modifiedServer: IServers = {
//             key: '' + index,
//             id: server.id,
//             name: server.name,
//             ipAddress: server.ipAddress,
//             createBy: server.createdBy,
//             startDate: server.startDate,
//             endDate: server.endDate,
//             status: server.status ? <Switch style = {{width : '65%'}} disabled = {true} checkedChildren="active" defaultChecked /> : <Switch style = {{width : '65%'}} disabled = {true} unCheckedChildren="inactive" />,
//             editButton: <CreateOrEditServerModal key={server.name} serverData={server} isCreate={false} isEdit/>,
//             index: index + 1,
//           };
//           modifiedData.push(modifiedServer);
//         });
//       });
//     setServers((servers) => [...servers, ...modifiedData]);
//   }
//   getAllServers();
// }, []);

{/* <Col span={6}>
                  <Card hoverable={true} title="Requester:" bordered={false}>
                    <Input.Group compact>
                      <UserOutlined />
                      <Select style={{ width: '100%' }}>
                        {mockusers.map((email, index) => {
                          return (
                            <Option value={email} key={index}>
                              {email}
                            </Option>
                          );
                        })}
                      </Select>
                    </Input.Group>
                  </Card>
                </Col>
                <Col span={6}>
                  <Card hoverable={true} title="Approver:" bordered={false}>
                    <Input.Group compact>
                      <UserOutlined />
                      <Select style={{ width: '100%' }}>
                        {mockadmins.map((email, index) => {
                          return (
                            <Option value={email} key={index}>
                              {email}
                            </Option>
                          );
                        })}
                      </Select>
                    </Input.Group>
                  </Card>
                </Col> */}
