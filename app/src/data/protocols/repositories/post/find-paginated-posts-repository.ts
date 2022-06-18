
export interface IFindPaginatedPostsRepository {
  findPaginated: (limit: number, skip: number, userId: string | null, startDate: Date | null, endDate: Date | null) => Promise<IPostModel[]>
}
