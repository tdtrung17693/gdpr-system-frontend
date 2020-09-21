import { action, observable } from 'mobx';

import commentService, { Comment, CommentDeleted } from '../services/comment/commentService';
import { CreateCommentInput } from '../services/comment/dto/createCommentInput';

class CommentStore {
  @observable comments: Comment[] = [];

  @action
  public async getCommentsOfRequest(requestId: string, order: string) {
    const comments = await commentService.getAllCommentsOfRequest(requestId.toLowerCase(), order);
    //
    this.comments = comments;
  }

  public async createNewComment(comment: CreateCommentInput) {
    await commentService.create(comment);
  }

  @action
  public async addCommentToStoreAfter(comment: Comment) {
    this.comments.push(comment);
  }

  @action
  public async addCommentToStoreBefore(comment: Comment) {
    this.comments = [comment, ...this.comments];
  }

  @action
  public async deletedComment(obj: CommentDeleted) {
    let newList: Comment[] = [];
    newList = this.comments.filter((comment) => comment.id != obj.id);
    
    
    this.comments = [...newList]
  }

  @action
  public async deleteCommentofRequest(comment: Comment, requestId: string) {
    let result = await commentService.deleteCommentofRequest(comment, requestId);
    return result;
  }
}
export default CommentStore;
