import { ICountPostsByAuthorInDateRangeRepository } from '../../../protocols/repositories/post/count-posts-by-author-in-date-range-repository'
import { DbValidateMaxPostsDayByAuthor } from './db-validate-max-posts-day-by-author'

describe('DbValidateMaxPostsDayByAuthor UseCase', () => {
  test('Should throw if PostRepository throws', async () => {
    // Arrange
    const { sut, postRepositoryStub } = makeSut()
    const authorId = '123'

    jest.spyOn(postRepositoryStub, 'countByAuthorInDateRange')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

    // Act
    const result = sut.pass(authorId)

    // Assert
    await expect(result).rejects.toThrow()
  })

  test('Should call PostRepository with correct values', async () => {
    // Arrange
    const { sut, postRepositoryStub } = makeSut()
    const authorId = '123'

    const startDate = new Date()
    startDate.setHours(0, 0, 0, 0)

    const endDate = new Date()
    endDate.setHours(23, 59, 59, 999)

    const countByAuthorInDateRangeSpy = jest.spyOn(postRepositoryStub, 'countByAuthorInDateRange')

    // Act
    await sut.pass(authorId)

    // Assert
    expect(countByAuthorInDateRangeSpy).toHaveBeenCalledWith(authorId, startDate, endDate)
  })

  test('Should return true if posts count is less than max posts per day', async () => {
    // Arrange
    const { sut } = makeSut()
    const authorId = '123'

    // Act
    const user = await sut.pass(authorId)

    // Assert
    expect(user).toBe(true)
  })

  test('Should return false if posts count is greater than max posts per day', async () => {
    // Arrange
    const { sut, postRepositoryStub } = makeSut()
    const authorId = '123'

    jest.spyOn(postRepositoryStub, 'countByAuthorInDateRange')
      .mockReturnValueOnce(new Promise((resolve, reject) => resolve(5)))

    // Act
    const user = await sut.pass(authorId)

    // Assert
    expect(user).toBe(false)
  })

  test('Should return the max number of posts per day on getMaxPostsPerDay', async () => {
    // Arrange
    const { sut } = makeSut()

    // Act
    const maxPostsPerDay = await sut.getMaxPostsPerDay()

    // Assert
    expect(maxPostsPerDay).toBe(DbValidateMaxPostsDayByAuthor.MAX_POSTS_DAY_BY_AUTHOR)
  })
})

interface SutTypes {
  sut: DbValidateMaxPostsDayByAuthor
  postRepositoryStub: PostRepositoryStub
}

class PostRepositoryStub implements ICountPostsByAuthorInDateRangeRepository {
  async countByAuthorInDateRange (authorId: string, startDate: Date, endDate: Date): Promise<number> {
    return 4
  }
}

const makeSut = (): SutTypes => {
  const postRepositoryStub = new PostRepositoryStub()
  const sut = new DbValidateMaxPostsDayByAuthor(postRepositoryStub)

  return {
    sut: sut,
    postRepositoryStub: postRepositoryStub
  }
}
