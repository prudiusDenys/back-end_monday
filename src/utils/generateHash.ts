import bcrypt from 'bcrypt';


export const generateHash = async (saltNum: number, password: string) => {
  const salt = await bcrypt.genSalt(saltNum);
  return await bcrypt.hash(password, salt);
}
