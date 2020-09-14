
import { action, observable } from 'mobx';

import commentService, { Comment } from '../services/comment/commentService';
import { CreateCommentInput } from '../services/comment/dto/createCommentInput';


class CommentStore {
  @observable comments: Comment[] = [];

  @action
  public async getCommentsOfRequest(requestId: string) {
    const comments = await commentService.getAllCommentsOfRequest(requestId.toLowerCase());
    console.log(comments)
    this.comments = comments;
  }

  public async createNewComment(comment: CreateCommentInput) {
    await commentService.create(comment);
  }

  @action
  public async addCommentToStore(comment: Comment) {
    this.comments.push(comment);
  }

}
export default CommentStore;
