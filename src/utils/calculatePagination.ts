export const calcPagesCount = (totalCount: number, pageSize: number) => {
  return Math.ceil(totalCount / pageSize)
}

export const calcSkipPages = (pageNumber: number, pageSize: number) => {
  return (pageNumber - 1) * pageSize
}
