import './index.less';

import * as React from 'react';

import { Button, Card, Form, Checkbox, Col, Input, Row } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { inject, observer } from 'mobx-react';

import AccountStore from '../../stores/accountStore';
import AuthenticationStore from '../../stores/authenticationStore';
import { FormComponentProps } from '@ant-design/compatible/lib/form';
import { L } from '../../lib/abpUtility';
import { Redirect } from 'react-router-dom';
import SessionStore from '../../stores/sessionStore';
import Stores from '../../stores/storeIdentifier';
import rules from './index.validation';

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
  handleSubmit = async (e: any) => {
    e.preventDefault();
    const { loginModel } = this.props.authenticationStore!;
    await this.props.form.validateFields(async (err: any, values: any) => {
      if (!err) {
        await this.props.authenticationStore!.login(values);
        sessionStorage.setItem('rememberMe', loginModel.rememberMe ? '1' : '0');
        const { state } = this.props.location;
        window.location = state ? state.from.pathname : '/';
      }
    });
  };

  public render() {
    let { from } = this.props.location.state || { from: { pathname: '/' } };
    if (this.props.authenticationStore!.isAuthenticated) return <Redirect to={from} />;

    const { loginModel } = this.props.authenticationStore!;
    return (
      <Col className="name">
        <Form className="" onFinish={this.handleSubmit}>

          <Row style={{ marginTop: 10 }}>
            <Col span={8} offset={8}>
              <Card>
                <div style={{ textAlign: 'center' }}>
                  <h3>{L('WelcomeMessage')}</h3>
                </div>
                <FormItem name="userNameOrEmailAddress" rules={rules.userNameOrEmailAddress}>
                    <Input placeholder={L('UserNameOrEmail')} prefix={<UserOutlined type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} size="large" />
                </FormItem>

                <FormItem name="password" rules={rules.password }>
                    <Input
                      placeholder={L('Password')}
                      prefix={<LockOutlined type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                      type="password"
                      size="large"
                    />
                </FormItem>
                <Row style={{ margin: '0px 0px 10px 15px ' }}>
                  <Col span={12} offset={0}>
                    <Checkbox checked={loginModel.rememberMe} onChange={loginModel.toggleRememberMe} style={{ paddingRight: 8 }} />
                    {L('RememberMe')}
                    <br />
                    <button>{L('ForgotPassword')}</button>
                  </Col>

                  <Col span={8} offset={4}>
                    <Button style={{ backgroundColor: '#f5222d', color: 'white' }} htmlType={'submit'} danger>
                      {L('LogIn')}
                    </Button>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>

        </Form>
      </Col>
    );
  }
}

export default Login;
