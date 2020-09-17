<<<<<<< HEAD
﻿import React, { Component } from "react";
import qs from 'qs';
import { Col, Card, Row } from "antd";
import LogBox from "./Components/LogBox/LogBox";
=======
﻿import React, { Component } from 'react';
import { Col, Card, Row, Button, Form, Input, Tag, Collapse, message, Select, DatePicker } from 'antd';
import qs from 'qs';
import LogBox from './Components/LogBox/LogBox';
>>>>>>> 54a026c81a6f01c94fa269495c43d846ef36625d
import Stores from '../../stores/storeIdentifier';
import { inject, observer } from 'mobx-react';
//import { FormInstance } from 'antd/lib/form';
import HandleModal from '../Requests/Components/CreateModal/HandleModal';
import { Store } from 'antd/lib/form/interface';
//import { GetRequestOutput } from '../../../../services/request/dto/getRequestOutput';
import { CreateRequestInput } from '../../services/request/dto/createRequestInput';
//import qs from 'qs';
import RequestStore from '../../stores/requestStore';
import NotificationStore from '../../stores/notificationStore';
import CommentBox from './Components/CommentBox';
import AuthenticationStore from '../../stores/authenticationStore';
import ApproveRequestForm from './Components/ApproveRequestForm/ApproveRequestForm';

import './index.less';
import { FormInstance } from 'antd/lib/form';
<<<<<<< HEAD
import RequestStore from '../../stores/requestStore';
import NotificationStore from '../../stores/notificationStore';
import CommentBox from './Components/CommentBox';
import AuthenticationStore from '../../stores/authenticationStore';
import ApproveRequestForm from "./Components/ApproveRequestForm/ApproveRequestForm";

import './index.less'
=======
import moment from 'moment';
>>>>>>> 54a026c81a6f01c94fa269495c43d846ef36625d

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
<<<<<<< HEAD
  match: {params: any};
  notificationStore: NotificationStore;
  authenticationStore: AuthenticationStore;
  location: any;
=======
  match: { params: any };
  notificationStore: NotificationStore;
  authenticationStore: AuthenticationStore;
  location: any;
  onSave: (user: CreateRequestInput | null, errors: any) => void;
>>>>>>> 54a026c81a6f01c94fa269495c43d846ef36625d
}

interface IRequestStates {
  modalVisible: boolean;
  requests: IRequests[];
  loading: boolean;
}

