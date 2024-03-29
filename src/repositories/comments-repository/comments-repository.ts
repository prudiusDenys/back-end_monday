import {User} from '../../utils/interfaces';
import {Comments, Likes} from '../../mongoose/models';

interface ReturnData {
  status: 404 | 403 | 204
}

export class CommentsRepository {
  async updateComment(commentId: string, content: string, user: User): Promise<ReturnData> {
    const comment = await Comments.findOne({id: commentId}).select('-__v -_id')

    if (!comment) return {status: 404}
    if (comment.userId !== user.id) return {status: 403}

    await Comments.updateOne({id: commentId}, {$set: {content}})

    return {status: 204}
  }

  async deleteComment(commentId: string, user: User): Promise<ReturnData> {
    const comment = await Comments.findOne({id: commentId}).select('-__v -_id')

    if (!comment) return {status: 404}
    if (comment.userId !== user.id) return {status: 403}

    await Comments.deleteOne({id: commentId})

    return {status: 204}
  }
}
