import { PostTypes } from '../../../../domain/enums/post-types'
import { IPostModel } from '../../../../domain/models/post-model'
import { IFindPaginatedPostsRepository } from '../../../protocols/repositories/post/find-paginated-posts-repository'
import { DbFindPosts } from './db-find-posts'

describe('DbFindPosts UseCse', () => {
  test('Should throw if PostRepository throws', async () => {
    // Arrange
    const { sut, postRepositoryStub } = makeSut()

    jest.spyOn(postRepositoryStub, 'findPaginated')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

    // Act
    const result = sut.find()

    // Assert
    await expect(result).rejects.toThrow()
  })

  test('Should call PostRepository with correct values', async () => {
    // Arrange
    const { sut, postRepositoryStub } = makeSut()

    const findPaginatedSpy = jest.spyOn(postRepositoryStub, 'findPaginated')

    const perPage = 5
    const page = 1
    const userId = '222'
    const startDateString = '2022-06-12T00:00:00.224Z'
    const endDateString = '2022-06-20T00:00:00.224Z'

    const expectedLimit = 5
    const expectedSkip = 0
    const expectedStartDate = new Date(startDateString)
    const expectedEndDate = new Date(endDateString)

    // Act
    await sut.find(perPage, page, userId, startDateString, endDateString)

    // Assert
    expect(findPaginatedSpy).toHaveBeenCalledWith(expectedLimit, expectedSkip, userId, expectedStartDate, expectedEndDate)
  })

  test('Should return an array of posts on success', async () => {
    // Arrange
    const { sut } = makeSut()

    const perPage = 5
    const page = 1
    const userId = '222'
    const startDateString = '2022-06-12T00:00:00.224Z'
    const endDateString = '2022-06-20T00:00:00.224Z'

    const expectedResult = [
      {
        id: '123',
        message: 'foo_bar',
        author: '222',
        type: PostTypes.ORIGINAL,
        createdAt: new Date('2022-06-13T10:00:00')
      },
      {
        id: '456',
        message: 'foo_bar_foo',
        author: '222',
        type: PostTypes.ORIGINAL,
        createdAt: new Date('2022-06-14T10:00:00')
      }
    ]

    // Act
    const posts = await sut.find(perPage, page, userId, startDateString, endDateString)

    // Assert
    expect(posts).toEqual(expectedResult)
  })

  test('Should call PostRepository with default values if no parameter is given', async () => {
    // Arrange
    const { sut, postRepositoryStub } = makeSut()

    const findPaginatedSpy = jest.spyOn(postRepositoryStub, 'findPaginated')

    const expectedLimit = 10
    const expectedSkip = 0
    const expectedStartDate = null
    const expectedEndDate = null
    const expectedUserId = null

    // Act
    await sut.find()

    // Assert
    expect(findPaginatedSpy).toHaveBeenCalledWith(expectedLimit, expectedSkip, expectedUserId, expectedStartDate, expectedEndDate)
  })

  test('Should call PostRepository with default values if null parameters is given', async () => {
    // Arrange
    const { sut, postRepositoryStub } = makeSut()

    const findPaginatedSpy = jest.spyOn(postRepositoryStub, 'findPaginated')

    const expectedLimit = 10
    const expectedSkip = 0
    const expectedStartDate = null
    const expectedEndDate = null
    const expectedUserId = null

    // Act
    await sut.find(null, null, null, null, null)

    // Assert
    expect(findPaginatedSpy).toHaveBeenCalledWith(expectedLimit, expectedSkip, expectedUserId, expectedStartDate, expectedEndDate)
  })
})

interface SutTypes {
  sut: DbFindPosts
  postRepositoryStub: PostRepositoryStub
}

class PostRepositoryStub implements IFindPaginatedPostsRepository {
  async findPaginated (limit: number, skip: number, userId: string | null, startDate: Date | null, endDate: Date | null): Promise<IPostModel[]> {
    return [
      {
        id: '123',
        message: 'foo_bar',
        author: '222',
        type: PostTypes.ORIGINAL,
        createdAt: new Date('2022-06-13T10:00:00')
      },
      {
        id: '456',
        message: 'foo_bar_foo',
        author: '222',
        type: PostTypes.ORIGINAL,
        createdAt: new Date('2022-06-14T10:00:00')
      }
    ]
  }
}

const makeSut = (): SutTypes => {
  const postRepositoryStub = new PostRepositoryStub()
  const sut = new DbFindPosts(postRepositoryStub)

  return {
    sut: sut,
    postRepositoryStub: postRepositoryStub
  }
}
