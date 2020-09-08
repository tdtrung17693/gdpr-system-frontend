import LoadableComponent from './../Loadable/index';

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
    permission: '',
    title: 'Customers',
    icon: 'home',
    showInMenu: true,
    component: LoadableComponent(() => import('../../pages/Customers')),
  },
  {
    path: '/servers',
    name: 'server',
    permission: '',
    title: 'Servers',
    icon: 'home',
    showInMenu: true,
    component: LoadableComponent(() => import('../../pages/Servers')),
  },
  {
    path: '/requests',
    name: 'requests',
    permission: '',
    title: 'Requests',
    icon: 'mail',
    showInMenu: true,
    component: LoadableComponent(() => import('../../pages/Requests')),
  },
  {
    path: '/requests/editrequest',
    name: 'editrequest',
    permission: '',
    title: 'Edit Request',
    icon: 'mail',
    showInMenu: false,
    component: LoadableComponent(() => import('../../pages/EditRequest')),
  },
  {
    path: '/users',
    permission: 'Pages.Users',
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
    permission: '',
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
