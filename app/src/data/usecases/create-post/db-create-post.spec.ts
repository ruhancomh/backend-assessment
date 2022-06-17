import { PostTypes } from '../../../domain/enums/post-types'
import { IPostModel } from '../../../domain/models/post-model'
import { CreatePostModel } from '../../../domain/protocols/create-post-model'
import { DbCreatePostModel } from '../../protocols/dtos/db-create-post-model'
import { ICreatePostRepository } from '../../protocols/repositories/post/create-post-repository'
import { DbCreatePost } from './db-create-post'

describe('DbCreatePost UseCase', () => {
  test('Should throw if PostRepository throws', async () => {
    // Arrange
    const { sut, postRepositoryStub } = makeSut()
    const postData: CreatePostModel = {
      message: 'foo_bar'
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
      message: 'foo_bar'
    }
    const findByIdSpy = jest.spyOn(postRepositoryStub, 'create')

    // Act
    await sut.create(postData)

    // Assert
    expect(findByIdSpy).toHaveBeenCalledWith({
      message: postData.message,
      type: PostTypes.ORIGINAL
    })
  })

  test('Should return an post on success', async () => {
    // Arrange
    const { sut } = makeSut()
    const postData: CreatePostModel = {
      message: 'foo_bar'
    }
    const expectedPost: IPostModel = {
      id: '123',
      message: 'foo_bar',
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
}

class PostRepositoryStub implements ICreatePostRepository {
  async create (postData: DbCreatePostModel): Promise<IPostModel> {
    const fakePost: IPostModel = {
      id: '123',
      message: postData.message,
      type: postData.type,
      createdAt: new Date('2022-06-13T10:00:00')
    }

    return fakePost
  }
}

const makeSut = (): SutTypes => {
  const postRepositoryStub = new PostRepositoryStub()
  const sut = new DbCreatePost(postRepositoryStub)

  return {
    sut: sut,
    postRepositoryStub: postRepositoryStub
  }
}
