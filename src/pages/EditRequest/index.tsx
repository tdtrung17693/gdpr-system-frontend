import React, { Component } from "react";
import qs from 'qs';
import { Col, Card, Row, Button, Form, Input, Tag, Collapse, message, Select, DatePicker, Spin } from 'antd';
import LogBox from "./Components/LogBox/LogBox";
import Stores from '../../stores/storeIdentifier';
import { inject, observer } from 'mobx-react';
import HandleModal from '../Requests/Components/CreateModal/HandleModal';
//import { Store } from 'antd/lib/form/interface';
import { CreateRequestInput } from '../../services/request/dto/createRequestInput';
import RequestStore from '../../stores/requestStore';
import NotificationStore from '../../stores/notificationStore';
import CommentBox from './Components/CommentBox';
import AuthenticationStore from '../../stores/authenticationStore';
import ApproveRequestForm from './Components/ApproveRequestForm/ApproveRequestForm';

import './index.less';
import { FormInstance } from 'antd/lib/form';
import moment from 'moment';
import HistoryLogStore from '../../stores/historyLogStore';
import Text from 'antd/lib/typography/Text';

interface IRequests {
  key: string;
  id: string;
  status: string;
  createdDate: string;
  createdBy: string;
  updatedDate: string;
  serverName: string;
  serverIP: string;
  title: string;
  startDate: string;
  endDate: string;
  index: number;
}
interface IRequestProps {
  requestStore: RequestStore;
  match: { params: any };
  notificationStore: NotificationStore;
  authenticationStore: AuthenticationStore;
  historyLogStore: HistoryLogStore;
  location: any;
  isEmployee: boolean;
  onSave: (user: CreateRequestInput | null, errors: any) => void;
}

interface IRequestStates {
  modalVisible: boolean;
  requests: IRequests[];
  loading: boolean;
  status: string;
}

@inject(Stores.RequestStore, Stores.NotificationStore, Stores.AuthenticationStore, Stores.HistoryLogStore)
@observer
export default class EditRequest extends Component<IRequestProps, IRequestStates> {
  modalRef = React.createRef<HandleModal>();
  formRef = React.createRef<FormInstance>();
  constructor(props: any) {
    super(props);
    this.state = {
      modalVisible: false,
      requests: [],
      loading: false,
      status: '',
    };
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    
    this.getServer();
    this.props.requestStore.get(id);
    let notificationId = qs.parse(this.props.location.search, { ignoreQueryPrefix: true })._fromNotification;

    if (notificationId && notificationId != '') {
      this.props.notificationStore?.markAsRead(String(notificationId));
    }
  }

  async getServer() {
    await this.props.requestStore.getServerList();
  }

  componentDidUpdate(prevProps: any) {
    const {
      match: { params },
    } = this.props;
    const { id } = params;  
    if (id === prevProps.match.params.id) return;

    this.getServer()
    this.props.requestStore.get(id);

    let notificationId = qs.parse(this.props.location.search, { ignoreQueryPrefix: true })._fromNotification;
    if (notificationId && notificationId != '') {
      this.props.notificationStore?.markAsRead(String(notificationId));
    }
  }

  //Modal
  async handleModalOpen(params: any) {
    await this.props.requestStore.createRequest();

    this.toggleModal(() => {
      this.modalRef.current?.setFieldsValues(this.props.requestStore.editRequest);
    });
  }
  toggleModal = (cb: Function = () => {}) => {
    this.setState({ modalVisible: !this.state.modalVisible }, () => {
      cb();
    });
  };
  

  handleUpdateClick = () => {
    this.formRef.current
      ?.validateFields()
      .then((values: any) => {
        
        if (!(values.title) && !(values.startDate) && !(values.endDate) && !(values.serverId) && !(values.description)){message.info("No information changed !"); return;}
        
        let valuesUpdate: any = {
          ...values,

          updatedBy: this.props.authenticationStore.user?.id,  
          title: (values.title)?(values.title):{ ...this.props.requestStore.editRequest }.title,
          startDate: (values.startDate)?moment((values.startDate.format('YYYY-MM-DD HH:mm:ss'))):moment({ ...this.props.requestStore.editRequest }.startDate),
          endDate: (values.endDate)?moment((values.endDate.format('YYYY-MM-DD HH:mm:ss'))):moment({ ...this.props.requestStore.editRequest }.endDate),
          serverId: (values.serverId)?(values.serverId):{ ...this.props.requestStore.editRequest }.serverId,
          description: (values.description) ? values.description :({ ...this.props.requestStore.editRequest }.description ? { ...this.props.requestStore.editRequest }.description : ''),
        };
        console.log(moment(valuesUpdate.startDate));
            console.log(moment(valuesUpdate.endDate));
            console.log(valuesUpdate)
          if (moment(valuesUpdate.startDate) > moment(valuesUpdate.endDate)) 
          {
            message.info("Update fail. StartDate must before EndDate"); 
            
          }
          else{
          this.props.requestStore.update({ ...this.props.requestStore.editRequest }.Id,valuesUpdate)
          this.props.requestStore.updateData({ ...this.props.requestStore.editRequest }.status,
            this.props.authenticationStore.user?.firstName + ' ' + this.props.authenticationStore.user?.lastName,
            new Date().toLocaleString(),
            (values.title)?(values.title):{ ...this.props.requestStore.editRequest }.title,
            (values.startDate)?(values.startDate.format('YYYY-MM-DD HH:mm:ss')):{ ...this.props.requestStore.editRequest }.startDate,
            (values.endDate)?(values.endDate.format('YYYY-MM-DD HH:mm:ss')):{ ...this.props.requestStore.editRequest }.endDate,
            (values.serverId)?(values.serverId):{ ...this.props.requestStore.editRequest }.serverId,
            (values.description) ? values.description :({ ...this.props.requestStore.editRequest }.description ? { ...this.props.requestStore.editRequest }.description : ''
            ))
          
          message.info("Update successfully");
      }});
      this.setState({ loading: true });
      setTimeout(() => {
        this.setState({ loading: false });
      }, 500);
  };

  layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 15 },
  };

  render() {
    const isEmployee = ({ ...this.props.requestStore.editRequest }.RoleName == 'Employee')
    const { editRequest } = this.props.requestStore!;

    if (!editRequest) return (<div className="loading-screen">
      <Spin size="large" style={{transform: 'scale(2)'}}/>
      <div><Text type="secondary" className="blinking-text">Loading...</Text></div>
    </div>);

    let requestStatus = editRequest?.status;
    let isClosed = (requestStatus==='Closed')? true: false;
    return (
      <>
        <h2>Request Detail</h2>
        <Row gutter={[16, 16]}>
          <Col span={12}>
          {(isEmployee==false)?
            <Card title="Response" bordered={true} headStyle={{ backgroundColor: '#1a5792', color: 'white' }} style={{ marginBottom: 10 }}>
              
                <ApproveRequestForm
                authenticationStore={this.props.authenticationStore}
                historyLogStore={this.props.historyLogStore}
                requestStore={this.props.requestStore}
                requestId={this.props.match.params.id}
                IsApproved={editRequest.status == 'Open'}
                IsClosed={editRequest.status == 'Closed'}
              />
            </Card>: null}

            <Card title="Request Detail" bordered={true} headStyle={{ backgroundColor: '#1a5792', color: 'white' }} style={{marginTop: '1rem'}}>
              <Form style={{ marginBottom: 17 }}>
                <Row>
                  <Col span={6}>
                    <strong>Status: </strong>
                  </Col>
                  <Col>
                    <Tag color={requestStatus === 'New' ? 'blue' : requestStatus === 'Open' ? 'green' : 'red'} key={requestStatus}>
                      {requestStatus}
                    </Tag>
                  </Col>
                </Row>
                <Row>
                  <Col span={6}>
                    <strong>Created Date: </strong>
                  </Col>
                  <Col>{moment(editRequest.createdDate).format('DD-MM-YYYY HH:mm')}</Col>
                </Row>
                {!isEmployee ? (<Row>
                  <Col span={6}>
                    <strong>Created By: </strong>
                  </Col>
                  <Col>{editRequest.createdBy}</Col>
                </Row>):null}
                {isEmployee == false ? 
                (<Row>
                  <Col span={6}>
                    <strong>Updated By </strong>
                  </Col>
                  <Col>{editRequest.updatedBy}</Col>
                </Row>) : null}
                <Row>
                  <Col span={6}>
                    <strong>Updated Date </strong>
                  </Col>
                  <Col>{(editRequest.updatedDate)?moment(editRequest.updatedDate).format('DD-MM-YYYY HH:mm:ss'):'-'}</Col>
                </Row>
              </Form>
              <Collapse defaultActiveKey={['1']}>
                <Collapse.Panel header="Updatable Request Detail" key="0">
                  <Form {...this.layout} ref={this.formRef}  >
                    <Form.Item name={'title'} label="Title">
                    <Input disabled={isClosed} defaultValue={editRequest.title} />
                    </Form.Item>
                    <Form.Item name={'startDate'} label="From Date" >
                    <DatePicker  disabled={isClosed} showTime format="DD-MM-YYYY HH:mm:ss" defaultValue={moment(new Date(editRequest.startDate))}></DatePicker>
                    </Form.Item>
                    <Form.Item name={'endDate'} label="To Date">
                    <DatePicker  disabled={isClosed} showTime format="DD-MM-YYYY HH:mm:ss" defaultValue={moment(new Date(editRequest.endDate))}></DatePicker>
                    </Form.Item>
                    <Form.Item name={'serverId'} label="Server">
                      <Select
                        showSearch
                        //style={{ width: 315 }}
                        placeholder="Select a server"
                        optionFilterProp="children"
                        defaultValue={editRequest.serverName + ' - ' + editRequest.serverIP}
                        // filterOption={(input, option) =>
                        // (option!=undefined) ?  option.indexOf(input.toLowerCase()) >= 0 : true
                        // }
                        disabled={isClosed}
                        filterOption={true}
                      >
                        {this.props.requestStore.serversList != undefined
                          ? this.props.requestStore.serversList.map((server: any, i: any) => (
                              <Select.Option key={server.id} value={server.id}>
                                {server.name} - {server.ipAddress}
                              </Select.Option>
                            ))
                          : null}
                      </Select>
                    </Form.Item>
                    <Form.Item name={'description'} label="Description">
                      <Input disabled={isClosed} defaultValue={editRequest.description} />
                    </Form.Item>
                    <Form.Item >
                    {editRequest.status === 'New' ? (
                      <Button
                      style = {{marginLeft:150}}
                      disabled={isClosed}
                      type="primary"
                      onClick={() => {
                        this.handleUpdateClick();
                      }}
                    >
                      Update
                    </Button>
                          ) : null}
                    
                  </Form.Item>
                  </Form>
                  
                </Collapse.Panel>
              </Collapse>
            </Card>
            
          </Col>

          <Col span={12}>
            <CommentBox authenticationStore = {this.props.authenticationStore}  requestId={this.props.match.params.id.toLowerCase()}/>
            <div style={{marginTop: '1rem'}}>
              <LogBox requestId = {this.props.match.params.id} />
            </div>
          </Col>
        </Row>
      </>
    );
  }
}
