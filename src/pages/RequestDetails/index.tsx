import * as React from 'react';

import { Row, Col } from 'antd';
import CommentBox from './components/CommentBox';
import Stores from '../../stores/storeIdentifier';
import { inject, observer } from 'mobx-react';
import CommentStore from '../../stores/commentStore';
import AuthenticationStore from '../../stores/authenticationStore';

interface IRequestDetails {
  match: {params: any};
  commentStore: CommentStore;
  authenticationStore: AuthenticationStore;
}

@inject(Stores.CommentStore,  Stores.AuthenticationStore)
@observer
export class RequestDetails extends React.Component<IRequestDetails> {
  componentDidMount() {
  }
  componentDidUpdate(prevProps: any) {
    const {match: {params}} = this.props
    const {id} = params;
    if (id === prevProps.match.params.id) return;

  }
  componentWillUnmount() {
  }
  render() {
    return (
      <Row>
        <Col span={24}>
          <CommentBox authenticationStore = {this.props.authenticationStore}  requestId={this.props.match.params.id.toLowerCase()}/>
        </Col>
      </Row>
    )
  }
}

export default RequestDetails;