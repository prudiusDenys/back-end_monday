import {User} from '../../utils/interfaces';
import {Users} from '../../mongoose/models';

export const usersRepository = {
  async findUserByEmail(email: string) {
    return Users.findOne({'accountData.email': email}).select('-__v -_id')
  },
  async findUserById(id: string) {
    return Users.findOne({id}).select('-__v -_id')
  },
  async findUserByConfirmationCode(code: string) {
    return Users.findOne({'emailConfirmation.confirmationCode': code}).select('-__v -_id')
  },
  async findUserByLogin(login: string) {
    return Users.findOne({'accountData.login': login}).select('-__v -_id')
  },
  async createUser(newUser: User) {
    return Users.create(newUser)
  },
  async updateConfirmation(userId: string) {
    const res = await Users.updateOne({id: userId}, {$set: {'emailConfirmation.isConfirmed': true}})
    return !!res.matchedCount
  },
  async updateConfirmationCode(id: string, newConfirmationCode: string) {
    return Users.findOneAndUpdate(
      {id},
      {$set: {'emailConfirmation.confirmationCode': newConfirmationCode}},
      {returnDocument: 'after'}
    ).select('-__v -_id')
  },
  async deleteUser(userId: string) {
    const res = await Users.deleteOne({id: userId})
    return res.deletedCount
  }
}
