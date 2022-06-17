import { UserNotFoundError } from '../../../data/errors/user-not-found-error'
import { IUserModel } from '../../../domain/models/user-model'
import { ICountPostsByAuthor } from '../../../domain/usecases/post/count-posts-by-author'
import { IGetUser } from '../../../domain/usecases/user/get-user'
import { InternalServerError } from '../../errors/internal-server-error'
import { ResourceNotFoundError } from '../../errors/resource-not-found-error'
import { HttpRequest } from '../../protocols/http-request'
import { IUserResponse } from '../../protocols/responses/user-response'
import { GetUserController } from './get-user-controller'

describe('GetUser Controller', () => {
  test('Should call getUser with correct userId', async () => {
    // Arrange
    const { sut, getUserStub } = makeSut()
    const getSpy = jest.spyOn(getUserStub, 'get')
    const fakeRequest = makeFakeRequest()

    // Act
    await sut.handle(fakeRequest)

    // Assert
    expect(getSpy).toBeCalledWith('507f191e810c19729de860ea')
  })

  test('Should call countPostsByAuthor with correct userId', async () => {
    // Arrange
    const { sut, countPostsByAuthorStub } = makeSut()
    const getSpy = jest.spyOn(countPostsByAuthorStub, 'count')
    const fakeRequest = makeFakeRequest()

    // Act
    await sut.handle(fakeRequest)

    // Assert
    expect(getSpy).toBeCalledWith('507f191e810c19729de860ea')
  })

  test('Should return an user and 200 on success', async () => {
    // Arrange
    const { sut } = makeSut()
    const fakeRequest = makeFakeRequest()
    const expectedUser: IUserResponse = {
      id: '507f191e810c19729de860ea',
      username: 'foo_bar',
      countPosts: 2,
      createdAt: '2022-06-13T13:00:00.000Z',
      createdAtFormated: 'Jun 13, 2022'
    }

    // Act
    const httpResponse = await sut.handle(fakeRequest)

    // Assert
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual(expectedUser)
  })

  test('Should return 404 if no user found', async () => {
    // Arrange
    const { sut, getUserStub } = makeSut()

    jest.spyOn(getUserStub, 'get').mockImplementationOnce(() => {
      throw new UserNotFoundError('507f191e810c19729de860ea')
    })

    const fakeRequest = makeFakeRequest()

    // Act
    const httpResponse = await sut.handle(fakeRequest)

    // Assert
    expect(httpResponse.statusCode).toBe(404)
    expect(httpResponse.body).toEqual(new ResourceNotFoundError('User not found for id: 507f191e810c19729de860ea'))
  })

  test('Should return 500 if GetUser throws', async () => {
    // Arrange
    const { sut, getUserStub } = makeSut()

    jest.spyOn(getUserStub, 'get').mockImplementationOnce(() => {
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
  sut: GetUserController
  getUserStub: IGetUser
  countPostsByAuthorStub: ICountPostsByAuthor
}

class GetUserStub implements IGetUser {
  async get (id: string): Promise<IUserModel> {
    return await Promise.resolve({
      id: id,
      username: 'foo_bar',
      createdAt: new Date('2022-06-13T10:00:00')
    })
  }
}

class CountPostsByAuthorStub implements ICountPostsByAuthor {
  async count (authorId: string): Promise<number> {
    return 2
  }
}

const makeSut = (): SutTypes => {
  const getUserStub = new GetUserStub()
  const countPostsByAuthorStub = new CountPostsByAuthorStub()

  return {
    sut: new GetUserController(getUserStub, countPostsByAuthorStub),
    getUserStub: getUserStub,
    countPostsByAuthorStub: countPostsByAuthorStub
  }
}

const makeFakeRequest = (): HttpRequest => {
  return {
    params: {
      userId: '507f191e810c19729de860ea'
    }
  }
}
