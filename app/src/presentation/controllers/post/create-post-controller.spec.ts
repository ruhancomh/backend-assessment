import { MaxPostsPerDayExceededError } from '../../../data/errors/max-posts-per-day-exceeded-error'
import { UserNotFoundError } from '../../../data/errors/user-not-found-error'
import { PostTypes } from '../../../domain/enums/post-types'
import { IPostModel } from '../../../domain/models/post-model'
import { CreatePostModel } from '../../../domain/protocols/create-post-model'
import { ICreatePost } from '../../../domain/usecases/post/create-post'
import { InternalServerError } from '../../errors/internal-server-error'
import { ResourceNotFoundError } from '../../errors/resource-not-found-error'
import { HttpRequest } from '../../protocols/http-request'
import { Validator } from '../../protocols/validator'
import { CreatePostController } from './create-post-controller'

describe('CreatePost Controller', () => {
  test('Should call validator with correct value', async () => {
    // Arrange
    const { sut, validatorStub } = makeSut()
    const validateSpy = jest.spyOn(validatorStub, 'validate')
    const fakeRequest = makeFakeRequest()

    // Act
    await sut.handle(fakeRequest)

    // Assert
    expect(validateSpy).toBeCalledWith(fakeRequest)
  })

  test('Should call createPost with correct value', async () => {
    // Arrange
    const { sut, createPostStub } = makeSut()
    const createSpy = jest.spyOn(createPostStub, 'create')
    const fakeRequest = makeFakeRequest()

    // Act
    await sut.handle(fakeRequest)

    // Assert
    expect(createSpy).toBeCalledWith({ message: 'foo_bar', authorId: '123' })
  })

  test('Should return a post and 201 on success', async () => {
    // Arrange
    const { sut } = makeSut()
    const fakeRequest = makeFakeRequest()

    // Act
    const httpResponse = await sut.handle(fakeRequest)

    // Assert
    expect(httpResponse.statusCode).toBe(201)
    expect(httpResponse.body.id).toBeTruthy()
    expect(httpResponse.body.createdAt).toBeTruthy()
    expect(httpResponse.body.message).toBe('foo_bar')
    expect(httpResponse.body.author).toBe('123')
    expect(httpResponse.body.type).toBe(PostTypes.ORIGINAL)
  })

  test('Should return 500 if CreaPost throws', async () => {
    // Arrange
    const { sut, createPostStub } = makeSut()

    jest.spyOn(createPostStub, 'create').mockImplementationOnce(() => {
      throw new Error()
    })

    const fakeRequest = makeFakeRequest()

    // Act
    const httpResponse = await sut.handle(fakeRequest)

    // Assert
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new InternalServerError())
  })

  test('Should return 404 if no user found', async () => {
    // Arrange
    const { sut, createPostStub } = makeSut()
    const fakeRequest = makeFakeRequest()

    jest.spyOn(createPostStub, 'create').mockImplementationOnce(() => {
      throw new UserNotFoundError('123')
    })

    // Act
    const httpResponse = await sut.handle(fakeRequest)

    // Assert
    expect(httpResponse.statusCode).toBe(404)
    expect(httpResponse.body).toEqual(new ResourceNotFoundError('User not found for id: 123'))
  })

  test('Should return 400 if user exceed max number of posts per day', async () => {
    // Arrange
    const { sut, createPostStub } = makeSut()
    const fakeRequest = makeFakeRequest()

    jest.spyOn(createPostStub, 'create').mockImplementationOnce(() => {
      throw new MaxPostsPerDayExceededError('123', 5)
    })

    // Act
    const httpResponse = await sut.handle(fakeRequest)

    // Assert
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new ResourceNotFoundError('User <123> exceeded the max number of posts per day of <5>'))
  })
})

interface SutTypes {
  sut: CreatePostController
  createPostStub: ICreatePost
  validatorStub: Validator
}

class CreatePostStub implements ICreatePost {
  async create (createPostData: CreatePostModel): Promise<IPostModel> {
    return await Promise.resolve({
      id: '123',
      author: createPostData.authorId,
      message: createPostData.message,
      type: PostTypes.ORIGINAL,
      createdAt: new Date('2022-06-13T10:00:00')
    })
  }
}

class ValidatorStub implements Validator {
  validate (input: any): void {
  }
}

const makeSut = (): SutTypes => {
  const createPostStub = new CreatePostStub()
  const validatorStub = new ValidatorStub()

  return {
    sut: new CreatePostController(createPostStub, validatorStub),
    createPostStub: createPostStub,
    validatorStub: validatorStub
  }
}

const makeFakeRequest = (): HttpRequest => {
  return {
    body: {
      message: 'foo_bar',
      authorId: '123'
    }
  }
}
