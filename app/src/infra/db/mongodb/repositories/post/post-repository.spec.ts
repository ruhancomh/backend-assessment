import { DbCreatePostModel } from '../../../../../data/protocols/dtos/db-create-post-model'
import { PostTypes } from '../../../../../domain/enums/post-types'
import { MongoHelper } from '../../helpers/mongo-helper'
import { UserMongoModel } from '../../models/user-model'
import { PostMongoRepository } from './post-repository'

describe('Post Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect()
  })

  afterEach(async () => {
    await MongoHelper.clear()
  })

  afterAll(async () => {
    await MongoHelper.close()
  })

  test('Should return a post on create with success', async () => {
    // Arrange
    const sut = makeSut()

    const userData = new UserMongoModel()
    userData.username = 'fooBar'
    await userData.save()

    const postData: DbCreatePostModel = {
      message: 'foo_bar',
      authorId: userData.id,
      type: PostTypes.ORIGINAL
    }

    // Act
    const post = await sut.create(postData)

    // Assert
    expect(post).toBeTruthy()
    expect(post.id).toBeTruthy()
    expect(post.author.toString()).toBe(postData.authorId)
    expect(post.message).toBe('foo_bar')
    expect(post.type).toBe(PostTypes.ORIGINAL)
    expect(post.createdAt).toBeTruthy()
  })
})

const makeSut = (): PostMongoRepository => {
  return new PostMongoRepository()
}
