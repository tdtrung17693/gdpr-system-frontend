﻿import React, { Component } from 'react';
import { Collapse, Button, Card, Col, Row, Input, DatePicker, Select, Switch } from 'antd';
import Search from 'antd/lib/input/Search';
import './index.css';

//mobx
import { inject, observer } from 'mobx-react';

import ResultTable from './Components/ResultTable/ResultTable';
import ImportButton from './Components/ImportButton/ImportButton';
import CreateOrEditServerModal from './Components/CreateOrEditServerModal/CreateOrEditServerModal';

import { UserOutlined, EditOutlined } from '@ant-design/icons';
import Stores from '../../stores/storeIdentifier';
import ServerStore from '../../stores/serverStore';

const { Panel } = Collapse;
const { Option } = Select;
let mockusers: string[] = ['long.dao@netpower.no1', 'long.dao@netpower.no2', 'long.dao@netpower.no3'];
let mockadmins: string[] = ['long.dao@netpower.no4', 'long.dao@netpower.no5', 'long.dao@netpower.no6'];



interface IServers {
  key: string;
  id: string;
  name: string;
  ipAddress: string;
  createBy: string;
  startDate: string;
  endDate: string;
  status: any;
  editButton: any;
  index: number;
}

interface IServerProps {
  serverStore: ServerStore;
}

interface IServerState {
  servers: IServers[];
}

//@inject(Stores.ServerStore)
@inject(Stores.ServerStore)
@observer
export default class Servers extends Component<IServerProps, IServerState> {
  //const [servers, setServers] = useState<IServers[]>([]);
  state = {
    servers: [],
  };
  async componentDidMount() {
    this.getAllServers();
  }

  async getAllServers() {
    await this.props.serverStore.getAll();
    let modifiedServerList: IServers[] = [];
    let serverList: any = Object.assign([], this.props.serverStore.servers);
    serverList.forEach((server: any, index: number) => {
      let serverObject: any = Object.assign({}, server);
      let modifiedServer: IServers = {
        key: '' + index,
        id: serverObject.id,
        name: serverObject.name,
        ipAddress: serverObject.ipAddress,
        createBy: serverObject.createdBy,
        startDate: serverObject.startDate,
        endDate: serverObject.endDate,
        status: serverObject.status ? (
          <Switch style={{ width: '65%' }} disabled={true} checkedChildren="active" defaultChecked />
        ) : (
          <Switch style={{ width: '65%' }} disabled={true} unCheckedChildren="inactive" />
        ),
        editButton: <CreateOrEditServerModal key={serverObject.name} serverData={serverObject} isCreate={false} isEdit />,
        index: index + 1,
      };
      modifiedServerList.push(modifiedServer);
    });
    this.setState({ servers: modifiedServerList });
  }

  render() {
    return (
      <div style = {{overflow: "scroll"}}>
        <h2>Servers Management</h2>
        <Collapse defaultActiveKey={['1']}>
          <Panel header="Export Requests By Servers" key="0">
            <div className="site-card-wrapper">
              <Row gutter={16}>
                <Col span={6}>
                  <Card hoverable={true} title="FromDate:" bordered={false}>
                    <Input.Group compact>
                      <EditOutlined />
                      <DatePicker style={{ width: '100%' }} />
                    </Input.Group>
                  </Card>
                </Col>
                <Col span={6}>
                  <Card hoverable={true} title="ToDate:" bordered={false}>
                    <Input.Group compact>
                      <EditOutlined />
                      <DatePicker style={{ width: '100%' }} />
                    </Input.Group>
                  </Card>
                </Col>
                <Col span={6}>
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
                </Col>
              </Row>
            </div>
            <Button type="primary">Process Exports</Button>
          </Panel>
        </Collapse>
        <div className="create-filter">
          <div>
            <CreateOrEditServerModal isCreate serverData isEdit={false} />
            <ImportButton />
          </div>
          <Search
            style={{ width: '400px' }}
            placeholder="input search text"
            enterButton="Search"
            size="large"
            onSearch={(value) => console.log(value)}
          />
        </div>
        <ResultTable data={this.state.servers} />
      </div>
    );
  }
}



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