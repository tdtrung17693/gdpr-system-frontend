import AppConsts from './../lib/appconst';
import { L } from '../lib/abpUtility';
import { Modal } from 'antd';
import axios from 'axios';
import { ls } from './localStorage';
import { Auth } from '../config/auth';

const qs = require('qs');


const http = axios.create({
  baseURL: AppConsts.remoteServiceBaseUrl,
  timeout: 30000,
  paramsSerializer: function(params) {
    return qs.stringify(params, {
      encode: false,
    });
  },
});

http.interceptors.request.use(
  function(config) {
    if (!!ls.get(Auth.TOKEN_NAME)) {

      config.headers.common['Authorization'] = `Bearer ${ ls.get(Auth.TOKEN_NAME) }`;
    }

    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);

http.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response && error.response.data.error && error.response.data.error.message && error.response.data.error.details) {
      Modal.error({
        title: error.response.data.error.message,
        content: error.response.data.error.details,
      });
    } else if (!!error.response && !!error.response.data.error && error.response.data.error.code == "login_failure") {
      Modal.error({
        title: L('Login Failed'),
        content: error.response.data.error.description,
      });
    } else if (error.response && error.response.status === 401) {
      Modal.error({
        title: 'Session timeout',
        content: 'Your session has been timed out. Please log in again.',
        onOk: () => {
          window.location.pathname = "/logout"
        }
      })
    } else  {
      Modal.error({ content: "Unknown Error. Please try again later." });
    } 

    setTimeout(() => {}, 1000);

    return Promise.reject(error);
  }
);

export default http;
