import http from '../httpService';
import { CreateCommentInput } from './dto/createCommentInput';

export type Comment = {
  id: string;
  content: string;
  parentId: string;
  requestId: string;
  author: CommentAuthor;
  createdAt: Date;
};

export type CommentDeleted = {
  id: string;
}

export type CommentAuthor = {
  firstName: string;
  lastName: string;
}

class CommentService {
  public async getAllCommentsOfRequest(requestId: string, order: string) : Promise<Comment[]> {
    let result = await http.get(`api/request/${requestId}/comments/${order}`)
    return result.data;
  }

  public async create(createCommentInput: CreateCommentInput) : Promise<string> {
    let result = await http.post(`api/request/${createCommentInput.requestId}/comments`, createCommentInput)

    return result.data;
  }

  public async deleteCommentofRequest (comment: Comment,  requestId: string){
    let result = await http.delete(`api/request/${requestId}/comments/${comment.id}`);
    return result;
  }
}

export default new CommentService();
