import React, { Component } from 'react';
import { Collapse, Button, Card, Col, Row, Input, DatePicker, Select } from 'antd';
import Search from 'antd/lib/input/Search';
import './index.css';

//mobx
import { inject, observer } from 'mobx-react';

import ResultTable from './Components/ResultTable/ResultTable';
import ImportButton from './Components/ImportButton/ImportButton';
//import CreateOrEditServerModal from './Components/CreateOrEditServerModal/CreateOrEditServerModal';

import { UserOutlined, EditOutlined } from '@ant-design/icons';
import Stores from '../../stores/storeIdentifier';
import ServerStore from '../../stores/serverStore';
import CreateOrUpdateModal from './Components/CreateOrEditServerModal/CreateOrUpdateModal';
import { GetServerOutput } from '../../services/server/dto/GetServerOutput';
import { Store } from 'antd/lib/form/interface';
//import ModalToggle from './Components/CreateOrEditServerModal/ModalToggle';
//import CollectionCreateOrEditForm from './Components/CreateOrEditServerModal/CollectionCreateOrEditForm';

const { Panel } = Collapse;
const { Option } = Select;
let mockusers: string[] = ['long.dao@netpower.no1', 'long.dao@netpower.no2', 'long.dao@netpower.no3'];
let mockadmins: string[] = ['long.dao@netpower.no4', 'long.dao@netpower.no5', 'long.dao@netpower.no6'];

interface IServerProps {
  serverStore: ServerStore;
}

@inject(Stores.ServerStore)
@observer
export default class Servers extends Component<IServerProps> {
  modalRef = React.createRef<CreateOrUpdateModal>();
  constructor(props:IServerProps){
    super(props);
    this.createOrUpdateModalOpen = this.createOrUpdateModalOpen.bind(this);
  }
  state = {
    modalVisible : false,
    editingServerId: "",
  };

  async createOrUpdateModalOpen(params: any) {
    if (params.id && params.id.length > 0) {
      await this.props.serverStore.get(params.id);
    } else {
      await this.props.serverStore.createServer();
    }

    this.setState({
      editingServerId: this.props.serverStore.editServer!.id
    })
    console.log("come across");
    this.toggleModal(() => {
      this.modalRef.current?.setFieldsValues(this.props.serverStore.editServer);
    });
  }

  toggleModal = (cb: Function = () => { }) => {
    this.setState({ modalVisible: !this.state.modalVisible }, () => {
      cb();
    })
  }

  handleSave = async (server: GetServerOutput | null, validatingErrors: Store) => {
    if (server) {
      if (this.state.editingServerId) {
        //await this.props.serverStore.update(this.state.editingUserId, user);
      } else {
        await this.props.serverStore.create(server);
      }
      this.toggleModal(async () => {
        await this.props.serverStore.getAll();
      });
    }
  }

  render() {
    //const { servers } = this.props.serverStore;
    return (
      <div style={{ overflow: 'scroll' }}>
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
            <Button
              // size="small"
              // style={{ display: 'inline-block', verticalAlign: 'middle' }}
              type="primary"
              onClick={() => this.createOrUpdateModalOpen({ id: '' })}
            >Create new server</Button>
            {/* <CreateOrEditServerModal isCreate serverData isEdit={false} serverStore = {this.props.serverStore} /> */}
            {/* <ModalToggle modal = {CollectionCreateOrEditForm} isCreate isEdit={false} serverData serverStore = {this.props.serverStore} /> */}
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
        <ResultTable serverStore={this.props.serverStore} createOrUpdateModalOpen = {this.createOrUpdateModalOpen} />


        <CreateOrUpdateModal
          ref={this.modalRef}
          visible={this.state.modalVisible}
          onCancel={() =>
            this.setState({
              modalVisible: false,
            })
          }
          modalType={this.state.editingServerId === "" ? 'create' : 'edit'}
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
