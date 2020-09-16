import React, { Component } from "react";
import { Col, Card, Row, Button } from "antd";
import ApproveRequestForm from "./Components/ApproveRequestForm/ApproveRequestForm";
import LogBox from "./Components/LogBox/LogBox";
import ConversationBox from "./Components/ConversationBox/ConversationBox";
import Stores from '../../stores/storeIdentifier';
import RequestStore from '../../stores/requestStore';
import { inject, observer } from 'mobx-react';
//import { FormInstance } from 'antd/lib/form';
import HandleModal from '../Requests/Components/CreateModal/HandleModal';
import { Store } from 'antd/lib/form/interface';
//import { GetRequestOutput } from '../../../../services/request/dto/getRequestOutput';
import { CreateRequestInput } from '../../services/request/dto/createRequestInput';
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
  modalVisible: boolean;
  requests: IRequests[];
  loading: boolean;
}

@inject(Stores.RequestStore)
@observer
export default class EditRequest extends Component<IRequestProps, IRequestStates> {
  modalRef = React.createRef<HandleModal>();
  constructor(props: any) {
    super(props);
    this.state = {
      modalVisible: false,
      requests: [],
      loading: false,
    };
  }

  componentDidMount() {
    const {id} = this.props.match.params;
    console.log(id)
    this.props.requestStore.get(id)
    
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
      console.log(request)
      request = {
        ...request
      }
      await this.props.requestStore.update(this.props.match.params, request);
      this.toggleModal(async () => {
        await this.props.requestStore.getAll();
      });
    }
  };

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
              <Row>
              <Button
              size="small"
              // style={{ display: 'inline-block', verticalAlign: 'middle' }}
              type="primary"
              onClick={() => this.handleModalOpen({ id: '' })}
            >
              Update
            </Button>
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
            <HandleModal
          ref={this.modalRef}
          visible={this.state.modalVisible}
          onCancel={() =>
            this.setState({
              modalVisible: false,
            })
          }
          modalType={ 'create'}
          onSave={this.handleSave}
          {...this.props}
        />
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

