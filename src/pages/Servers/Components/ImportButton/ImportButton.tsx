import { Upload, message, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import React, { Component } from 'react';

import { inject, observer } from 'mobx-react';
import Stores from '../../../../stores/storeIdentifier';
import ServerStore from '../../../../stores/serverStore';

import * as XLSX from 'xlsx';
import AuthenticationStore from '../../../../stores/authenticationStore';
//import { GetServerInput } from '../../../../services/server/dto/GetServerInput';

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
    console.log('done');
  }

  async onChange(info: any) {
    if (info.file.status !== 'uploading') {
      let reader = new FileReader();
      //reader.readAsBinaryString(new Blob(info.fileList));
      reader.readAsBinaryString(info.file.originFileObj);
      reader.onload = async (e: any) => {
        //console.log(e.target.result);
        let data = e.target.result;
        let wordbook = XLSX.read(data, { type: 'binary' });
        //console.log(wordbook);
        let ListNewServer: any = [];
        wordbook.SheetNames.forEach((sheet: any) => {
          let rowObject = XLSX.utils.sheet_to_json(wordbook.Sheets[sheet]);
          rowObject.forEach((row: any) => {
            ListNewServer.push({
              Name: row.Name.toString(),
              IpAddress: row.IpAddress.toString(),
              StartDate: row.StartDate ? row.StartDate.toString() : null,
              EndDate: row.EndDate ? row.EndDate.toString() : null,
              CreatedBy: this.props.authenticationStore.user?.id ? this.props.authenticationStore.user?.id : 'F58D65ED-E442-4D6D-B3FC-CE234E470550',
            });
          });
        });
        console.log(ListNewServer);
        await this.props.serverStore.importFileServer(ListNewServer);
      };
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
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
        <Upload accept=".xlsx" {...this.importProps} onChange={this.onChange}>
          <Button type="link" icon={<UploadOutlined />}>
            Import .CSV
          </Button>
        </Upload>
        {this.state.isImportinng ? (
          <Button type="primary" onClick={this.handleImport}>
            Import
          </Button>
        ) : null}
      </>
    );
  }
}

// export default function ImportButton() {
//   const props = {
//     name: 'file',
//     action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
//     headers: {
//       authorization: 'authorization-text',
//     },
//     onChange(info: any) {
//       if (info.file.status !== 'uploading') {
//         let reader = new FileReader();
//         reader.onload = (e: any) => {
//           console.log(e.target.result);
//         };
//         reader.readAsText(info.file.originFileObj);
//       }
//       if (info.file.status === 'done') {
//         message.success(`${info.file.name} file uploaded successfully`);
//       } else if (info.file.status === 'error') {
//         message.error(`${info.file.name} file upload failed.`);
//       }
//     },
//   };
//   return (
//     <Upload accept="  .xlsx" {...props}>
//       <Button type="link" icon={<UploadOutlined />}>
//         Import .CSV
//       </Button>
//     </Upload>
//   );
// }
