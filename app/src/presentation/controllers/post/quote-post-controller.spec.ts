import { MaxPostsPerDayExceededError } from "../../../data/errors/max-posts-per-day-exceeded-error"
import { PostNotFoundError } from "../../../data/errors/post-not-found-error"
import { QuoteSelfPostError } from "../../../data/errors/quote-self-post-error"
import { QuotingQuoteTypeError } from "../../../data/errors/quoting-quote-type-error"
import { UserNotFoundError } from "../../../data/errors/user-not-found-error"
import { PostTypes } from "../../../domain/enums/post-types"
import { IPostModel } from "../../../domain/models/post-model"
import { QuotePostModel } from "../../../domain/protocols/quote-post-model"
import { IQuotePost } from "../../../domain/usecases/post/quote-post"
import { BadRequestError } from "../../errors/bad-request-error"
import { InternalServerError } from "../../errors/internal-server-error"
import { ResourceNotFoundError } from "../../errors/resource-not-found-error"
import { HttpRequest } from "../../protocols/http-request"
import { Validator } from "../../protocols/validator"
import { QuotePostController } from "./quote-post-controller"

describe('QuotePost Controller', () => {
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

  test('Should call quotePost with correct value', async () => {
    // Arrange
    const { sut, quotePostStub } = makeSut()
    const createSpy = jest.spyOn(quotePostStub, 'quote')
    const fakeRequest = makeFakeRequest()

    // Act
    await sut.handle(fakeRequest)

    // Assert
    expect(createSpy).toBeCalledWith({
      orginalPostId: '321',
      authorId: '123',
      message: 'foo bar'
    })
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
    expect(httpResponse.body.type).toBe(PostTypes.QUOTE)
    expect(httpResponse.body.message).toBe('foo bar')
  })

  test('Should return 500 if QuotPost throws', async () => {
    // Arrange
    const { sut, quotePostStub } = makeSut()

    jest.spyOn(quotePostStub, 'quote').mockImplementationOnce(() => {
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
    const { sut, quotePostStub } = makeSut()
    const fakeRequest = makeFakeRequest()

    jest.spyOn(quotePostStub, 'quote').mockImplementationOnce(() => {
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
    const { sut, quotePostStub } = makeSut()
    const fakeRequest = makeFakeRequest()

    jest.spyOn(quotePostStub, 'quote').mockImplementationOnce(() => {
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
    const { sut, quotePostStub } = makeSut()
    const fakeRequest = makeFakeRequest()

    jest.spyOn(quotePostStub, 'quote').mockImplementationOnce(() => {
      throw new MaxPostsPerDayExceededError('123', 5)
    })

    // Act
    const httpResponse = await sut.handle(fakeRequest)

    // Assert
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new BadRequestError('User <123> exceeded the max number of posts per day of <5>'))
  })

  test('Should return 400 if user trying to quoting self post', async () => {
    // Arrange
    const { sut, quotePostStub } = makeSut()
    const fakeRequest = makeFakeRequest()

    jest.spyOn(quotePostStub, 'quote').mockImplementationOnce(() => {
      throw new QuoteSelfPostError('123', '321')
    })

    // Act
    const httpResponse = await sut.handle(fakeRequest)

    // Assert
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new BadRequestError('User <123> are not allowed to quote self post <321>.'))
  })

  test('Should return 400 if user trying to quoting a post of type quote', async () => {
    // Arrange
    const { sut, quotePostStub } = makeSut()
    const fakeRequest = makeFakeRequest()

    jest.spyOn(quotePostStub, 'quote').mockImplementationOnce(() => {
      throw new QuotingQuoteTypeError('321')
    })

    // Act
    const httpResponse = await sut.handle(fakeRequest)

    // Assert
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new BadRequestError('User can not quote the post <321> of type <quote>.'))
  })
})

interface SutTypes {
  sut: QuotePostController
  quotePostStub: IQuotePost
  validatorStub: Validator
}

class QuotePostStub implements IQuotePost {
  async quote (quoteData: QuotePostModel): Promise<IPostModel> {
    return await Promise.resolve({
      id: '123',
      message: quoteData.message,
      author: quoteData.authorId,
      originalPost: quoteData.orginalPostId,
      type: PostTypes.QUOTE,
      createdAt: new Date('2022-06-13T10:00:00')
    })
  }
}

class ValidatorStub implements Validator {
  validate (input: any): void {
  }
}

const makeSut = (): SutTypes => {
  const quotePostStub = new QuotePostStub()
  const validatorStub = new ValidatorStub()

  return {
    sut: new QuotePostController(quotePostStub, validatorStub),
    quotePostStub: quotePostStub,
    validatorStub: validatorStub
  }
}

const makeFakeRequest = (): HttpRequest => {
  return {
    params: {
      postId: '321'
    },
    body: {
      message: 'foo bar',
      authorId: '123'
    }
  }
}
