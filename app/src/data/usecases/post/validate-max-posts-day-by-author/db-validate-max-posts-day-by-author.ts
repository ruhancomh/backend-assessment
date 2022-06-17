import { IValidateMaxPostsDayByAuthor } from '../../../../domain/usecases/post/validate-max-posts-day-by-author'
import { ICountPostsByAuthorInDateRangeRepository } from '../../../protocols/repositories/post/count-posts-by-author-in-date-range-repository'

export class DbValidateMaxPostsDayByAuthor implements IValidateMaxPostsDayByAuthor {
  static readonly MAX_POSTS_DAY_BY_AUTHOR = 5

  private readonly postsRepository: ICountPostsByAuthorInDateRangeRepository

  constructor (postsRepository: ICountPostsByAuthorInDateRangeRepository) {
    this.postsRepository = postsRepository
  }

  async pass (authorId: string): Promise<boolean> {
    const startDate = new Date()
    startDate.setHours(0, 0, 0, 0)

    const endDate = new Date()
    endDate.setHours(23, 59, 59, 999)

    const countPosts = await this.postsRepository.countByAuthorInDateRange(authorId, startDate, endDate)

    return countPosts < DbValidateMaxPostsDayByAuthor.MAX_POSTS_DAY_BY_AUTHOR
  }

  getMaxPostsPerDay (): number {
    return DbValidateMaxPostsDayByAuthor.MAX_POSTS_DAY_BY_AUTHOR
  }
}
