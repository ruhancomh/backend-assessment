import { DbCreatePostModel } from '../../../../../data/protocols/dtos/db-create-post-model'
import { PostTypes } from '../../../../../domain/enums/post-types'
import { MongoHelper } from '../../helpers/mongo-helper'
import { PostMongoModel } from '../../models/post-model'
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

  test('Should return a post on create with originalPost with success', async () => {
    // Arrange
    const sut = makeSut()

    const userData = new UserMongoModel()
    userData.username = 'fooBar'
    await userData.save()

    const originalPostData = new PostMongoModel()
    originalPostData.message = 'foo_bar'
    originalPostData.author = userData.id
    originalPostData.type = PostTypes.ORIGINAL

    await originalPostData.save()
    const originalPostId: string = originalPostData.id

    const postData: DbCreatePostModel = {
      originalPostId: originalPostId,
      authorId: userData.id,
      type: PostTypes.ORIGINAL
    }

    // Act
    const post = await sut.create(postData)

    // Assert
    expect(post).toBeTruthy()
    expect(post.id).toBeTruthy()
    expect(post.author.toString()).toBe(postData.authorId)
    expect(String(post.originalPost)).toBe(originalPostId)
    expect(post.type).toBe(PostTypes.ORIGINAL)
    expect(post.createdAt).toBeTruthy()
  })

  test('Should return zero on countByAuthor if no documents found', async () => {
    // Arrange
    const sut = makeSut()

    const userData = new UserMongoModel()
    userData.username = 'fooBar'
    await userData.save()

    // Act
    const count = await sut.countByAuthor(userData.id)

    // Assert
    expect(count).toBe(0)
  })

  test('Should return 2 on countByAuthor', async () => {
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

    await sut.create(postData)
    await sut.create(postData)

    // Act
    const count = await sut.countByAuthor(userData.id)

    // Assert
    expect(count).toBe(2)
  })

  test('Should return zero on countByAuthorInDateRange if no documents found', async () => {
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

    await sut.create(postData)
    await sut.create(postData)

    const startDate = new Date()
    startDate.setHours(0, 0, 0)
    startDate.setFullYear(1990)

    const endDate = new Date()
    endDate.setHours(23, 59, 59)
    endDate.setFullYear(1990)

    // Act
    const count = await sut.countByAuthorInDateRange(userData.id, startDate, endDate)

    // Assert
    expect(count).toBe(0)
  })

  test('Should return 2 on countByAuthorInDateRange', async () => {
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

    await sut.create(postData)
    await sut.create(postData)

    const startDate = new Date()
    startDate.setHours(0, 0, 0)

    const endDate = new Date()
    endDate.setHours(23, 59, 59)

    // Act
    const count = await sut.countByAuthorInDateRange(userData.id, startDate, endDate)

    // Assert
    expect(count).toBe(2)
  })

  test('Should return an post on findById with success', async () => {
    // Arrange
    const sut = makeSut()
    const userData = new UserMongoModel()
    userData.username = 'fooBar'
    await userData.save()

    const postData = new PostMongoModel()
    postData.message = 'foo_bar'
    postData.author = userData.id
    postData.type = PostTypes.ORIGINAL

    await postData.save()

    // Act
    const post = await sut.findById(postData.id)

    // Assert
    expect(post).toBeTruthy()
    expect(post?.id).toBe(postData.id)
    expect(post?.message).toBe('foo_bar')
    expect(post?.type).toBe(PostTypes.ORIGINAL)
    expect(post?.createdAt).toBeTruthy()
  })

  test('Should return null on findById if no record found', async () => {
    // Arrange
    const sut = makeSut()
    const postId = '507f1f77bcf86cd799439011'
    // Act
    const post = await sut.findById(postId)

    // Assert
    expect(post).toBe(null)
  })
})

const makeSut = (): PostMongoRepository => {
  return new PostMongoRepository()
}
