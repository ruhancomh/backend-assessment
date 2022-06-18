import { PostTypes } from '../../../domain/enums/post-types'
import { IPostModel } from '../../../domain/models/post-model'
import { IFindPosts } from '../../../domain/usecases/post/find-posts'
import { InternalServerError } from '../../errors/internal-server-error'
import { HttpRequest } from '../../protocols/http-request'
import { FindPostsController } from './find-posts-controller'

describe('FindPosts Controller', () => {
  test('Should call findPost with correct value', async () => {
    // Arrange
    const { sut, findPostsStub } = makeSut()
    const createSpy = jest.spyOn(findPostsStub, 'find')
    const fakeRequest = makeFakeRequest()

    const perPage = 10
    const page = 1
    const userId = '62ad26ddcf02c24311a16376'
    const startDate = '2022-06-15T00:00:57.224Z'
    const endDate = '2022-06-20T23:14:57.224Z'

    // Act
    await sut.handle(fakeRequest)

    // Assert
    expect(createSpy).toBeCalledWith(perPage, page, userId, startDate, endDate)
  })

  test('Should return posts and 200 on success', async () => {
    // Arrange
    const { sut } = makeSut()
    const fakeRequest = makeFakeRequest()

    const expectedBody = [
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
    const httpResponse = await sut.handle(fakeRequest)

    // Assert
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual(expectedBody)
  })

  test('Should return empty array and 200 on success and no posts found', async () => {
    // Arrange
    const { sut, findPostsStub } = makeSut()

    jest.spyOn(findPostsStub, 'find').mockReturnValueOnce(Promise.resolve([]))

    const fakeRequest = makeFakeRequest()

    // Act
    const httpResponse = await sut.handle(fakeRequest)

    // Assert
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual([])
  })

  test('Should return 500 if FindPosts throws', async () => {
    // Arrange
    const { sut, findPostsStub } = makeSut()

    jest.spyOn(findPostsStub, 'find').mockImplementationOnce(() => {
      throw new Error()
    })

    const fakeRequest = makeFakeRequest()

    // Act
    const httpResponse = await sut.handle(fakeRequest)

    // Assert
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new InternalServerError())
  })
})

interface SutTypes {
  sut: FindPostsController
  findPostsStub: IFindPosts
}

class FindPostsStub implements IFindPosts {
  async find (perPage?: number | null, page?: number | null, userId?: string | null, startDateString?: string | null, endDateString?: string | null):
  Promise<IPostModel[]> {
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
  const findPostsStub = new FindPostsStub()

  return {
    sut: new FindPostsController(findPostsStub),
    findPostsStub: findPostsStub
  }
}

const makeFakeRequest = (): HttpRequest => {
  return {
    query: {
      page: 1,
      perPage: 10,
      userId: '62ad26ddcf02c24311a16376',
      startDate: '2022-06-15T00:00:57.224Z',
      endDate: '2022-06-20T23:14:57.224Z'
    }
  }
}
