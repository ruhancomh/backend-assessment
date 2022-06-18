import { IPostModel } from '../../../../domain/models/post-model'
import { IFindPosts } from '../../../../domain/usecases/post/find-posts'
import { IFindPaginatedPostsRepository } from '../../../protocols/repositories/post/find-paginated-posts-repository'

export class DbFindPosts implements IFindPosts {
  static readonly MAX_POSTS_PER_PAGE = 10

  private readonly postRepository: IFindPaginatedPostsRepository

  constructor (postRepository: IFindPaginatedPostsRepository) {
    this.postRepository = postRepository
  }

  async find (perPage?: number | null,
    page?: number | null, userId?: string | null, startDateString?: string | null, endDateString?: string | null): Promise<IPostModel[]> {
    if (page === undefined || page === null || page === 0) {
      page = 1
    }

    if (perPage === undefined || perPage === null || perPage > DbFindPosts.MAX_POSTS_PER_PAGE) {
      perPage = DbFindPosts.MAX_POSTS_PER_PAGE
    }

    const limit = perPage * 1
    const skip = (page - 1) * perPage

    if (userId === undefined) {
      userId = null
    }

    let startDate: Date | null = null
    let endDate: Date | null = null

    if (startDateString !== undefined && startDateString !== null) {
      startDate = new Date(startDateString)
    }

    if (endDateString !== undefined && endDateString !== null) {
      endDate = new Date(endDateString)
    }

    return await this.postRepository.findPaginated(limit, skip, userId, startDate, endDate)
  }
}
