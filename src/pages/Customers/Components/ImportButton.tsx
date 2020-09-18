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
      // console.log(info.fileList);
      // console.log(importData);
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
    //console.log(importData.length);  
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
          //console.log(response);
        })
        .catch((error: any) => {
          setImportData([]); 
          setFileList([])
          throw message.error(`File importing failed. Data not match expected field(s) on row ${i}`);
        });
      }  
    }
    message.success(`File imported successfully`);
    setImportData([]); 
    setFileList([]);     
  }

  return (
    <>
      <Upload onRemove={() => {
        setImportData([]); 
        setFileList([]);     
      }} fileList={fileList} accept=".csv" {...props}>
        <Button disabled={fileList.length == 1} type="link" icon={<UploadOutlined />}>
            Import customer from .CSV
        </Button>
      </Upload>
      {importData.length != undefined && importData.length != 0 && <Button disabled={importData.length == undefined} onClick={() => handleImport()}>Import</Button>}
    </>
  );
}
