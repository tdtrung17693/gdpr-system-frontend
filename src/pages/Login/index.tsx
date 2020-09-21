import './index.less';

import * as React from 'react';

import { Button, Card, Form, Col, Input, Row, Avatar, Modal, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { inject, observer } from 'mobx-react';

import AuthenticationStore from '../../stores/authenticationStore';
import { FormComponentProps } from '@ant-design/compatible/lib/form';
import { Redirect } from 'react-router-dom';
import SessionStore from '../../stores/sessionStore';
import Stores from '../../stores/storeIdentifier';
import rules from './index.validation';

import GdprLogo from '../../images/gdpr.svg';
import { FormInstance } from 'antd/lib/form';

const FormItem = Form.Item;

export interface ILoginProps extends FormComponentProps {
  authenticationStore?: AuthenticationStore;
  sessionStore?: SessionStore;
  history: any;
  location: any;
}

@inject(Stores.AuthenticationStore, Stores.SessionStore)
@observer
class Login extends React.Component<ILoginProps> {
  formRef = React.createRef<FormInstance>()
  state = {
    isLoggingIn: false,
    modalVisible: false,
    processing: false
  }
  onFinish = async (values: any) => {
    this.setState({ isLoggingIn: true })
    const { loginModel } = this.props.authenticationStore!;

    try {
      await this.props.authenticationStore!.login(values);
      sessionStorage.setItem('rememberMe', loginModel.rememberMe ? '1' : '0');
    } catch (e) {
      this.setState({ isLoggingIn: false })
      throw e;
    }
  };

  handleResetPassword = () => {
    this.waitForProcess(async () => {
      const values = await this.formRef.current?.validateFields()

      await this.props.authenticationStore!.resetPassword(values!.email)
    }, "Your password has been successfully resetted. Please check your email for the new password.", "Your password cannot be resetted. Please check if you have input the right email.")
  }

  waitForProcess = async (processingFn: Function, successMsg: string, errorMsg: string) => {
    message.loading({ content: 'Processing...', key: 'user:process', duration: 0});
    try {
      await processingFn();
      message.success({ content: successMsg, key: 'user:process', duration: 5 });
    } catch (e) {
      message.error({ content: errorMsg, key: 'user:process', duration: 5 });
      throw e;
    }
  }

  public render() {
    let { from } = this.props.location.state || { from: { pathname: '/' } };
    if (this.props.authenticationStore!.isAuthenticated) return <Redirect to={from} />;

    // const { loginModel } = this.props.authenticationStore!;
    return (
      <>
        <Col className="login">
          <Row justify="center" >
            <Avatar  shape="square" style={{ display: "block", height: 80, width: 80, margin: "1rem" }} src={GdprLogo} />
          </Row>
          <div style={{ textAlign: 'center' }}>
            <h3>Welcome</h3>
          </div>
          <Form className="" onFinish={this.onFinish}>
            <Row style={{ marginTop: 10 }}>
              <Col xs={{span: 20}}  sm={{span: 15}} lg={{span: 10}} xl={{span: 7}} style={{margin: '0 auto'}}>
                <Card>
                  <FormItem name="username" rules={rules.username}>
                    <Input placeholder="Username..." prefix={<UserOutlined type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} size="large" />
                  </FormItem>

                  <FormItem name="password" rules={rules.password}>
                    <Input
                      placeholder="Password..."
                      prefix={<LockOutlined type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                      type="password"
                      size="large"
                    />
                  </FormItem>
                  <Row>
                    <Col xs={{span: 24}} sm={{span: 24}} className={"btn-forget-wrap"}>
                      <Button onClick={() => this.setState({modalVisible: true})} type="link" size="small">Forgot Password?</Button>
                    </Col>

                    <Col xs={{span: 24, offset:0}} sm={{span: 24}} className="btn-login-wrap" >
                      <Button size="large" block={true} htmlType={'submit'} type="primary" loading={this.state.isLoggingIn}>
                        Log In
                      </Button>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>

          </Form>
        </Col>
        <Modal
          maskClosable={false}
          transitionName="fade"
          visible={this.state.modalVisible}
          cancelText="Cancel"
          okText="Ok"
          onCancel={() => {this.setState({modalVisible: false})}}
          onOk={this.handleResetPassword}
          okButtonProps={{disabled: this.state.processing}}
          title="Reset Password">
          <Form ref={this.formRef}>
            <FormItem label="Email" name="email" rules={[{required: true, message: "Email is required."}]}>
              <Input />
            </FormItem>
            <Button htmlType="submit" type="primary">Reset My Password</Button>
          </Form>
        </Modal>
      </>
    );
  }
}

export default Login;
