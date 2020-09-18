import * as React from 'react';

import { Row, Card, Input, Col, Typography, Form, Button, Space, message, Upload, Image } from 'antd';
import { inject, observer } from 'mobx-react';
import Stores from '../../stores/storeIdentifier';
import AuthenticationStore from '../../stores/authenticationStore';
import { FormInstance } from 'antd/lib/form';
import { UpdateProfileInfoInput } from '../../services/account/dto/updateProfileInfoInput';
import { ChangePasswordInput } from '../../services/account/dto/changePasswordInput';
import ImgCrop from 'antd-img-crop';
//import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { PictureOutlined } from '@ant-design/icons';
import http from '../../services/httpService';

const { Title } = Typography;
const FormItem = Form.Item;

function getBase64(img: any, callback: any) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file: any) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
}

interface IAccountSettingsProps {
  authenticationStore: AuthenticationStore;
}

@inject(Stores.AuthenticationStore)
@observer
export class AccountSetting extends React.Component<IAccountSettingsProps> {
  formInfoRef = React.createRef<FormInstance>();
  formPassRef = React.createRef<FormInstance>();

  state = {
    processing: false,
    isDirty: false,
    loading: false,
    imageUrl: '',
    currentAvatarId: '',
  };

  fetchAvatar = async () => {
    const id = this.props.authenticationStore.user!.id;

    await http.get(`api/users/avatar/${id}`)
      .then((response) => {
        if (!response.data) return;
        this.setState({ imageUrl: 'data:image/png;base64,' + response.data.content, currentAvatarId: response.data.id });
        
      })
      .catch(function (error) {
        
      });
  }

  componentDidMount = async () => {
    await this.fetchAvatar();
    
  }

