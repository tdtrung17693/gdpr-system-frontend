import React, {useState} from 'react';
import { Upload, message, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

export default function ImportButton() {
  const [importData, setImportData] = useState("");
  const props = {
    name: 'file',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info: any) {
      if (info.file.status !== 'uploading') {
        let reader = new FileReader();
        reader.onload = (e: any) => {
          console.log(e.target.result);
          setImportData(e.target.result);
          console.log(importData);  
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
  return (
    <Upload accept=".csv, .txt, .ods" {...props}>
      <Button type="link" icon={<UploadOutlined />}>
        Import .CSV
      </Button>
    </Upload>
  );
}
