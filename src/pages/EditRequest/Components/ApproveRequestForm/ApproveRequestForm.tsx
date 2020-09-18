import React, { Component } from 'react';
import { Input, Form, Button, Row, Col, message } from 'antd';
//import { EditOutlined } from '@ant-design/icons';
import { inject, observer } from 'mobx-react';
import { FormInstance } from 'antd/lib/form';
import Stores from '../../../../stores/storeIdentifier';
import RequestStore from '../../../../stores/requestStore';
//import { stores } from '../../../../stores/storeInitializer';
import AuthenticationStore from '../../../../stores/authenticationStore';
import HistoryLogStore from '../../../../stores/historyLogStore';

//import { ApproveRequestInput } from '../../../../services/request/dto/ApproveRequestInput';


interface RequestsProps {
  authenticationStore: AuthenticationStore;
  requestStore: RequestStore;
  requestId: string,
  IsApproved: boolean;
  IsClosed: boolean;
  historyLogStore?: HistoryLogStore;
}

interface RequestStates {
  loading: boolean;
  //_requestData: any;
  //formRef: any;
}

@inject(Stores.RequestStore, Stores.AuthenticationStore, Stores.HistoryLogStore)
@observer
export default class ApproveRequestForm extends Component<RequestsProps,RequestStates> {
  formRef = React.createRef<FormInstance>();
  constructor(props: any){
    super(props);
    this.state = {
      loading: false,
    };
    this.onApprove=this.onApprove.bind(this);
    this.onDecline=this.onDecline.bind(this);
    this.onCancel=this.onCancel.bind(this);
  }


  
  onApprove = () => {
    this.formRef.current
      ?.validateFields()
      .then(async (values: any) => {
        
        let valuesUpdate: any = {
          answer: ({...values}.answer != undefined)?{...values}.answer:'The request has been accepted',
          userId: this.props.authenticationStore.user?.id,
          status: "Open",
          requestId: this.props.requestId
        };
        
        await this.props.requestStore.manage(valuesUpdate)
        await this.props.requestStore.updateAcceptDecline("Open",/*{ ...this.props.requestStore.editRequest }.updatedBy*/ "John the Admin - john@admin.com",new Date().toLocaleString())
        await this.props.historyLogStore?.getLogOfRequest(this.props.requestId)
        message.info("Approve Request Successfully");
      })
  }



  onCancel() {
    this.formRef.current
      ?.validateFields()
      .then((values: any) => {
        
        let valuesUpdate: any = {
          answer: ({...values}.answer != undefined)?{...values}.answer:'The request has been canceled',

          userId: this.props.authenticationStore.user?.id,
          status: "Closed",
          requestId: this.props.requestId
        };
        
        this.props.requestStore.manage(valuesUpdate)
        this.props.requestStore.updateAcceptDecline("Closed",/*{ ...this.props.requestStore.editRequest }.updatedBy*/ "John the Admin - john@admin.com",new Date().toLocaleString())
        this.props.historyLogStore?.getLogOfRequest(this.props.requestId)
        message.info("Cancel Request Successfully");
      })
  }
  onDecline() {
    this.formRef.current
      ?.validateFields()
      .then((values: any) => {
        
        let valuesUpdate: any = {
          answer: ({...values}.answer != undefined)?{...values}.answer:'The request has been declined',

          userId: this.props.authenticationStore.user?.id,
          status: "Closed",
          requestId: this.props.requestId
        };
        
        this.props.requestStore.manage(valuesUpdate)
        this.props.requestStore.updateAcceptDecline("Closed",/*{ ...this.props.requestStore.editRequest }.updatedBy*/ "John the Admin - john@admin.com",new Date().toLocaleString())
        this.props.historyLogStore?.getLogOfRequest(this.props.requestId)
        message.info("Decline Request Successfully");
      })
  }

  

  render() {
    return (
      <>
        <Form ref= {this.formRef}>
          <Form.Item name="answer">
            {/* <EditOutlined /> <span>Write some response for the requestor</span> */}
            <Input.TextArea autoSize={{ minRows: 3, maxRows: 5 }} placeholder="Type response..." disabled={this.props.IsClosed} style={{ marginTop: 8 }} />
          </Form.Item>
          <Row>
            {!this.props.IsApproved && !this.props.IsClosed ? (
              <Col span={4}>
                <Form.Item>
                  <Button onClick={this.onApprove}>
                    {/* New -> open */}
                    Approve Request
                  </Button>
                  <Button onClick={this.onDecline}>
                    {/* New -> close */}
                    Decline Request
                  </Button>
                </Form.Item>
              </Col>
            ) : !this.props.IsClosed ? (
              <Col span={4}>
                <Form.Item>
                  <Button type="link" onClick={this.onCancel}>
                    {/* Open -> close */}
                    Cancel Request
                  </Button>
                </Form.Item>
              </Col>
            ) : (
              <Col span={4}>
                <Form.Item>
                  <Button type="ghost" disabled>
                    Request is Closed
                  </Button>
                </Form.Item>
              </Col>
            )}
          </Row>
          
        </Form>

        
      </>
    );
  }
}
