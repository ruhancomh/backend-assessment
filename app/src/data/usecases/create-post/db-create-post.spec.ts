import { PostTypes } from '../../../domain/enums/post-types'
import { IPostModel } from '../../../domain/models/post-model'
import { IUserModel } from '../../../domain/models/user-model'
import { CreatePostModel } from '../../../domain/protocols/create-post-model'
import { IGetUser } from '../../../domain/usecases/user/get-user'
import { DbCreatePostModel } from '../../protocols/dtos/db-create-post-model'
import { ICreatePostRepository } from '../../protocols/repositories/post/create-post-repository'
import { DbCreatePost } from './db-create-post'

describe('DbCreatePost UseCase', () => {
  test('Should throw if PostRepository throws', async () => {
    // Arrange
    const { sut, postRepositoryStub } = makeSut()
    const postData: CreatePostModel = {
      message: 'foo_bar',
      authorId: '123'
    }

    jest.spyOn(postRepositoryStub, 'create')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

    // Act
    const result = sut.create(postData)

    // Assert
    await expect(result).rejects.toThrow()
  })

  test('Should call PostRepository with correct values', async () => {
    // Arrange
    const { sut, postRepositoryStub } = makeSut()
    const postData: CreatePostModel = {
      message: 'foo_bar',
      authorId: '123'
    }
    const findByIdSpy = jest.spyOn(postRepositoryStub, 'create')

    // Act
    await sut.create(postData)

    // Assert
    expect(findByIdSpy).toHaveBeenCalledWith({
      message: postData.message,
      type: PostTypes.ORIGINAL,
      authorId: postData.authorId
    })
  })

  test('Should return an post on success', async () => {
    // Arrange
    const { sut } = makeSut()
    const postData: CreatePostModel = {
      message: 'foo_bar',
      authorId: '123'
    }
    const expectedPost: IPostModel = {
      id: '123',
      message: 'foo_bar',
      author: '123',
      type: PostTypes.ORIGINAL,
      createdAt: new Date('2022-06-13T10:00:00')
    }

    // Act
    const user = await sut.create(postData)

    // Assert
    expect(user).toEqual(expectedPost)
  })
})

interface SutTypes {
  sut: DbCreatePost
  postRepositoryStub: PostRepositoryStub
  getUserStub: GetUserStub
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
class PostRepositoryStub implements ICreatePostRepository {
  async create (postData: DbCreatePostModel): Promise<IPostModel> {
    const fakePost: IPostModel = {
      id: '123',
      message: postData.message,
      author: postData.authorId,
      type: postData.type,
      createdAt: new Date('2022-06-13T10:00:00')
    }

    return fakePost
  }
}

const makeSut = (): SutTypes => {
  const postRepositoryStub = new PostRepositoryStub()
  const getUserStub = new GetUserStub()
  const sut = new DbCreatePost(postRepositoryStub, getUserStub)

  return {
    sut: sut,
    postRepositoryStub: postRepositoryStub,
    getUserStub: getUserStub
  }
}
