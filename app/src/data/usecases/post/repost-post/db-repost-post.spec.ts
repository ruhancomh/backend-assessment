import { PostTypes } from '../../../../domain/enums/post-types'
import { IPostModel } from '../../../../domain/models/post-model'
import { IUserModel } from '../../../../domain/models/user-model'
import { RepostPostModel } from '../../../../domain/protocols/repost-post-model'
import { IValidateMaxPostsDayByAuthor } from '../../../../domain/usecases/post/validate-max-posts-day-by-author'
import { IGetUser } from '../../../../domain/usecases/user/get-user'
import { MaxPostsPerDayExceededError } from '../../../errors/max-posts-per-day-exceeded-error'
import { PostNotFoundError } from '../../../errors/post-not-found-error'
import { RepostingRepostTypeError } from '../../../errors/reposting-repost-type-error'
import { RepostingSelfPostError } from '../../../errors/reposting-self-post-error'
import { DbCreatePostModel } from '../../../protocols/dtos/db-create-post-model'
import { ICreatePostRepository } from '../../../protocols/repositories/post/create-post-repository'
import { IFindPostByIdRepository } from '../../../protocols/repositories/post/find-post-by-id-repository'
import { DbRepostPost } from './db-repost-post'

describe('DbRepostPost UseCase', () => {
  test('Should throw if PostRepository throws', async () => {
    // Arrange
    const { sut, postRepositoryStub } = makeSut()
    const repostData: RepostPostModel = {
      orginalPostId: '777',
      authorId: '123'
    }

    jest.spyOn(postRepositoryStub, 'findById')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

    // Act
    const result = sut.repost(repostData)

    // Assert
    await expect(result).rejects.toThrow()
  })

  test('Should throw if IValidateMaxPostsDayByAuthor throws', async () => {
    // Arrange
    const { sut, validateMaxPostsDayByAuthorStub } = makeSut()
    const repostData: RepostPostModel = {
      orginalPostId: '777',
      authorId: '123'
    }

    jest.spyOn(validateMaxPostsDayByAuthorStub, 'pass')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

    // Act
    const result = sut.repost(repostData)

    // Assert
    await expect(result).rejects.toThrow()
  })

  test('Should call PostRepository with correct values', async () => {
    // Arrange
    const { sut, postRepositoryStub } = makeSut()
    const repostData: RepostPostModel = {
      orginalPostId: '777',
      authorId: '123'
    }

    const createSpy = jest.spyOn(postRepositoryStub, 'create')
    const finByIdSpy = jest.spyOn(postRepositoryStub, 'findById')

    // Act
    await sut.repost(repostData)

    // Assert
    expect(createSpy).toHaveBeenCalledWith({
      originalPostId: repostData.orginalPostId,
      type: PostTypes.REPOST,
      authorId: repostData.authorId
    })

    expect(finByIdSpy).toHaveBeenCalledWith(repostData.orginalPostId)
  })

  test('Should call validateMaxPostsDayByAuthor with correct values', async () => {
    // Arrange
    const { sut, validateMaxPostsDayByAuthorStub } = makeSut()
    const repostData: RepostPostModel = {
      orginalPostId: '123',
      authorId: '123'
    }
    const passSpy = jest.spyOn(validateMaxPostsDayByAuthorStub, 'pass')

    // Act
    await sut.repost(repostData)

    // Assert
    expect(passSpy).toHaveBeenCalledWith(repostData.authorId)
  })

  test('Should throw MaxPostsPerDayExceededError if user exceed max number of posts per day', async () => {
    // Arrange
    const { sut, validateMaxPostsDayByAuthorStub } = makeSut()
    const repostData: RepostPostModel = {
      orginalPostId: '123',
      authorId: '123'
    }

    jest.spyOn(validateMaxPostsDayByAuthorStub, 'pass')
      .mockReturnValueOnce(new Promise((resolve, reject) => resolve(false)))

    // Act
    const result = sut.repost(repostData)

    // Assert
    await expect(result).rejects.toThrow(MaxPostsPerDayExceededError)
  })

  test('Should throw RepostSelfPostError if user trying repost self post', async () => {
    // Arrange
    const { sut, postRepositoryStub } = makeSut()
    const repostData: RepostPostModel = {
      orginalPostId: '123',
      authorId: '123'
    }

    jest.spyOn(postRepositoryStub, 'findById')
      .mockReturnValueOnce(new Promise((resolve, reject) => resolve({
        id: '123',
        message: 'foo_bar',
        author: '123',
        type: PostTypes.ORIGINAL,
        createdAt: new Date('2022-06-13T10:00:00')
      })))

    // Act
    const result = sut.repost(repostData)

    // Assert
    await expect(result).rejects.toThrow(RepostingSelfPostError)
  })

  test('Should throw RepostingRepostTypeError if user trying repost a post of type repost', async () => {
    // Arrange
    const { sut, postRepositoryStub } = makeSut()
    const repostData: RepostPostModel = {
      orginalPostId: '777',
      authorId: '123'
    }

    jest.spyOn(postRepositoryStub, 'findById')
      .mockReturnValueOnce(new Promise((resolve, reject) => resolve({
        id: '777',
        message: 'foo_bar',
        author: '555',
        type: PostTypes.REPOST,
        createdAt: new Date('2022-06-13T10:00:00')
      })))

    // Act
    const result = sut.repost(repostData)

    // Assert
    await expect(result).rejects.toThrow(RepostingRepostTypeError)
  })

  test('Should throw PostNotFoundError if no original post found for id', async () => {
    // Arrange
    const { sut, postRepositoryStub } = makeSut()
    const repostData: RepostPostModel = {
      orginalPostId: '777',
      authorId: '123'
    }

    jest.spyOn(postRepositoryStub, 'findById')
      .mockReturnValueOnce(new Promise((resolve, reject) => resolve(null)))

    // Act
    const result = sut.repost(repostData)

    // Assert
    await expect(result).rejects.toThrow(PostNotFoundError)
  })

  test('Should return an post on success', async () => {
    // Arrange
    const { sut } = makeSut()
    const repostData: RepostPostModel = {
      orginalPostId: '777',
      authorId: '123'
    }
    const expectedPost: IPostModel = {
      id: '666',
      originalPost: repostData.orginalPostId,
      author: '123',
      type: PostTypes.REPOST,
      createdAt: new Date('2022-06-13T10:00:00')
    }

    // Act
    const user = await sut.repost(repostData)

    // Assert
    expect(user).toEqual(expectedPost)
  })
})

