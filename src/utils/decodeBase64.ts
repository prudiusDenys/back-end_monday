export const decodeBase64 = (data: string) => {
  const base64Value = data.slice(6)
  const buff = Buffer.from(base64Value, 'base64')
  const loginPasswordValue = buff.toString('ascii')

  return loginPasswordValue.split(':')
}
