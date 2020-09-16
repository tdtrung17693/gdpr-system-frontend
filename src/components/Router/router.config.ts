import LoadableComponent from './../Loadable/index';
import { Permissions } from './../../config/permissions';

export const userRouter: any = [
  {
    path: '/user',
    name: 'user',
    title: 'User',
    component: LoadableComponent(() => import('../../components/Layout/UserLayout')),
    isLayout: true,
    showInMenu: false,
  },
  {
    path: '/user/login',
    name: 'login',
    title: 'LogIn',
    component: LoadableComponent(() => import('../../pages/Login')),
    showInMenu: false,
  },
  {
    path: '/user/test/:id',
    name: 'test',
    title: 'Test',
    component: LoadableComponent(() => import('../../pages/RequestDetails'))
  }
];

export const appRouters: any = [
  {
    path: '/',
    exact: true,
    name: 'home',
    permission: '',
    title: 'Home',
    icon: 'home',
    component: LoadableComponent(() => import('../../components/Layout/AppLayout')),
    isLayout: true,
    showInMenu: false,
  },
  {
    path: '/customers',
    name: 'customers',
    permission: Permissions.VIEW_CUSTOMER,
    title: 'Customers',
    icon: 'home',
    showInMenu: true,
    component: LoadableComponent(() => import('../../pages/Customers')),
  },
  {
    path: '/servers',
    name: 'server',
    permission: Permissions.VIEW_SERVER,
    title: 'Servers',
    icon: 'cloud-server',
    showInMenu: true,
    component: LoadableComponent(() => import('../../pages/Servers')),
  },
  {
    path: '/requests',
    name: 'requests',
    permission: Permissions.VIEW_REQUEST,
    title: 'Requests',
    icon: 'mail',
    showInMenu: true,
    component: LoadableComponent(() => import('../../pages/Requests')),
  },
  {
    path: '/requests/editrequest/:id',
    name: 'editrequest',
    permission: Permissions.EDIT_REQUEST,
    title: 'Edit Request',
    icon: 'mail',
    showInMenu: false,
    component: LoadableComponent(() => import('../../pages/EditRequest')),
  },
  {
    path: '/requests/:id',
    name: 'request-details',
    permission: '',
    title: 'Request Details',
    icon: 'mail',
    showInMenu: false,
    component: LoadableComponent(() => import('../../pages/RequestDetails')),
  },
  {
    path: '/users',
    permission: Permissions.VIEW_USER,
    title: 'Users',
    name: 'user',
    icon: 'user',
    showInMenu: true,
    component: LoadableComponent(() => import('../../pages/Users')),
  },
  {
    path: '/accountsetting',
    name: 'accountsetting',
    permission: '',
    title: 'Setting',
    icon: 'setting',
    showInMenu: false,
    component: LoadableComponent(() => import('../../pages/AccountSetting')),
  },
  {
    path: '/logout',
    title: 'Logout',
    name: 'logout',
    icon: 'info-circle',
    showInMenu: false,
    component: LoadableComponent(() => import('../../components/Logout')),
  },
  
  {
    path: '/exception?:type',
    permission: '',
    title: 'exception',
    name: 'exception',
    icon: 'info-circle',
    showInMenu: false,
    component: LoadableComponent(() => import('../../pages/Exception')),
  },
];

export const routers = [...userRouter, ...appRouters];
