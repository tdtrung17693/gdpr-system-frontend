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

export type CommentAuthor = {
  firstName: string;
  lastName: string;
}

class CommentService {
  public async getAllCommentsOfRequest(requestId: string) : Promise<Comment[]> {
    let result = await http.get(`api/request/${requestId}/comments`)
    return result.data;
  }

  public async create(createCommentInput: CreateCommentInput) : Promise<string> {
    let result = await http.post(`api/request/${createCommentInput.requestId}/comments`, createCommentInput)

    return result.data;
  }
}

export default new CommentService();
