import {comments} from '../db';
import {User} from '../../utils/interfaces';

interface ReturnData {
  status: 404 | 403 | 204
}

export const commentsRepository = {
  async updateComment(commentId: string, content: string, user: User): Promise<ReturnData> {
    const comment = await comments.findOne({id: commentId})

    if (!comment) return {status: 404}
    if (comment.userId !== user.id) return {status: 403}

    await comments.updateOne({id: commentId}, {$set: {content}})

    return {status: 204}
  },
  async deleteComment(commentId: string, user: User): Promise<ReturnData> {
    const comment = await comments.findOne({id: commentId})

    if (!comment) return {status: 404}
    if (comment.userId !== user.id) return {status: 403}

    await comments.deleteOne({id: commentId})

    return {status: 204}
  }
}
