import * as React from 'react';

import { Select, Form, Input, Modal, Switch } from 'antd';

import FormItem from 'antd/lib/form/FormItem';
import { L } from '../../../lib/abpUtility';
import rules from './createOrUpdateUser.validation';
import { inject, observer } from 'mobx-react';
import Stores from '../../../stores/storeIdentifier';
import RoleStore from '../../../stores/roleStore';
import { User } from '../../../services/user/userService';
import { FormInstance } from 'antd/lib/form';

const Option = Select.Option;

export interface ICreateOrUpdateUserProps {
  visible: boolean;
  onCancel: () => void;
  modalType: string;
  onSave: (user: User | null, errors: any) => void;
  roleStore: RoleStore;
}

@inject(Stores.RoleStore)
@observer
class CreateOrUpdateUser extends React.Component<ICreateOrUpdateUserProps> {
  formRef = React.createRef<FormInstance>();
  state = {
    confirmDirty: false,
    processing: false
  };

  public setFieldsValues = (user: User) => {
    this.setState({}, () => {
      this.formRef.current?.setFieldsValue({
        firstName: user?.firstName,
        lastName: user?.lastName,
        username: user?.username,
        email: user?.email,
        roleId: user?.roleId,
        status: user?.status
      });
    });
  }

  handleOkClicked = () => {
    this.formRef.current?.validateFields()
      .then((values: any) => {
        this.setState({
          processing: true
        }, async () => {
          await this.props.onSave(
            values,
            null
          )
          this.setState({
            processing: false
          })
        })
      })
      .catch(errors => {
        this.setState({
          processing: false
        })
        this.props.onSave(null, errors)
      })
  }

  render() {
    // const { roles } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 6 },
        sm: { span: 6 },
        md: { span: 6 },
        lg: { span: 6 },
        xl: { span: 6 },
        xxl: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 18 },
        sm: { span: 18 },
        md: { span: 18 },
        lg: { span: 18 },
        xl: { span: 18 },
        xxl: { span: 18 },
      },
    };
    // const tailFormItemLayout = {
    //   labelCol: {
    //     xs: { span: 6 },
    //     sm: { span: 6 },
    //     md: { span: 6 },
    //     lg: { span: 6 },
    //     xl: { span: 6 },
    //     xxl: { span: 6 },
    //   },
    //   wrapperCol: {
    //     xs: { span: 18 },
    //     sm: { span: 18 },
    //     md: { span: 18 },
    //     lg: { span: 18 },
    //     xl: { span: 18 },
    //     xxl: { span: 18 },
    //   },
    // };

    const { visible, onCancel, modalType } = this.props;


    return (
      <Modal 
        transitionName="fade"
        visible={visible}
        cancelText={L('Cancel')}
        okText={L('OK')}
        onCancel={onCancel}
        onOk={this.handleOkClicked}
        okButtonProps={{disabled: this.state.processing}}
        title={modalType === 'edit' ? 'Edit User' : 'Create User'}>
        <Form ref={this.formRef}>
          {this.props.modalType === 'create' ? (
            <>
              <FormItem label={L('First Name')} name="firstName" rules={rules.firstname} {...formItemLayout}>
                <Input />
              </FormItem>
              <FormItem label={L('Last Name')} name="lastName" rules={rules.lastname} {...formItemLayout}>
                <Input />
              </FormItem>
              <FormItem label={L('Username')} name="username" rules={rules.userName} {...formItemLayout}>
                <Input />
              </FormItem>
              <FormItem label={L('Email')} name="email" rules={rules.emailAddress} {...formItemLayout}>
                <Input />
              </FormItem>
            </>) : ''}
          {this.props.modalType === 'edit' ? (
            <Form.Item name="status" label="Status" valuePropName="checked" {...formItemLayout}>
              <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
            </Form.Item>
          ) : ''}
          <Form.Item
            name="roleId"
            label="Role"
            rules={rules.roleId}
            {...formItemLayout}
          >
            <Select>
              {
                this.props.roleStore!.roles.map(role => {
                  return <Option key={role.id} value={role.id}>{role.name}</Option>;
                })
              }
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default CreateOrUpdateUser;
