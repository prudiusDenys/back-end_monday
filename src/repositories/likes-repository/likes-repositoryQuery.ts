import {Likes} from '../../mongoose/models';


export class LikesRepositoryQuery {
  async getLikesCount(commentId: string) {
    return Likes.countDocuments({myStatus: 'Like', parentId: commentId})
  }

  async getDislikesCount(commentId: string) {
    return Likes.countDocuments({myStatus: 'Dislike', parentId: commentId})
  }

  async getMyStatus(commentId: string, userId: string) {
    const res = await Likes.findOne({parentId: commentId, userId}).lean().select('-__v -_id')
    if (res) {
      return res.myStatus
    } else {
      return 'None'
    }
  }
}
