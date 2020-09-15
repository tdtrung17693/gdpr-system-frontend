import './index.less';

import * as React from 'react';

import { Avatar, Badge, Col, Dropdown, Menu, Row } from 'antd';
import {MenuFoldOutlined, MenuUnfoldOutlined, LogoutOutlined, SettingOutlined} from '@ant-design/icons'

import { L } from '../../lib/abpUtility';
import { Link } from 'react-router-dom';

import profilePicture from '../../images/user.png';

export interface IHeaderProps {
  collapsed?: any;
  toggle?: any;
}

const userDropdownMenu = (
  <Menu>
    <Menu.Item key="2">
      <Link to="/logout">
        <LogoutOutlined />
        <span> {L('Logout')}</span>
      </Link>
    </Menu.Item>
    <Menu.Item key="3">
      <Link to="/accountsetting">
        <SettingOutlined />
        <span> {L('Setting')}</span>
      </Link>
    </Menu.Item>
  </Menu>
);

export class Header extends React.Component<IHeaderProps> {
  render() {
    const MenuIcon = this.props.collapsed  ? MenuUnfoldOutlined : MenuFoldOutlined;
    return (
      <Row className={'header-container'}>
        <Col style={{ textAlign: 'left' }} span={12}>
          <MenuIcon className='trigger' onClick={this.props.toggle} />
        </Col>
        <Col style={{ padding: '0px 15px 0px 15px', textAlign: 'right' }} span={12}>
          <Dropdown overlay={userDropdownMenu} trigger={['click']}>
            <Badge style={{}} count={3}>
              <Avatar style={{height:24, width:24}} shape="circle" alt={'profile'} src={profilePicture} />
            </Badge>
          </Dropdown>
        </Col>
      </Row>
    );
  }
}

export default Header;
