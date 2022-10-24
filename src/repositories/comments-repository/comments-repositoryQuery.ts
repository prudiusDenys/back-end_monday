import {comments} from '../db';
import {Comment} from '../../utils/interfaces';


export const commentsRepositoryQuery = {
  async findComment(commentId: string):Promise<Comment | null> {
    return comments.findOne({id: commentId}, {projection: {_id: 0}})
  }
}
