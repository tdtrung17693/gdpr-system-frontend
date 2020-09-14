import * as React from 'react';

import { Row, Col } from 'antd';
import CommentBox from './components/CommentBox';
import Stores from '../../stores/storeIdentifier';
import { inject, observer } from 'mobx-react';
import CommentStore from '../../stores/commentStore';

interface IRequestDetails {
  match: {params: any};
  commentStore: CommentStore;
}

@inject(Stores.CommentStore)
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
          <CommentBox  requestId={this.props.match.params.id}/>
        </Col>
      </Row>
    )
  }
}

export default RequestDetails;