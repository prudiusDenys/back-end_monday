import {Comment} from '../../utils/interfaces';
import {Comments} from '../../mongoose/models';

class CommentsRepositoryQuery {
  async findComment(commentId: string): Promise<Comment | null> {
    return Comments.findOne({id: commentId}).lean().select('-__v -_id -parentId')
  }
}

export const commentsRepositoryQuery = new CommentsRepositoryQuery()
