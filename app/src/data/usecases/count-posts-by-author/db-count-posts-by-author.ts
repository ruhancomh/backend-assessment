import { ICountPostsByAuthor } from '../../../domain/usecases/post/count-posts-by-author'
import { ICountPostsByAuthorRepository } from '../../protocols/repositories/post/count-posts-by-author-repository'

export class DbCountPostsByAuthor implements ICountPostsByAuthor {
  private readonly postRepository: ICountPostsByAuthorRepository

  constructor (postRepository: ICountPostsByAuthorRepository) {
    this.postRepository = postRepository
  }

  async count (authorId: string): Promise<number> {
    return await this.postRepository.countByAuthor(authorId)
  }
}
