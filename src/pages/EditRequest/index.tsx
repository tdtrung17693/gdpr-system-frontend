import React, { Component } from "react";
import qs from 'qs';
import { Col, Card, Row } from "antd";
import LogBox from "./Components/LogBox/LogBox";
import Stores from '../../stores/storeIdentifier';
import { inject, observer } from 'mobx-react';
import { FormInstance } from 'antd/lib/form';
import RequestStore from '../../stores/requestStore';
import NotificationStore from '../../stores/notificationStore';
import CommentBox from './Components/CommentBox';
import AuthenticationStore from '../../stores/authenticationStore';
import ApproveRequestForm from "./Components/ApproveRequestForm/ApproveRequestForm";

import './index.less'
import HistoryLogStore from '../../stores/historyLogStore';

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
interface IRequestProps {
  requestStore: RequestStore;
  match: {params: any};
  notificationStore: NotificationStore;
  authenticationStore: AuthenticationStore;
  historyLogStore: HistoryLogStore;
  location: any;
}

interface IRequestStates {
  requests: IRequests[];
  loading: boolean;
}

@inject(Stores.RequestStore, Stores.NotificationStore, Stores.AuthenticationStore, Stores.HistoryLogStore)
@observer
export default class EditRequest extends Component<IRequestProps, IRequestStates> {
  modalRef = React.createRef<FormInstance>();
  constructor(props: any) {
    super(props);
    this.state = {
      requests: [],
      loading: false,
    };
  }

  componentDidMount() {
    const {id} = this.props.match.params;
    this.props.requestStore.get(id);
    console.log(this.props.requestStore.currentId)
    let notificationId = qs.parse(this.props.location.search, { ignoreQueryPrefix: true })._fromNotification;
    
    if (notificationId && notificationId != "") {
      this.props.notificationStore?.markAsRead(String(notificationId));
    }
  }

  componentDidUpdate(prevProps: any) {
    const {match: {params}} = this.props
    const {id} = params;
    if (id === prevProps.match.params.id) return;

    let notificationId = qs.parse(this.props.location.search, { ignoreQueryPrefix: true })._fromNotification;
    if (notificationId && notificationId != "") {
      this.props.notificationStore?.markAsRead(String(notificationId));
    }
  }

  render(){ 
    return (
      <>
        <h2>Request #2</h2>
        <Row gutter={[16, 16]}>
          <Col span={12}>
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
            </Card>
          </Col>
          <Col span={12}>
            <CommentBox authenticationStore = {this.props.authenticationStore}  requestId={this.props.match.params.id.toLowerCase()}/>
            <LogBox requestId = {this.props.match.params.id} historyLogStore = {this.props.historyLogStore} />
          </Col>
        </Row>
      </>
    );
  }
}

