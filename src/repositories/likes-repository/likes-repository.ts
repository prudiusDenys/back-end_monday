import {Comments, Likes} from '../../mongoose/models';

class LikesRepository {
  async updateLikeStatus(userId: string, commentId: string, likeStatus: string): Promise<boolean> {
    const comment = await Comments.findOne({id: commentId}).lean()

    if (!comment) return false

    const res = await Likes.updateOne({userId, parentId: commentId}, {
      $set: {
        myStatus: likeStatus
      }
    }, {upsert: true})

    return res.acknowledged
  }
}

export const likesRepository = new LikesRepository()
