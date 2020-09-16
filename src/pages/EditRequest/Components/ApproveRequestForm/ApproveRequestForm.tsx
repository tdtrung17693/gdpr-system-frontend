import React, { Component } from 'react';
import { Input, Form, Button, Row, Col, message } from 'antd';
//import { EditOutlined } from '@ant-design/icons';
import { inject, observer } from 'mobx-react';
import { FormInstance } from 'antd/lib/form';
import Stores from '../../../../stores/storeIdentifier';
import RequestStore from '../../../../stores/requestStore';

//import { ApproveRequestInput } from '../../../../services/request/dto/ApproveRequestInput';


interface RequestsProps {
  requestStore: RequestStore;
  requestId: string,
  IsApproved: boolean;
  IsClosed: boolean;
}

interface RequestStates {
  loading: boolean;
  //_requestData: any;
  //formRef: any;
}

@inject(Stores.RequestStore)
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
      .then((values: any) => {
        console.log(values);
        let valuesUpdate: any = {
          ...values,

          userId: "B2039BE6-AD14-4B07-A4B1-C605E293571A",
          status: "Open",
          requestId: this.props.requestId
        };
        console.log(valuesUpdate);
        this.props.requestStore.manage(valuesUpdate)
        message.info("Approve Request Successfully");
      })
  }



  onCancel() {
    this.formRef.current
      ?.validateFields()
      .then((values: any) => {
        console.log(values);
        let valuesUpdate: any = {
          ...values,

          userId: "B2039BE6-AD14-4B07-A4B1-C605E293571A",
          status: "Closed",
          requestId: this.props.requestId
        };
        console.log(valuesUpdate);
        this.props.requestStore.manage(valuesUpdate)
        message.info("Cancel Request Successfully");
      })
  }
  onDecline() {
    this.formRef.current
      ?.validateFields()
      .then((values: any) => {
        console.log(values);
        let valuesUpdate: any = {
          ...values,

          userId: "B2039BE6-AD14-4B07-A4B1-C605E293571A",
          status: "Closed",
          requestId: this.props.requestId
        };
        console.log(valuesUpdate);
        this.props.requestStore.manage(valuesUpdate)
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
