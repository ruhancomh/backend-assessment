import { MaxPostsPerDayExceededError } from '../../../data/errors/max-posts-per-day-exceeded-error'
import { PostNotFoundError } from '../../../data/errors/post-not-found-error'
import { RepostingRepostTypeError } from '../../../data/errors/reposting-repost-type-error'
import { RepostingSelfPostError } from '../../../data/errors/reposting-self-post-error'
import { UserNotFoundError } from '../../../data/errors/user-not-found-error'
import { PostTypes } from '../../../domain/enums/post-types'
import { IPostModel } from '../../../domain/models/post-model'
import { RepostPostModel } from '../../../domain/protocols/repost-post-model'
import { IRepostPost } from '../../../domain/usecases/post/repost-post'
import { BadRequestError } from '../../errors/bad-request-error'
import { InternalServerError } from '../../errors/internal-server-error'
import { ResourceNotFoundError } from '../../errors/resource-not-found-error'
import { HttpRequest } from '../../protocols/http-request'
import { Validator } from '../../protocols/validator'
import { RepostPostController } from './repost-post-controller'

describe('RepostPost Controller', () => {
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

  test('Should call repostPost with correct value', async () => {
    // Arrange
    const { sut, repostPostStub } = makeSut()
    const createSpy = jest.spyOn(repostPostStub, 'repost')
    const fakeRequest = makeFakeRequest()

    // Act
    await sut.handle(fakeRequest)

    // Assert
    expect(createSpy).toBeCalledWith({ orginalPostId: '321', authorId: '123' })
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
    expect(httpResponse.body.author).toBe('123')
    expect(httpResponse.body.originalPost).toBe('321')
    expect(httpResponse.body.type).toBe(PostTypes.REPOST)
  })

  test('Should return 500 if RepostPost throws', async () => {
    // Arrange
    const { sut, repostPostStub } = makeSut()

    jest.spyOn(repostPostStub, 'repost').mockImplementationOnce(() => {
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
    const { sut, repostPostStub } = makeSut()
    const fakeRequest = makeFakeRequest()

    jest.spyOn(repostPostStub, 'repost').mockImplementationOnce(() => {
      throw new UserNotFoundError('123')
    })

    // Act
    const httpResponse = await sut.handle(fakeRequest)

    // Assert
    expect(httpResponse.statusCode).toBe(404)
    expect(httpResponse.body).toEqual(new ResourceNotFoundError('User not found for id: 123'))
  })

  test('Should return 404 if no post found', async () => {
    // Arrange
    const { sut, repostPostStub } = makeSut()
    const fakeRequest = makeFakeRequest()

    jest.spyOn(repostPostStub, 'repost').mockImplementationOnce(() => {
      throw new PostNotFoundError('321')
    })

    // Act
    const httpResponse = await sut.handle(fakeRequest)

    // Assert
    expect(httpResponse.statusCode).toBe(404)
    expect(httpResponse.body).toEqual(new ResourceNotFoundError('Post not found for id: <321>'))
  })

  test('Should return 400 if user exceed max number of posts per day', async () => {
    // Arrange
    const { sut, repostPostStub } = makeSut()
    const fakeRequest = makeFakeRequest()

    jest.spyOn(repostPostStub, 'repost').mockImplementationOnce(() => {
      throw new MaxPostsPerDayExceededError('123', 5)
    })

    // Act
    const httpResponse = await sut.handle(fakeRequest)

    // Assert
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new BadRequestError('User <123> exceeded the max number of posts per day of <5>'))
  })

  test('Should return 400 if user trying to reposting self post', async () => {
    // Arrange
    const { sut, repostPostStub } = makeSut()
    const fakeRequest = makeFakeRequest()

    jest.spyOn(repostPostStub, 'repost').mockImplementationOnce(() => {
      throw new RepostingSelfPostError('123', '321')
    })

    // Act
    const httpResponse = await sut.handle(fakeRequest)

    // Assert
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new BadRequestError('User <123> are not allowed to repost self post <321>.'))
  })

  test('Should return 400 if user trying to reposting a post of type repost', async () => {
    // Arrange
    const { sut, repostPostStub } = makeSut()
    const fakeRequest = makeFakeRequest()

    jest.spyOn(repostPostStub, 'repost').mockImplementationOnce(() => {
      throw new RepostingRepostTypeError('321')
    })

    // Act
    const httpResponse = await sut.handle(fakeRequest)

    // Assert
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new BadRequestError('User can not repost the post <321> of type <repost>.'))
  })
})

interface SutTypes {
  sut: RepostPostController
  repostPostStub: IRepostPost
  validatorStub: Validator
}

class RepostPostStub implements IRepostPost {
  async repost (repostData: RepostPostModel): Promise<IPostModel> {
    return await Promise.resolve({
      id: '123',
      author: repostData.authorId,
      originalPost: repostData.orginalPostId,
      type: PostTypes.REPOST,
      createdAt: new Date('2022-06-13T10:00:00')
    })
  }
}

class ValidatorStub implements Validator {
  validate (input: any): void {
  }
}

const makeSut = (): SutTypes => {
  const repostPostStub = new RepostPostStub()
  const validatorStub = new ValidatorStub()

  return {
    sut: new RepostPostController(repostPostStub, validatorStub),
    repostPostStub: repostPostStub,
    validatorStub: validatorStub
  }
}

const makeFakeRequest = (): HttpRequest => {
  return {
    params: {
      postId: '321'
    },
    body: {
      authorId: '123'
    }
  }
}