interface SutTypes {
  sut: DbRepostPost
  postRepositoryStub: PostRepositoryStub
  getUserStub: GetUserStub
  validateMaxPostsDayByAuthorStub: ValidateMaxPostsDayByAuthorStub
}

class ValidateMaxPostsDayByAuthorStub implements IValidateMaxPostsDayByAuthor {
  async pass (authorId: string): Promise<boolean> {
    return true
  }

  getMaxPostsPerDay (): number {
    return 5
  }
}

class GetUserStub implements IGetUser {
  async get (id: string): Promise<IUserModel> {
    const fakeUser: IUserModel = {
      id: id,
      username: 'fooBar'
    }

    return fakeUser
  }
}

class PostRepositoryStub implements ICreatePostRepository, IFindPostByIdRepository {
  async create (postData: DbCreatePostModel): Promise<IPostModel> {
    const fakePost: IPostModel = {
      id: '666',
      author: postData.authorId,
      type: postData.type,
      originalPost: postData.originalPostId,
      createdAt: new Date('2022-06-13T10:00:00')
    }

    return fakePost
  }

  async findById (postId: string): Promise<IPostModel | null> {
    const fakePost: IPostModel = {
      id: '777',
      message: 'foo_bar',
      author: '555',
      type: PostTypes.ORIGINAL,
      createdAt: new Date('2022-06-13T10:00:00')
    }

    return fakePost
  }
}

const makeSut = (): SutTypes => {
  const postRepositoryStub = new PostRepositoryStub()
  const getUserStub = new GetUserStub()
  const validateMaxPostsDayByAuthorStub = new ValidateMaxPostsDayByAuthorStub()
  const sut = new DbRepostPost(postRepositoryStub, getUserStub, validateMaxPostsDayByAuthorStub)

  return {
    sut: sut,
    postRepositoryStub: postRepositoryStub,
    getUserStub: getUserStub,
    validateMaxPostsDayByAuthorStub: validateMaxPostsDayByAuthorStub
  }
}
