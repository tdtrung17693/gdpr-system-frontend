import './index.less';

import * as React from 'react';

import { Button, Card, Checkbox, Col, Form, Icon, Input, Row } from 'antd';
import { inject, observer } from 'mobx-react';

import AccountStore from '../../stores/accountStore';
import AuthenticationStore from '../../stores/authenticationStore';
import { FormComponentProps } from 'antd/lib/form';
import { L } from '../../lib/abpUtility';
//import { Redirect } from 'react-router-dom';
import SessionStore from '../../stores/sessionStore';
import Stores from '../../stores/storeIdentifier';
import rules from './index.validation';

const FormItem = Form.Item;
declare var abp: any;

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
    this.props.history.push('./customers');
    console.log(this.props.history)
  };

  public render() {
    // let { from } = this.props.location.state || { from: { pathname: '/' } };
    // console.log({from})
    // if (this.props.authenticationStore!.isAuthenticated) return <Redirect to={from.pathname} />;
    const { loginModel } = this.props.authenticationStore!;
    const { getFieldDecorator } = this.props.form;
    return (
      <Col className="name">
        <Form className="" onSubmit={this.handleSubmit}>
          <Row>
            <Row style={{ marginTop: 100 }}>
              <Col span={8} offset={8}>
              </Col>
            </Row>
            <Row style={{ marginTop: 10 }}>
              <Col span={8} offset={8}>
                <Card>
                  <div style={{ textAlign: 'center' }}>
                    <h3>{L('WelcomeMessage')}</h3>
                  </div>
                  <FormItem>
                    {getFieldDecorator('userNameOrEmailAddress', { rules: rules.userNameOrEmailAddress })(
                      <Input placeholder={L('UserNameOrEmail')} prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} size="large" />
                    )}
                  </FormItem>

                  <FormItem>
                    {getFieldDecorator('password', { rules: rules.password })(
                      <Input
                        placeholder={L('Password')}
                        prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        type="password"
                        size="large"
                      />
                    )}
                  </FormItem>
                  <Row style={{ margin: '0px 0px 10px 15px ' }}>
                    <Col span={12} offset={0}>
                      <Checkbox checked={loginModel.rememberMe} onChange={loginModel.toggleRememberMe} style={{ paddingRight: 8 }} />
                      {L('RememberMe')}
                      <br />
                      <a>{L('ForgotPassword')}</a>
                    </Col>

                    <Col span={8} offset={4}>
                      <Button style={{ backgroundColor: '#f5222d', color: 'white' }} htmlType={'submit'} type="danger">
                        {L('LogIn')}
                      </Button>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </Row>
        </Form>
      </Col>
    );
  }
}

export default Form.create()(Login);
