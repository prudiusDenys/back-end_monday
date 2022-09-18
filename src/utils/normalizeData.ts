export const removeMongoId = (data: any) => {
  if (Array.isArray(data)) {
    return data.map((item: any) => {
      delete item['_id']
      return item
    })
  } else {
    delete data['_id']
    return data
  }
}
