import React from "react";
import { Input, Form, Button, Row, Col } from "antd";
import { EditOutlined } from '@ant-design/icons';

const ApproveRequestForm = (props: { IsClosed: boolean | undefined; IsApproved: any; }) => {
  const [form] = Form.useForm();
  function onApprove() {
    
  }
  function onCancel() {
    
  }
  return (
    <>
      <Form form={form}>
        <Form.Item name="Description">
        <EditOutlined /> <span >Write some response for the requestor</span>
          <Input.TextArea
            autoSize={{ minRows: 3, maxRows: 5 }}
            placeholder="Type response..."
            disabled={props.IsClosed}
            style={{marginTop: 8}}
          />
        </Form.Item>
        <Row>
          {!props.IsApproved && !props.IsClosed ? (
            <Col span={4}>
              <Form.Item>
                <Button onClick={onApprove}>
                  {/* New -> open */}
                  Approve Request
                </Button>
              </Form.Item>
            </Col>
          ) : !props.IsClosed ? (
            <Col span={4}>
              <Form.Item>
                <Button type="link" onClick={onCancel}>
                  {/* Open -> close */}
                  Cancel Request 
                </Button>
              </Form.Item>
            </Col>
          ) : (
            <Col span={4}>
              <Form.Item>
                <Button type="ghost" disabled>
                  {/* {New -> Closed} */}
                  Request is Closed
                </Button>
              </Form.Item>
            </Col>
          )}
        </Row>
      </Form>
    </>
  );
};

export default ApproveRequestForm;
