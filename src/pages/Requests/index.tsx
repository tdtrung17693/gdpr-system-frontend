import React from 'react';
import Search from 'antd/lib/input/Search';
import './index.css';

//components
import ResultTable from './Components/ResultTable/ResultTable';
import CreateModal from './Components/CreateModal/CreateModal';
import ExportCollapse from './Components/ExportCollapse/ExportCollapse';



export default function Requests() {
  return (
    <div>
      <h2>Requests Management</h2>
      <div>
          <ExportCollapse />
        </div>
      <div className="create-filter">
        <div>
          <CreateModal />
        </div>
        <Search
          style={{ width: '400px' }}
          enterButton="Search"
          size="large"
          onSearch={(value) => console.log(value)}
        />
      </div>
      <ResultTable />
    </div>
  );
}
