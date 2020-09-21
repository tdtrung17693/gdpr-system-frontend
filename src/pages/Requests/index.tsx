import React, { Component } from 'react';
import { Button } from 'antd';
import Search from 'antd/lib/input/Search';
import './index.css';

//mobx
import { inject, observer } from 'mobx-react';

import ResultTable from './Components/ResultTable/ResultTable';
import Stores from '../../stores/storeIdentifier';
import RequestStore from '../../stores/requestStore';
import HandleModal from './Components/CreateModal/HandleModal';
import { Store } from 'antd/lib/form/interface';
import { CreateRequestInput } from '../../services/request/dto/createRequestInput';
import ExportCollapse from './Components/ExportCollapse/ExportCollapse';
//import ProtectedComponent from '../../components/ProtectedComponent';
import AuthenticationStore from '../../stores/authenticationStore';
import HistoryLogStore from '../../stores/historyLogStore';
import UserStore from '../../stores/userStore';
import ProtectedComponent from '../../components/ProtectedComponent';

interface IRequestProps {
  authenticationStore: AuthenticationStore;
  requestStore: RequestStore;
  historyLogStore: HistoryLogStore;
  userStore: UserStore;
}

@inject(Stores.RequestStore, Stores.HistoryLogStore, Stores.AuthenticationStore, Stores.UserStore)
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
    filterString: '',
  };

  async handleModalOpen(params: any) {
    if (params.id && params.id.length > 0) {
      await this.props.requestStore.get(params.id);
    } else {
      await this.props.requestStore.createRequest();
    }

    this.setState({
      editingRequestId: this.props.requestStore.editRequest!.Id,
    });
    this.toggleModal(() => {
      this.modalRef.current?.setFieldsValues(this.props.requestStore.editRequest);
    });
  }

  toggleModal = (cb: Function = () => {
  }) => {
    this.setState({ modalVisible: !this.state.modalVisible }, () => {
      cb();
    });
  };

  handleSearch = async (value: string) => {
    let filterKey = value;
    this.setState({filterString: filterKey});
    this.props.requestStore.pagingObj = {
      ...this.props.requestStore.pagingObj,
      page: 1,
      filterBy: filterKey
    }
    await this.props.requestStore.getRequestPaging(this.props.requestStore.pagingObj);
  }

  handleSave = async (request: CreateRequestInput | null, validatingErrors: Store) => {
    if (request) {
      await this.props.requestStore.create(request);

      this.toggleModal(async () => {
        await this.props.requestStore.getAll();
      });
    }
  };

  render() {
    //const { requests } = this.props.requestStore;
    return (
      <div>
        <h2>Requests Management</h2>
        <ProtectedComponent requiredPermission="data:export">
          <ExportCollapse />
        </ProtectedComponent>
        <div className="create-filter">
          <div>
            <Button
              type="primary"
              onClick={() => this.handleModalOpen({ id: '' })}
            >
              Create new Request
            </Button>
          </div>
          <Search
            style={{ width: '400px' }}
            placeholder="Search on GDPR Request"
            enterButton="Search"
            size="large"
            onSearch={this.handleSearch}
          />
        </div>
        <ResultTable historyLogStore = {this.props.historyLogStore} requestStore={this.props.requestStore} handleModalOpen={this.handleModalOpen} filterString = {this.state.filterString}/>

        <HandleModal
          ref={this.modalRef}
          visible={this.state.modalVisible}
          onCancel={() =>
            this.setState({
              modalVisible: false,
            })
          }
          modalType={'create'}
          onSave={this.handleSave}
          {...this.props}
        />
      </div>
    );
  }
}


