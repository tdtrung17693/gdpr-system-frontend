import * as React from 'react';

import { Row, Col } from 'antd';
import signalRService from '../../services/signalRService';
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
    signalRService.on("commentCreated", comment => {
      console.log(comment)
    })
  }
  componentDidUpdate() {
  }
  componentWillUnmount() {
    signalRService.off("commentCreated");
  }
  render() {
    return (
      <Row>
        <Col span={24}>
          <CommentBox comments={this.props.commentStore.comments} requestId={this.props.match.params.id}/>
        </Col>
      </Row>
    )
  }
}

export default RequestDetails;