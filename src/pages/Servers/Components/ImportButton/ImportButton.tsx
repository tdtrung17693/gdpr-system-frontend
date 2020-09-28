import { Upload, message, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import React, { Component } from 'react';

import { inject, observer } from 'mobx-react';
import Stores from '../../../../stores/storeIdentifier';
import ServerStore from '../../../../stores/serverStore';

import * as XLSX from 'xlsx';
import AuthenticationStore from '../../../../stores/authenticationStore';
//import { GetServerInput } from '../../../../services/server/dto/GetServerInput';
import moment from "moment";

interface ImportProps {
  serverStore: ServerStore;
  authenticationStore: AuthenticationStore;
}

interface ImportStates {
  isImportinng: boolean;
  file: any;
}

@inject(Stores.ServerStore, Stores.AuthenticationStore)
@observer
export default class ImportButton extends Component<ImportProps, ImportStates> {
  constructor(props: ImportProps) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.handleImport = this.handleImport.bind(this);
  }

  state = {
    isImportinng: false,
    file: '',
  };

  appearButton() {
    this.setState({ isImportinng: true });
  }

  async handleImport() {
    // await this.props.serverStore.importFileServer(this.state.file);
  }

  async onChange(info: any) {
    let errorRow: any = [];
    let ListNewServer: any = [];
    if (info.file.status !== 'uploading') {
      let reader = new FileReader();
      reader.readAsBinaryString(info.file.originFileObj);
      reader.onload = async (e: any) => {
        let data = e.target.result;
        let wordbook = XLSX.read(data, { type: 'binary' });
        wordbook.SheetNames.forEach((sheet: any) => {
          let rowObject = XLSX.utils.sheet_to_json(wordbook.Sheets[sheet]);
          rowObject.forEach((row: any, index: number) => {
            if (row.IpAddress && row.Name) {
              if (!row.IpAddress.toString().match(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/)) {
                errorRow.push(index);
              } else if (row.StartDate && row.EndDate) {
                let ds: Date = new Date(moment(row.StartDate).format('YYYY-MM-DD'));
                let de: Date = new Date(moment(row.EndDate).format('YYYY-MM-DD'));
                if (Number(ds.getTime()) >= Number(de.getTime())) {
                  errorRow.push(index);
                }
                else{
                  ListNewServer.push({
                    Name: row.Name.toString(),
                    IpAddress: row.IpAddress.toString(),
                    StartDate: row.StartDate ? row.StartDate.toString() : null,
                    EndDate: row.EndDate ? row.EndDate.toString() : null,
                    CreatedBy: this.props.authenticationStore.user?.id ? this.props.authenticationStore.user?.id : null,
                  });
                }
              } else {
                ListNewServer.push({
                  Name: row.Name.toString(),
                  IpAddress: row.IpAddress.toString(),
                  StartDate: row.StartDate ? row.StartDate.toString() : null,
                  EndDate: row.EndDate ? row.EndDate.toString() : null,
                  CreatedBy: this.props.authenticationStore.user?.id ? this.props.authenticationStore.user?.id : null,
                });
              }
            } else {
              errorRow.push(index);
            }
          });
        });
        if (ListNewServer.length > 0 && errorRow.length <= 0) {
          await this.props.serverStore.importFileServer(ListNewServer);
          message.success(`${info.file.name} file uploaded successfully`);
        } else if (ListNewServer.length > 0 && errorRow.length > 0) {
          await this.props.serverStore.importFileServer(ListNewServer);
          message.error(`Some IPs or end date is invalid.`);
        } else {
          message.error(`${info.file.name} file upload failed.`);
        }
      };
    }
  }

  importProps = {
    name: 'file',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    headers: {
      accept: 'text/plain',
      'content-type': 'multipart/form-data; boundary=----WebKitFormBoundaryWKHQobYZxYD1JIyA',
    },
  };

  render() {
    return (
      <>
        <Upload accept=".xlsx" {...this.importProps} onChange={this.onChange} showUploadList={false}>
          <Button type="link" icon={<UploadOutlined />}>
            Import .CSV
          </Button>
        </Upload>
      </>
    );
  }
}
