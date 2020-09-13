import * as React from 'react';
import signalRService from '../../../services/signalRService';
import { Row, Col, Comment, List, Form, Button, Card } from 'antd';
import { Comment as IComment } from '../../../services/comment/commentService';
import moment from 'moment'
import TextArea from 'antd/lib/input/TextArea';
import { inject, observer } from 'mobx-react';
import Stores from '../../../stores/storeIdentifier';
import AuthenticationStore from '../../../stores/authenticationStore';

interface IConversationBoxProps {
  requestId: string;
  comments: IComment[];
  authenticationStore?: AuthenticationStore
}

const ReplyEditor = (props: {buttonText?: string} = {buttonText: "Add Comment"}) => {
  
  return (<>
    <Row gutter={24}>
      <Col span={20}>
        <Form.Item>
          <TextArea rows={1} />
        </Form.Item>
      </Col>
      <Col span={4}>
        <Form.Item>
          <Button htmlType="submit" style={{ width: '100%' }}>
            {props.buttonText}
          </Button>
        </Form.Item>
      </Col>
    </Row>
  </>)
}

@inject(Stores.AuthenticationStore)
@observer
class CommentBox extends React.Component<IConversationBoxProps> {
  state = {
    joinedGroup: false,
    replyingId: ""
  }
  componentDidMount() {
    const { requestId } = this.props;

    
    this.joinGroup(requestId);
  }
  async componentDidUpdate(prevProps: IConversationBoxProps) {
    if(prevProps.requestId != this.props.requestId) {
      await this.leaveGroup(prevProps.requestId);
      this.joinGroup(this.props.requestId);
    }
  }

  componentWillUnmount() {
    this.leaveGroup(this.props.requestId);
  }

  joinGroup = (id: string) => {
    return new Promise((resolve, reject) => {
      signalRService.joinGroup(`conversation:${id}`)
      .then(() => {
        this.setState({
          joinedGroup: true
        }, () => {
          resolve();
        })
      })
      .catch(reject)
    })
  };

  leaveGroup = (id: string) => {
    return new Promise((resolve, reject) => {
      signalRService.leaveGroup(`conversation:${id}`)
      .then(() => {
        this.setState({
          joinedGroup: true
        }, async () => {
          resolve();
        })
      })
      .catch(reject)
    })
  };

  handleReply = (comment: IComment) => {
    this.setState({
      replyingId: comment.id
    })
  }

  renderComment = (comment: IComment, reply: IComment[] = []) => {
    return (
      <Comment
        actions={comment.parentId == "" ? [<span key="comment-nested-reply-to" onClick={() => this.handleReply(comment)}>Reply to</span>] : []}
        content={(
          <div className="comment">
            <p>{comment.content}</p>
            { comment.id === this.state.replyingId ? (
                <div className="comment-reply">
                  <ReplyEditor buttonText="Reply"/>
                </div>
            ) : ""}
          </div>
        )}
        author={<div>{comment.author.firstName} {comment.author.lastName}</div>}
        datetime={<div>{moment(comment.createdAt).format("YYYY-MM-DD HH:mm")}</div>}
        key={comment.id}
      >
        {reply.map(comment => this.renderComment(comment))}
      </Comment>
    )
  }

  render() {
    const { comments } = this.props;
    return (
      <Card>
        <Row>
          <Col span={24}>
            <Comment
              author={<div>{this.props.authenticationStore?.user?.firstName} {this.props.authenticationStore?.user?.lastName}</div>}
              content={(
                <ReplyEditor />
              )} />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <List
              className="comment-list"
              // header={`${data.length} replies`}
              itemLayout="horizontal"
              dataSource={comments.filter(c => c.parentId === "")}
              renderItem={(comment: IComment) => {
                const reply = this.props.comments.filter(c => c.parentId == comment.id);
                return (
                <li>
                  {this.renderComment(comment, reply)}
                </li>
              )}}
            />,
          </Col>
        </Row>
      </Card>);
  }
}

export default CommentBox;