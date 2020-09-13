import { Upload, message, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import React, { Component } from 'react';

import { inject, observer } from 'mobx-react';
import Stores from '../../../../stores/storeIdentifier';
import ServerStore from '../../../../stores/serverStore';


interface ImportProps {
  serverStore: ServerStore;
}

interface ImportStates {
  isImportinng: boolean;
  file: any;
}

@inject(Stores.ServerStore)
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
      reader.onload = async (e: any) => {
        this.setState({ isImportinng: true, file: e.target.files[0]});
        let formData = new FormData();
        formData.append('body', e.target.files[0]);
        //console.log(formData.get('formFile'));
        await this.props.serverStore.importFileServer(formData);
        //console.log(this.state.file);
      };
      reader.readAsText(info.file.originFileObj);
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
      "accept": "text/plain",
      "content-type": 'multipart/form-data; boundary=----WebKitFormBoundaryWKHQobYZxYD1JIyA',
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
