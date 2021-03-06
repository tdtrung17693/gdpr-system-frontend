import React, { Component } from 'react';
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

import http from '../../services/httpService';
import ProtectedComponent from '../../components/ProtectedComponent';
import moment from 'antd/node_modules/moment';

const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const fileExtension = '.xlsx';

const exportToCSV = (csvData: any, fileName: any) => {
  const csvDataRequest = csvData.map((e: any) => e[0]);

  const ws = XLSX.utils.json_to_sheet(csvDataRequest);
  //
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
  }

  state = {
    modalVisible: false,
    editingServerId: '',
    fromDate: Date(),
    toDate: Date(),
    guids: [],
    filterString: '',
  };

  createOrUpdateModalOpen = async (params: any) => {
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
  };

  toggleModal = (cb: Function = () => {
  }) => {
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
        await this.props.serverStore.getServerListByPaging(this.props.serverStore.pagingObj);
      });
    }
  };

  handleSearch = async (value: string) => {
    let filter: GetListServerFilter = {
      filterKey: value,
    };
    this.setState({ filterString: filter.filterKey });
    this.props.serverStore.pagingObj = {
      ...this.props.serverStore.pagingObj,
      page: 0,
      filterBy: filter.filterKey,
    };
    await this.props.serverStore.getListServerByFilter(this.props.serverStore.pagingObj);
  };

  handleExport = (e: any) => {
    http
      .post('api/server/export-csv', {
        fromDate: this.state.fromDate,
        toDate: this.state.toDate,
        guids: [],
      })
      .then((response) => {
        if(response.data.responsedRequest){
          response.data.responsedRequest.forEach((r:any) => {
            r[0] = {
              ...r[0],
              startDate : moment(r[0].startDate).format("DD/MM/YYYY").toString(),
              endDate : moment(r[0].endDate).format("DD/MM/YYYY").toString(),
            }
          });
        }
        exportToCSV(response.data.responsedRequest, 'Server List');
      })

  };

  render() {
    return (
      <div>
        <h2>Servers Management</h2>
        <ProtectedComponent requiredPermission="data:export">
          <Collapse defaultActiveKey={['1']}>
            <Panel header="Export Requests By Servers" key="0">
              <div className="site-card-wrapper">
                <Row gutter={16}>
                  <Col span={12}>
                    <Card hoverable={true} title="FromDate:" bordered={false}>
                      <Input.Group compact>
                        <EditOutlined />
                        <DatePicker onChange={value => this.setState({ fromDate: value })} style={{ width: '100%' }} />
                      </Input.Group>
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card hoverable={true} title="ToDate:" bordered={false}>
                      <Input.Group compact>
                        <EditOutlined />
                        <DatePicker onChange={value => this.setState({ toDate: value })} style={{ width: '100%' }} />
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
        </ProtectedComponent>

        <Card style={{ marginTop: '1rem' }}>
          <div className="create-filter">
            <div>
              <Button
                type="primary"
                onClick={() => this.createOrUpdateModalOpen({ id: '' })}
              >
                Create new server
              </Button>
              <ProtectedComponent requiredPermission="data:import">
                <ImportButton serverStore={this.props.serverStore}
                              authenticationStore={this.props.authenticationStore} />
              </ProtectedComponent>
            </div>
            <Search style={{ width: '400px' }} placeholder="input search text" enterButton="Search" size="middle"
                    onSearch={this.handleSearch} />
          </div>
          <ResultTable filterString={this.state.filterString} serverStore={this.props.serverStore}
                       authenticationStore={this.props.authenticationStore}
                       createOrUpdateModalOpen={this.createOrUpdateModalOpen} />
        </Card>
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
