
import { action, observable } from 'mobx';

import commentService, { Comment } from '../services/comment/commentService';
import { CreateCommentInput } from '../services/comment/dto/createCommentInput';


class CommentStore {
  @observable comments: Comment[] = [
    {
      id: "1",
      content: "lorem 1",
      author: { firstName: "A", lastName: "B", username: "abc", id: "abc"},
      parentId: "",
      createdAt: new Date(),
      requestId: "r1"
    },
    {
      id: "2",
      content: "lorem 2",
      author: { firstName: "C", lastName: "B", username: "abc", id: "abc"},
      parentId: "",
      createdAt: new Date(),
      requestId: "r1"
    },
    {
      id: "1",
      content: "lorem 1",
      author: { firstName: "D", lastName: "B", username: "abc", id: "abc"},
      parentId: "1",
      createdAt: new Date(),
      requestId: "r1"
    },
  ];

  @action
  public async getCommentsOfRequest(requestId: string) {
    const comments = await commentService.getAllCommentsOfRequest(requestId);
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
