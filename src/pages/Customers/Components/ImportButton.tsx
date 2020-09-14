import { Button } from 'antd';
import React, {Component} from 'react';
//import { Upload, message, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import CSVReader from 'react-csv-reader'
import http from '../../../services/httpService';

// const props = {
//   name: 'file',
//   action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
//   headers: {
//     authorization: 'authorization-text',
//   },
//   onChange(info: any) {
//     if (info.file.status !== 'uploading') {
//       console.log(info.file, info.fileList);
//     }
//     if (info.file.status === 'done') {
//       message.success(`${info.file.name} file uploaded successfully`);
//     } else if (info.file.status === 'error') {
//       message.error(`${info.file.name} file upload failed.`);
//     }
//   },
// };

export default class ImportButton extends Component {
  state ={
    data: [],
  }
  // return (
  //   <Upload {...props}>
  //     <Button type="link" icon={<UploadOutlined />}>Import .CSV</Button>
  //   </Upload>
  // );
  handleOnDrop = (data: any) => {
    console.log('---------------------------')
    console.log(data)
    console.log('---------------------------')
  }
 
  handleOnError = (err: any, file: any, inputElem: any, reason: any) => {
    console.log(err)
  }
 
  handleOnRemoveFile = (data: any) => {
    console.log('---------------------------')
    console.log(data)
    console.log('---------------------------')
  }
 
  handleReadCSV = async (importedData: any, file: any) => {
    console.log(importedData);
    this.setState({data: importedData})
  }

  handleImport = async () => {
    console.log(this.state.data);
    if (this.state.data.length != 0){
      for (let i=1; i < this.state.data.length; i++){
        let csv_name = this.state.data[i][0];
        let csv_contactPoint =this.state.data[i][1]
        let csv_contractBeginDate = this.state.data[i][2];
        let csv_contractEndDate = this.state.data[i][3]
        let csv_description = this.state.data[i][4];
        let csv_status = true;
        await http.post('api/Customer', {
          contractBeginDate: csv_contractBeginDate,
          contractEndDate: csv_contractEndDate,
          contactPoint: csv_contactPoint,
          description: csv_description,
          status: csv_status,
          customerName: csv_name,
        })
        .then((response) =>{
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
      }  
    }
    this.setState({data: []})
  }

  render() {
    return (
      <>
      <Button onClick={() => this.handleImport()} icon={<UploadOutlined />}>Import .CSV</Button>
      <CSVReader
        //onDrop={this.handleOnDrop}
        //onError={this.handleOnError}
        //addRemoveButton
        //removeButtonColor='#659cef'
        //onRemoveFile={this.handleOnRemoveFile}
        inputStyle={{color: 'red'}}
        onFileLoaded={(data: any, file: any) => this.handleReadCSV(data, file)}
      >
      </CSVReader>
      </>
    )
  }
}
