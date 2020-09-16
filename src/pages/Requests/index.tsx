import React, { Component } from 'react';
import { Button/*, Card, Col, Row, Input, DatePicker */} from 'antd';
import Search from 'antd/lib/input/Search';
import './index.css';

//mobx
import { inject, observer } from 'mobx-react';

import ResultTable from './Components/ResultTable/ResultTable';
//import CreateOrEditRequestModal from './Components/CreateOrEditRequestModal/CreateOrEditRequestModal';

//import {  EditOutlined } from '@ant-design/icons';
import Stores from '../../stores/storeIdentifier';
import RequestStore from '../../stores/requestStore';
import HandleModal from './Components/CreateModal/HandleModal';
//import { GetRequestOutput } from '../../services/request/dto/getRequestOutput';
import { Store } from 'antd/lib/form/interface';
import { CreateRequestInput } from '../../services/request/dto/createRequestInput';
import ExportCollapse from './Components/ExportCollapse/ExportCollapse';
import ProtectedComponent from '../../components/ProtectedComponent';
//import ModalToggle from './Components/CreateOrEditRequestModal/ModalToggle';
//import CollectionCreateOrEditForm from './Components/CreateOrEditRequestModal/CollectionCreateOrEditForm';

//const { Panel } = Collapse;

interface IRequestProps {
  requestStore: RequestStore;
}

@inject(Stores.RequestStore)
@observer
export default class Requests extends Component<IRequestProps> {
  modalRef = React.createRef<HandleModal>();
  constructor(props: IRequestProps) {
    super(props);
    this.handleModalOpen = this.handleModalOpen.bind(this);
  }
  state = {
    modalVisible: false,
    editingRequestId: '',
  };

  async handleModalOpen(params: any) {
    if (params.id && params.id.length > 0) {
      await this.props.requestStore.get(params.id);
    } else {
      await this.props.requestStore.createRequest();
    }

    this.setState({
      editingRequestId: this.props.requestStore.editRequest!.id,
    });
    this.toggleModal(() => {
      this.modalRef.current?.setFieldsValues(this.props.requestStore.editRequest);
    });
  }

  toggleModal = (cb: Function = () => {}) => {
    this.setState({ modalVisible: !this.state.modalVisible }, () => {
      cb();
    });
  };

  handleSave = async (request: CreateRequestInput | null, validatingErrors: Store) => {
    if (request) {
      console.log(request)
      // if (this.state.editingRequestId) {
      //   request = {
      //     ...request,
      //     id: this.state.editingRequestId
      //   }
      //   await this.props.requestStore.update(this.state.editingRequestId, request);
      // } else {
        await this.props.requestStore.create(request);
      //}
      this.toggleModal(async () => {
        await this.props.requestStore.getAll();
      });
    }
  };

  render() {
    //const { requests } = this.props.requestStore;
    return (
      <div style={{ overflow: 'scroll' }}>
        <h2>Requests Management</h2>
        <ProtectedComponent requiredPermission="data:export">
          <ExportCollapse/>
        </ProtectedComponent>
        <div className="create-filter">
          <div>
            <Button
              // size="small"
              // style={{ display: 'inline-block', verticalAlign: 'middle' }}
              type="primary"
              onClick={() => this.handleModalOpen({ id: '' })}
            >
              Create new Request
            </Button>
            {/* <CreateOrEditRequestModal isCreate requestData isEdit={false} requestStore = {this.props.requestStore} /> */}
            {/* <ModalToggle modal = {CollectionCreateOrEditForm} isCreate isEdit={false} requestData requestStore = {this.props.requestStore} /> */}
          </div>
          <Search
            style={{ width: '400px' }}
            placeholder="Search on GDPR Request"
            enterButton="Search"
            size="large"
            onSearch={(value) => this.props.requestStore.getSearch(value)}
          />
        </div>
        <ResultTable requestStore={this.props.requestStore} handleModalOpen={this.handleModalOpen} />

        <HandleModal
          ref={this.modalRef}
          visible={this.state.modalVisible}
          onCancel={() =>
            this.setState({
              modalVisible: false,
            })
          }
          modalType={ 'create'}
          onSave={this.handleSave}
          {...this.props}
        />
      </div>
    );
  }
}


