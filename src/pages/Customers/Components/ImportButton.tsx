// import { Button } from 'antd';
// import React, {Component} from 'react';
// //import { Upload, message, Button } from 'antd';
// import { UploadOutlined } from '@ant-design/icons';
// import CSVReader from 'react-csv-reader'
// import http from '../../../services/httpService';

// // const props = {
// //   name: 'file',
// //   action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
// //   headers: {
// //     authorization: 'authorization-text',
// //   },
// //   onChange(info: any) {
// //     if (info.file.status !== 'uploading') {
// //       console.log(info.file, info.fileList);
// //     }
// //     if (info.file.status === 'done') {
// //       message.success(`${info.file.name} file uploaded successfully`);
// //     } else if (info.file.status === 'error') {
// //       message.error(`${info.file.name} file upload failed.`);
// //     }
// //   },
// // };

// export default class ImportButton extends Component {
//   state ={
//     data: [],
//   }
//   // return (
//   //   <Upload {...props}>
//   //     <Button type="link" icon={<UploadOutlined />}>Import .CSV</Button>
//   //   </Upload>
//   // );
//   handleOnDrop = (data: any) => {
//     console.log('---------------------------')
//     console.log(data)
//     console.log('---------------------------')
//   }
 
//   handleOnError = (err: any, file: any, inputElem: any, reason: any) => {
//     console.log(err)
//   }
 
//   handleOnRemoveFile = (data: any) => {
//     console.log('---------------------------')
//     console.log(data)
//     console.log('---------------------------')
//   }
 
//   handleReadCSV = async (importedData: any, file: any) => {
//     console.log(importedData);
//     this.setState({data: importedData})
//   }

//   handleImport = async () => {
//     console.log(this.state.data);
//     if (this.state.data.length != 0){
//       for (let i=1; i < this.state.data.length; i++){
//         let csv_name = this.state.data[i][0];
//         let csv_contactPoint =this.state.data[i][1]
//         let csv_contractBeginDate = this.state.data[i][2];
//         let csv_contractEndDate = this.state.data[i][3]
//         let csv_description = this.state.data[i][4];
//         let csv_status = true;
//         await http.post('api/Customer', {
//           contractBeginDate: csv_contractBeginDate,
//           contractEndDate: csv_contractEndDate,
//           contactPoint: csv_contactPoint,
//           description: csv_description,
//           status: csv_status,
//           customerName: csv_name,
//         })
//         .then((response) =>{
//           console.log(response);
//         })
//         .catch(function (error) {
//           console.log(error);
//         });
//       }  
//     }
//     this.setState({data: []})
//   }

//   render() {
//     return (
//       <>
//       <Button type="link" onClick={() => this.handleImport()} icon={<UploadOutlined />}>Import .CSV</Button>
//       <CSVReader
        
//         //onDrop={this.handleOnDrop}
//         //onError={this.handleOnError}
//         //addRemoveButton
//         //removeButtonColor='#659cef'
//         //onRemoveFile={this.handleOnRemoveFile}
//         inputStyle={{color: 'red'}}
//         onFileLoaded={(data: any, file: any) => this.handleReadCSV(data, file)}
//       >
//       </CSVReader>
//       </>
//     )
//   }
// }


import React, {useState} from 'react';
import { Upload, message, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import Papa from 'papaparse';
import http from '../../../services/httpService';
//import http from '../../../services/httpService';

export default function ImportButton(this: any) {
  const [importData, setImportData] = useState(Object);
  const [fileList, setFileList] = useState([]);

  const props = {
    name: 'file',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info: any) {
      console.log(info.fileList);
      console.log(importData);
      if (info.file.status !== 'uploading') {
        let reader = new FileReader();
        reader.onload = (e: any) => {
          var data = Papa.parse(e.target.result).data;
          setImportData(data);  
          setFileList(info.fileList);
        };
        reader.readAsText(info.file.originFileObj);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  const handleImport = async () => {
    console.log(importData.length);  
    if (importData.length != 0){
      for (let i=1; i < importData.length - 1; i++){
        let csv_name = importData[i][0];
        let csv_contactPoint =importData[i][1]
        let csv_contractBeginDate = importData[i][2];
        let csv_contractEndDate = importData[i][3]
        let csv_description = importData[i][4];
        let csv_status = true;
        await http.post('api/Customer', {
          contractBeginDate: csv_contractBeginDate,
          contractEndDate: csv_contractEndDate,
          contactPoint: csv_contactPoint,
          description: csv_description,
          status: csv_status,
          customerName: csv_name,
        })
        .then((response: any) =>{
          console.log(response);
        })
        .catch(function (error: any) {
          console.log(error);
        });
      }  
    }
    setImportData([]); 
    setFileList([]);     
  }

  return (
    <>
      <Upload fileList={fileList} accept=".csv" {...props}>
        <Button disabled={fileList.length == 1} type="link" icon={<UploadOutlined />}>
            Import customer from .CSV
        </Button>
      </Upload>
      {importData.length != undefined && importData.length != 0 && <Button disabled={importData.length == undefined} onClick={() => handleImport()}>Import</Button>}
    </>
  );
}
