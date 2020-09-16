import React, { Component } from "react";
import { Col, Card, Row } from "antd";
import ApproveRequestForm from "./Components/ApproveRequestForm/ApproveRequestForm";
import LogBox from "./Components/LogBox/LogBox";
import ConversationBox from "./Components/ConversationBox/ConversationBox";
import Stores from '../../stores/storeIdentifier';
import RequestStore from '../../stores/requestStore';
import { inject, observer } from 'mobx-react';
import { FormInstance } from 'antd/lib/form';
//import qs from 'qs';

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
  location: any;
}

interface IRequestStates {
  requests: IRequests[];
  loading: boolean;
}

@inject(Stores.RequestStore)
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
    console.log(id)
    this.props.requestStore.get(id)
    
  }

  render(){ 
    let data = {...this.props.requestStore.editRequest}.status
    console.log(data)
    return (
      <>
        <h2>Request Detail</h2>
        <Row gutter={[16, 16]}>
          <Col span={12}>
              <Card
                title="Response"
                bordered={true}
                headStyle={{ backgroundColor: "#52c41a", color: "white" }}
                bodyStyle={{ border: "1px solid #3f6600"}}
                style = {{ marginBottom: 10}}
              >
                <ApproveRequestForm
                  requestStore = {this.props.requestStore}
                  requestId = {this.props.match.params.id}
                  IsApproved = {({...this.props.requestStore.editRequest}.status == 'Open')?true:false}
                  IsClosed = {({...this.props.requestStore.editRequest}.status == 'Closed')?true:false}
                />
              </Card>

            <Card
              title="Update Detail"
              bordered={true}
              headStyle={{ backgroundColor: "#52c41a", color: "white" }}
              bodyStyle={{ border: "1px solid #3f6600" }}
            >
              <Row>
                <Col span={6} >
                  <strong>Status: </strong>
                </Col>
                <Col>
                {{...this.props.requestStore.editRequest}.status}
                </Col>
              </Row>
              <Row>
              <Col span={6} >
                  <strong>Created Date: </strong>
                </Col>
                <Col>
                {{...this.props.requestStore.editRequest}.createdDate}
                </Col>
              </Row>
              <Row>
              <Col span={6} >
                  <strong>Created By: </strong>
                </Col>
                <Col>
                {{...this.props.requestStore.editRequest}.createdBy}
                </Col>
              </Row>
              <Row>
              <Col span={6} >
                  <strong>Update By </strong>
                </Col>
                <Col>
                {{...this.props.requestStore.editRequest}.updatedBy}
                </Col>
              </Row>
              <Row>
              <Col span={6} >
                  <strong>Update Date </strong>
                </Col>
                <Col>
                {{...this.props.requestStore.editRequest}.updatedDate}
                </Col>
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
            <span>Conversation Box</span>
            <ConversationBox />
            <span>Log Box</span>
            <LogBox />
          </Col>
        </Row>
      </>
    );
  }
}

