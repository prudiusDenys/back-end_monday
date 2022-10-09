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

export const normalizeAllBlogsAndPosts = (data: any) => {
  return {
    pagesCount: data.pagesCount,
    page: +data.pageNumber,
    pageSize: +data.pageSize,
    totalCount: data.totalCount,
    items: removeMongoId(data.items)
  }
}
