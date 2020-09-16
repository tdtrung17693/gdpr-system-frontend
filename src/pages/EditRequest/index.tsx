import React, { Component } from "react";
import { Col, Card, Row } from "antd";
import ApproveRequestForm from "./Components/ApproveRequestForm/ApproveRequestForm";
import LogBox from "./Components/LogBox/LogBox";
import ConversationBox from "./Components/ConversationBox/ConversationBox";
import Stores from '../../stores/storeIdentifier';
import RequestStore from '../../stores/requestStore';
import { inject, observer } from 'mobx-react';
import { FormInstance } from 'antd/lib/form';

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
    const curId = this.props.requestStore.currentId;
    this.props.requestStore.get(curId);
    console.log(this.props.requestStore.currentId)
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
                headStyle={{ backgroundColor: "#52c41a", color: "white" }}
                bodyStyle={{ border: "1px solid #3f6600"}}
                style = {{ marginBottom: 10}}
              >
                <ApproveRequestForm
                  // requestId = '123456'
                  IsApproved = {false}
                  IsClosed = {false}
                />
              </Card>

            <Card
              title="Update Detail"
              bordered={true}
              headStyle={{ backgroundColor: "#52c41a", color: "white" }}
              bodyStyle={{ border: "1px solid #3f6600" }}
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

