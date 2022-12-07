import {Comment} from '../../utils/interfaces';
import {Comments} from '../../mongoose/models';


export const commentsRepositoryQuery = {
  async findComment(commentId: string):Promise<Comment | null> {
    return Comments.findOne({id: commentId}).select('-__v -_id -parentId')
  }
}