@inject(Stores.RequestStore, Stores.NotificationStore, Stores.AuthenticationStore)
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
    };
  }

  componentDidMount() {
<<<<<<< HEAD
    const {id} = this.props.match.params;
    this.props.requestStore.get(id);
    console.log(this.props.requestStore.currentId)
    let notificationId = qs.parse(this.props.location.search, { ignoreQueryPrefix: true })._fromNotification;
    
    if (notificationId && notificationId != "") {
=======
    const { id } = this.props.match.params;
    console.log(id);
    this.getServer();
    this.props.requestStore.get(id);
    let notificationId = qs.parse(this.props.location.search, { ignoreQueryPrefix: true })._fromNotification;

    if (notificationId && notificationId != '') {
>>>>>>> 54a026c81a6f01c94fa269495c43d846ef36625d
      this.props.notificationStore?.markAsRead(String(notificationId));
    }
  }

<<<<<<< HEAD
  componentDidUpdate(prevProps: any) {
    const {match: {params}} = this.props
    const {id} = params;
    if (id === prevProps.match.params.id) return;

    let notificationId = qs.parse(this.props.location.search, { ignoreQueryPrefix: true })._fromNotification;
    if (notificationId && notificationId != "") {
      this.props.notificationStore?.markAsRead(String(notificationId));
    }
=======
  async getServer() {
    await this.props.requestStore.getServerList();
>>>>>>> 54a026c81a6f01c94fa269495c43d846ef36625d
  }

  componentDidUpdate(prevProps: any) {
    const {
      match: { params },
    } = this.props;
    const { id } = params;
    if (id === prevProps.match.params.id) return;

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
  handleSave = async (request: CreateRequestInput | null, validatingErrors: Store) => {
    if (request) {
      console.log(request);
      request = {
        ...request,
      };
      await this.props.requestStore.update(this.props.match.params, request);
      this.toggleModal(async () => {
        await this.props.requestStore.getAll();
      });
    }
  };

  handleUpdateClick = () => {
    this.formRef.current
      ?.validateFields()
      .then((values: any) => {
        console.log(values);
        if (!(values.title) && !(values.startDate) && !(values.startDate) && !(values.serverId) && !(values.description)){message.info("No information changed !"); return;}
        let valuesUpdate: any = {
          ...values,

          updatedBy: this.props.authenticationStore.user?.id,  
          title: (values.title)?(values.title):{ ...this.props.requestStore.editRequest }.title,
          startDate: (values.startDate)?(values.startDate.format('YYYY-MM-DD HH:mm:ss')):{ ...this.props.requestStore.editRequest }.startDate,
          endDate: (values.startDate)?(values.endDate.format('YYYY-MM-DD HH:mm:ss')):{ ...this.props.requestStore.editRequest }.endDate,
          serverId: (values.serverId)?(values.serverId):{ ...this.props.requestStore.editRequest }.serverId,
          description: (values.description) ? values.description :({ ...this.props.requestStore.editRequest }.description ? { ...this.props.requestStore.editRequest }.description : ''),
        };
        console.log(valuesUpdate);
          if (valuesUpdate.startDate > valuesUpdate.endDate) {message.info("Update fail. StartDate must before EndDate")}
          else{
          this.props.requestStore.update({ ...this.props.requestStore.editRequest }.id,valuesUpdate)
          
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
    let data = { ...this.props.requestStore.editRequest }.status;
    console.log(data);
    let requestStatus = { ...this.props.requestStore.editRequest }.status;
    let isClosed = (requestStatus==='Closed')? true: false;
    return (
      <>
        <h2>Request Detail</h2>
        <Row gutter={[16, 16]}>
          <Col span={12}>
<<<<<<< HEAD
              <Card
                title="Response"
                bordered={true}
                headStyle={{ backgroundColor: "#1a5792", color: "white" }}
                style = {{ marginBottom: 10}}
              >
                <ApproveRequestForm
                  // requestId = '123456'
                  IsApproved = {true}
                  IsClosed = {true}
                />
              </Card>

            <Card
              title="Update Detail"
              bordered={true}
              headStyle={{ backgroundColor: "#1a5792", color: "white" }}
            >
              <Row>
                <p>
                  <strong>Status: </strong>
                  {"Open"}
                </p>
              </Row>
              <Row>
                <p>
                  <strong>Created Date: </strong>
                  {new Date().toString()}
                </p>
              </Row>
              <Row>
                <p>
                  <strong>Created By: </strong>
                  {"requestDetail.CreatedBy"}
                </p>
              </Row>
              <Row>
                <p>
                  <strong>Updated Date: </strong>
                  {"requestDetail.UpdatedDate"}
                    {/* //? new Date(requestDetail.UpdatedDate).toString()
                    //: """} */}
                </p>
              </Row>
              <Row>
                <p>
                  <strong>Update By: </strong>
                  {"requestDetail.UpdatedBy"}
                </p>
              </Row>
              {/* <RequestForm
                request={requestDetail}
                type="update"
                disable={
                  requestDetail.OwnerId !== userId ||
                  requestDetail.IsApproved ||
                  requestDetail.IsClosed
                }
              /> */}
=======
            <Card title="Response" bordered={true} headStyle={{ backgroundColor: '#1a5792', color: 'white' }} style={{ marginBottom: 10 }}>
              <ApproveRequestForm
                authenticationStore={this.props.authenticationStore}
                requestStore={this.props.requestStore}
                requestId={this.props.match.params.id}
                IsApproved={{ ...this.props.requestStore.editRequest }.status == 'Open' ? true : false}
                IsClosed={{ ...this.props.requestStore.editRequest }.status == 'Closed' ? true : false}
              />
>>>>>>> 54a026c81a6f01c94fa269495c43d846ef36625d
            </Card>

            <Card title="Update Detail" bordered={true} headStyle={{ backgroundColor: '#1a5792', color: 'white' }}>
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
                  <Col>{{ ...this.props.requestStore.editRequest }.createdDate}</Col>
                </Row>
                <Row>
                  <Col span={6}>
                    <strong>Created By: </strong>
                  </Col>
                  <Col>{{ ...this.props.requestStore.editRequest }.createdBy}</Col>
                </Row>
                <Row>
                  <Col span={6}>
                    <strong>Update By </strong>
                  </Col>
                  <Col>{{ ...this.props.requestStore.editRequest }.updatedBy}</Col>
                </Row>
                <Row>
                  <Col span={6}>
                    <strong>Update Date </strong>
                  </Col>
                  <Col>{{ ...this.props.requestStore.editRequest }.updatedDate}</Col>
                </Row>
              </Form>
              <Collapse defaultActiveKey={['1']}>
                <Collapse.Panel header="Update Request" key="0">
                  <Form {...this.layout} ref={this.formRef}>
                    <Form.Item name={'title'} label="Title">
                    <Input disabled={isClosed} defaultValue={{ ...this.props.requestStore.editRequest }.title} />
                    </Form.Item>
                    <Form.Item name={'startDate'} label="From Date" >
                    <DatePicker  disabled={isClosed} showTime format="YYYY-MM-DD HH:mm:ss" defaultValue={moment(new Date({ ...this.props.requestStore.editRequest }.startDate))} />
                    </Form.Item>
                    <Form.Item name={'endDate'} label="To Date">
                    <DatePicker  disabled={isClosed} showTime format="YYYY-MM-DD HH:mm:ss" defaultValue={moment(new Date({ ...this.props.requestStore.editRequest }.endDate))} />
                    </Form.Item>
                    <Form.Item name={'serverId'} label="Server">
                      <Select
                        showSearch
                        //style={{ width: 315 }}
                        placeholder="Select a server"
                        optionFilterProp="children"
                        defaultValue={{ ...this.props.requestStore.editRequest }.serverName + ' - ' + { ...this.props.requestStore.editRequest }.serverIP}
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
                      <Input disabled={isClosed} defaultValue={{ ...this.props.requestStore.editRequest }.description} />
                    </Form.Item>
                    <Form.Item >
                    <Button
                    disabled={isClosed}
                    type="primary"
                    onClick={() => {
                      this.handleUpdateClick();
                    }}
                  >
                    Update
                  </Button>
                  </Form.Item>
                  </Form>
                  
                </Collapse.Panel>
              </Collapse>
            </Card>
            {/* <HandleModal
              ref={this.modalRef}
              visible={this.state.modalVisible}
              onCancel={() =>
                this.setState({
                  modalVisible: false,
                })
              }
              modalType={'create'}
              onSave={this.handleSave}
              {...this.props}
            /> */}
          </Col>

          <Col span={12}>
<<<<<<< HEAD
              <CommentBox authenticationStore = {this.props.authenticationStore}  requestId={this.props.match.params.id.toLowerCase()}/>
=======
            <CommentBox authenticationStore={this.props.authenticationStore} requestId={this.props.match.params.id.toLowerCase()} />
>>>>>>> 54a026c81a6f01c94fa269495c43d846ef36625d
            <span>Log Box</span>
            <LogBox />
          </Col>
        </Row>
      </>
    );
  }
}
