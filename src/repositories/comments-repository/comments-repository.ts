import {comments} from '../db';


export const commentsRepository = {
  async updateComment(commentId: string, content: string): Promise<number> {
    const res = await comments.updateOne({id: commentId}, {$set: {content}})
    return res.matchedCount
  },
  async deleteComment(commentId: string): Promise<number> {
    const res = await comments.deleteOne({id: commentId})
    return res.deletedCount
  }
}
