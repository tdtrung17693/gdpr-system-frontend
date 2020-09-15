import './index.less';

import * as React from 'react';

import { Button, Card, Form, Col, Input, Row, Avatar } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { inject, observer } from 'mobx-react';

import AccountStore from '../../stores/accountStore';
import AuthenticationStore from '../../stores/authenticationStore';
import { FormComponentProps } from '@ant-design/compatible/lib/form';
import { Redirect } from 'react-router-dom';
import SessionStore from '../../stores/sessionStore';
import Stores from '../../stores/storeIdentifier';
import rules from './index.validation';

import GdprLogo from '../../images/gdpr.svg';

const FormItem = Form.Item;

export interface ILoginProps extends FormComponentProps {
  authenticationStore?: AuthenticationStore;
  sessionStore?: SessionStore;
  accountStore?: AccountStore;
  history: any;
  location: any;
}

@inject(Stores.AuthenticationStore, Stores.SessionStore, Stores.AccountStore)
@observer
class Login extends React.Component<ILoginProps> {
  state = {
    isLoggingIn: false
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

  public render() {
    let { from } = this.props.location.state || { from: { pathname: '/' } };
    if (this.props.authenticationStore!.isAuthenticated) return <Redirect to={from} />;

    // const { loginModel } = this.props.authenticationStore!;
    return (
      <>
        <Col className="name">
          <Row justify="center" >
            <Avatar  shape="square" style={{ display: "block", height: 80, width: 80, margin: "1rem" }} src={GdprLogo} />
          </Row>
          <Form className="" onFinish={this.onFinish}>
            <Row style={{ marginTop: 10 }}>
              <Col span={8} offset={8}>
                <Card>
                  <div style={{ textAlign: 'center' }}>
                    <h3>Log In</h3>
                  </div>
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
                    <Col span={12} offset={0}>
                      {/* <Checkbox checked={loginModel.rememberMe} onChange={loginModel.toggleRememberMe} style={{ paddingRight: 8 }} />
                    {L('RememberMe')}
                    <br /> */}
                      <button>Forgot Password</button>
                    </Col>

                    <Col style={{ textAlign: "right" }} span={8} offset={4}>
                      <Button style={{}} htmlType={'submit'} type="primary" loading={this.state.isLoggingIn}>
                        Log In
                      </Button>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>

          </Form>
        </Col>
      </>
    );
  }
}

export default Login;