  handleAvatarChange = (info: any) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imageUrl: any) => {
        this.setState({
          imageUrl: imageUrl,
          loading: false,
        });
        if (this.state.currentAvatarId == undefined || this.state.currentAvatarId == '') {
          http.post("api/users/avatar", {
            userId: this.props.authenticationStore.user!.id,
            fileName: this.props.authenticationStore.user!.id + "_" + info.file.name.replace("." + info.file.name.split('.').pop(), ""),
            fileExtension: info.file.name.split('.').pop(),
            content: imageUrl.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
          }).then((response) => {
            this.setState({ currentAvatarId: response.data.id })
            
          })
            .catch(function (error) {
              
            });
        }
        else {
          http.put("api/users/avatar", {
            userId: this.props.authenticationStore.user!.id,
            fileName: this.props.authenticationStore.user!.id + "_" + info.file.name.replace("." + info.file.name.split('.').pop(), ""),
            fileExtension: info.file.name.split('.').pop(),
            content: imageUrl.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
            fileId: this.state.currentAvatarId,
          });
        }
      },
      );
    }
  };


  waitForProcess = async (processingFn: Function, successMsg: string, errorMsg: string) => {
    this.setState(
      {
        processing: true,
      },
      async () => {
        message.loading({ content: 'Processing...', key: 'user:process', duration: 0 });
        try {
          await processingFn();
          message.success({ content: successMsg, key: 'user:process', duration: 5 });
        } catch (e) {
          message.error({ content: errorMsg, key: 'user:process', duration: 5 });
          throw e;
        }

        this.setState({
          processing: false,
        });
      }
    );
  };

  handleUpdateProfileInfo = async (values: UpdateProfileInfoInput) => {
    this.waitForProcess(
      async () => {
        await this.props.authenticationStore.updateCurrentUserInfo(values);
      },
      'Profile info updated',
      'Cannot save your profile info'
    );
  };

  handleChangePassword = (values: ChangePasswordInput) => {
    this.waitForProcess(
      async () => {
        await this.props.authenticationStore.changeUserPassword(values);
        this.formPassRef.current?.setFieldsValue({ currentPassword: '', newPassword: '', confirmPassword: '' });
      },
      'Password changed',
      'Cannot changed your password'
    );
  };

  handleValuesChange = (changedValues: any, allValues: any) => {
    if (this.state.isDirty) return;

    let changedFields = Object.keys(changedValues);

    if (changedFields.filter((field) => ['firstName', 'lastName'].includes(field)).length > 0) {
      this.setState({ isDirty: true });
    }
  };

  resetProfileInfo = () => {
    this.formInfoRef.current?.setFieldsValue({
      firstName: this.props.authenticationStore.user?.firstName,
      lastName: this.props.authenticationStore.user?.lastName,
      email: this.props.authenticationStore.user?.email,
      username: this.props.authenticationStore.user?.username,
    });
  };

  render() {
    const currentUser = this.props.authenticationStore.user!;
    const { firstName, lastName, email, username } = currentUser;
    const { imageUrl } = this.state;

    return (
      <>
        <Title level={2}>Account Settings</Title>
        <Card title="General Information" style={{ marginBottom: 16 }}>
          <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
            <Col sm={{ span: 5, offset: 0 }}>
              <>
                {imageUrl ?
                  <Image
                    width="100%"
                    src={imageUrl} alt="avatar"
                  /> :
                  <Image
                    width="100%"
                    src="error" alt="avatar"
                    fallback="data:image/png;base64,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"
                  />}
                <Button style={{ width: '100%' }} icon={<PictureOutlined />}>
                  <ImgCrop rotate>
                    <Upload
                      name="avatar"
                      accept=".jpg,.png,.jpeg"
                      style={{ width: '100%' }}
                      className="avatar-uploader"
                      showUploadList={false}
                      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                      beforeUpload={(file: any) => beforeUpload(file)}
                      onChange={(file: any) => this.handleAvatarChange(file)}
                    >
                      Update Profile Picture
                  </Upload>
                  </ImgCrop>
                </Button>
              </>
            </Col>
            <Col sm={{ span: 12, offset: 0 }}>
              <Form
                ref={this.formInfoRef}
                layout="vertical"
                onFinish={this.handleUpdateProfileInfo}
                onValuesChange={this.handleValuesChange}
                initialValues={{ firstName, lastName, email, username }}
              >
                <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
                  <Col span={12}>
                    <FormItem label={'First Name'} name="firstName" rules={[{ required: true, message: "Please input your first name." }]}>
                      <Input />
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label={'Last Name'} name="lastName" rules={[{ required: true, message: "Please input your last name." }]}>
                      <Input />
                    </FormItem>
                  </Col>
                </Row>
                <FormItem label={'Email'} name="email">
                  <Input disabled />
                </FormItem>
                <FormItem label={'Username'} name="username">
                  <Input disabled />
                </FormItem>
                <Space size="middle">
                  <FormItem>
                    <Button type="primary" htmlType="submit" loading={this.state.processing}>
                      Save
                    </Button>
                  </FormItem>
                  <FormItem>
                    <Button type="default" disabled={!this.state.isDirty} onClick={this.resetProfileInfo}>
                      Reset
                    </Button>
                  </FormItem>
                </Space>
              </Form>
            </Col>
          </Row>
        </Card>
        <Card title="Password">
          <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
            <Col sm={{ span: 12, offset: 0 }}>
              <Form ref={this.formPassRef} layout="vertical" onFinish={this.handleChangePassword}>
                <FormItem
                  label="Current Password"
                  name="currentPassword"
                  rules={[
                    {
                      required: true,
                      message: 'Please input your current password',
                    },
                  ]}
                >
                  <Input type="password"></Input>
                </FormItem>
                <FormItem label="New Password" name="newPassword" rules={[
                  {
                    required: true,
                    message: 'Please input your new password'
                  },
                  {
                    min: 8,
                    message: 'Password is too short'
                  }
                ]}>
                  <Input type="password"></Input>
                </FormItem>
                <FormItem label="Confirm New Password" name="confirmPassword" rules={[
                  {
                    validator: async (rule, value) => {
                      const newPassword = this.formPassRef.current?.getFieldValue("newPassword");
                      if (newPassword !== value) throw new Error("Password mismatch");
                    },
                  }
                ]}>
                  <Input type="password"></Input>
                </FormItem>
                <Button htmlType="submit" type="primary" loading={this.state.processing}>
                  Change Password
                </Button>
              </Form>
            </Col>
          </Row>
        </Card>
      </>
    );
  }
}

export default AccountSetting;
