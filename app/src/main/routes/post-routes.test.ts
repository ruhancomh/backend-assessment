import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'
import request from 'supertest'
import { PostTypes } from '../../domain/enums/post-types'
import { UserMongoModel } from '../../infra/db/mongodb/models/user-model'
import { PostMongoModel } from '../../infra/db/mongodb/models/post-model'
import { IPostModel } from '../../domain/models/post-model'
import { IUserModel } from '../../domain/models/user-model'

describe('Post Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect()
  })

  afterEach(async () => {
    await MongoHelper.clear()
  })

  afterAll(async () => {
    await MongoHelper.close()
  })

  test('Should return 201 and a post on createPost with success', async () => {
    // Arrange
    const userData = await createUser('fooBar')

    const requestData = {
      message: 'foo_bar',
      authorId: userData.id
    }

    // Act & Assert
    await request(app)
      .post('/api/v1/posts/')
      .send(requestData)
      .expect(201)
      .expect((res) => {
        expect(res.body.id).toBeTruthy()
        expect(res.body.author).toBe(requestData.authorId)
        expect(res.body.message).toBe(requestData.message)
        expect(res.body.type).toBe(PostTypes.ORIGINAL)
        expect(res.body.createdAt).toBeTruthy()
      })
  })

  test('Should return 404 on createPost on user not found for authorId', async () => {
    // Arrange
    const requestData = {
      message: 'foo_bar',
      authorId: '507f191e810c19729de860ea'
    }

    // Act & Assert
    await request(app)
      .post('/api/v1/posts/')
      .send(requestData)
      .expect(404)
      .expect((res) => {
        expect(res.body).toEqual({
          message: 'User not found for id: ' + requestData.authorId,
          name: 'ResourceNotFoundError',
          statusCode: 404
        })
      })
  })

  test('Should return 500 on createPost on unknow error', async () => {
    // Arrange
    const requestData = {
      message: 'foo_bar',
      authorId: '1'
    }

    // Act & Assert
    await request(app)
      .post('/api/v1/posts/')
      .send(requestData)
      .expect(500)
      .expect((res) => {
        expect(res.body).toEqual({
          message: 'Internal Server Error',
          name: 'InternalServerError',
          statusCode: 500
        })
      })
  })

  test('Should return 400 on createPost if user exceed max number of posts per day', async () => {
    // Arrange
    const userData = await createUser('fooBar')
    const userId: string = userData.id

    await createBulkPosts(userId, 5)

    const requestData = {
      message: 'foo_bar',
      authorId: userId
    }

    // Act & Assert
    await request(app)
      .post('/api/v1/posts/')
      .send(requestData)
      .expect(400)
      .expect((res) => {
        expect(res.body).toEqual({
          message: `User <${userId}> exceeded the max number of posts per day of <5>`,
          name: 'BadRequestError',
          statusCode: 400
        })
      })
  })

  test('Should return 201 and a post on repostPost with success', async () => {
    // Arrange
    const firstPostUser = await createUser('fooBar')
    const originalPost = await createPost(firstPostUser.id)
    const originalPostId: string = originalPost.id

    const repostUser = await createUser('newFooBar')

    const requestData = {
      authorId: repostUser.id
    }

    // Act & Assert
    await request(app)
      .post(`/api/v1/posts/${originalPostId}/reposts`)
      .send(requestData)
      .expect(201)
      .expect((res) => {
        expect(res.body.id).toBeTruthy()
        expect(res.body.author).toBe(requestData.authorId)
        expect(res.body.originalPost).toBe(originalPostId)
        expect(res.body.type).toBe(PostTypes.REPOST)
        expect(res.body.createdAt).toBeTruthy()
      })
  })

  test('Should return 500 on repostPost on unknow error', async () => {
    // Arrange
    const requestData = {
      authorId: '1'
    }

    // Act & Assert
    await request(app)
      .post('/api/v1/posts/2/reposts')
      .send(requestData)
      .expect(500)
      .expect((res) => {
        expect(res.body).toEqual({
          message: 'Internal Server Error',
          name: 'InternalServerError',
          statusCode: 500
        })
      })
  })

  test('Should return 400 on repostPost if user exceed max number of posts per day', async () => {
    // Arrange
    const firstPostUser = await createUser('fooBar')
    const originalPost = await createPost(firstPostUser.id)
    const originalPostId: string = originalPost.id

    const repostUser = await createUser('newFooBar')
    const repostUserId: string = repostUser.id
    await createBulkPosts(repostUserId, 5)

    const requestData = {
      authorId: repostUser.id
    }

    // Act & Assert
    await request(app)
      .post(`/api/v1/posts/${originalPostId}/reposts`)
      .send(requestData)
      .expect(400)
      .expect((res) => {
        expect(res.body).toEqual({
          message: `User <${repostUserId}> exceeded the max number of posts per day of <5>`,
          name: 'BadRequestError',
          statusCode: 400
        })
      })
  })

  test('Should return 404 on repostPost on user not found for authorId', async () => {
    // Arrange
    const firstPostUser = await createUser('fooBar')
    const originalPost = await createPost(firstPostUser.id)
    const originalPostId: string = originalPost.id

    const requestData = {
      authorId: '507f191e810c19729de860ea'
    }

    // Act & Assert
    await request(app)
      .post(`/api/v1/posts/${originalPostId}/reposts`)
      .send(requestData)
      .expect(404)
      .expect((res) => {
        expect(res.body).toEqual({
          message: 'User not found for id: ' + requestData.authorId,
          name: 'ResourceNotFoundError',
          statusCode: 404
        })
      })
  })

  test('Should return 404 on repostPost on post not found for postId', async () => {
    // Arrange
    const repostUser = await createUser('newFooBar')
    const originalPostId: string = '507f191e810c19729de860ea'
    const requestData = {
      authorId: repostUser.id
    }

    // Act & Assert
    await request(app)
      .post(`/api/v1/posts/${originalPostId}/reposts`)
      .send(requestData)
      .expect(404)
      .expect((res) => {
        expect(res.body).toEqual({
          message: `Post not found for id: <${originalPostId}>`,
          name: 'ResourceNotFoundError',
          statusCode: 404
        })
      })
  })

  test('Should return 400 on repostPost if user trying to reposting self post', async () => {
    // Arrange
    const user = await createUser('fooBar')
    const originalPost = await createPost(user.id)
    const originalPostId: string = originalPost.id
    const userId: string = user.id

    const requestData = {
      authorId: userId
    }

    // Act & Assert
    await request(app)
      .post(`/api/v1/posts/${originalPostId}/reposts`)
      .send(requestData)
      .expect(400)
      .expect((res) => {
        expect(res.body).toEqual({
          message: `User <${userId}> are not allowed to repost self post <${originalPostId}>.`,
          name: 'BadRequestError',
          statusCode: 400
        })
      })
  })

  test('Should return 200 and a array posts on findPosts with success without params', async () => {
    // Arrange
    const user = await createUser('fooBar')
    await createBulkPosts(user.id, 20)

    // Act & Assert
    await request(app)
      .get('/api/v1/posts')
      .send()
      .expect(200)
      .expect((res) => {
        expect(res.body.length).toBe(10)
      })
  })

  test('Should return 200 and a array posts on findPosts with success with params', async () => {
    // Arrange
    const user = await createUser('fooBar')
    await createBulkPosts(user.id, 20)

    const page: number = 2
    const perPage: number = 5
    const userId: string = user.id
    const startDate = '2022-06-10T00:00:00.000Z'

    const endDateAux = new Date()
    endDateAux.setHours(23, 59, 59, 999)
    const endDate = endDateAux.toISOString()

    // Act & Assert
    await request(app)
      .get(`/api/v1/posts?page=${page}&perPage=${perPage}&userId=${userId}&startDate=${startDate}&endDate=${endDate}`)
      .send()
      .expect(200)
      .expect((res) => {
        expect(res.body.length).toBe(5)
      })
  })

  test('Should return 200 and a empty array posts on findPosts with success with out of range dates', async () => {
    // Arrange
    const user = await createUser('fooBar')
    await createBulkPosts(user.id, 20)

    const page: number = 2
    const perPage: number = 5
    const userId: string = user.id
    const startDate = '2022-06-10T00:00:00.000Z'
    const endDate = '2022-06-10T01:00:00.000Z'

    // Act & Assert
    await request(app)
      .get(`/api/v1/posts?page=${page}&perPage=${perPage}&userId=${userId}&startDate=${startDate}&endDate=${endDate}`)
      .send()
      .expect(200)
      .expect((res) => {
        expect(res.body.length).toBe(0)
      })
  })

  test('Should return 200 and a array posts on findPosts with success without dates', async () => {
    // Arrange
    const user = await createUser('fooBar')
    await createBulkPosts(user.id, 20)

    const page: number = 2
    const perPage: number = 8
    const userId: string = user.id

    // Act & Assert
    await request(app)
      .get(`/api/v1/posts?page=${page}&perPage=${perPage}&userId=${userId}`)
      .send()
      .expect(200)
      .expect((res) => {
        expect(res.body.length).toBe(8)
      })
  })

  test('Should return 200 and a array posts on findPosts with success without dates and user', async () => {
    // Arrange
    const user = await createUser('fooBar')
    await createBulkPosts(user.id, 5)

    const userTwo = await createUser('fooBarBar')
    await createBulkPosts(userTwo.id, 5)

    const page: number = 1
    const perPage: number = 10

    // Act & Assert
    await request(app)
      .get(`/api/v1/posts?page=${page}&perPage=${perPage}`)
      .send()
      .expect(200)
      .expect((res) => {
        expect(res.body.length).toBe(10)
      })
  })
})

async function createBulkPosts (userId: string, qtd: number): Promise<void> {
  for (let i = 0; i < qtd; i++) {
    await createPost(userId)
  }
}

async function createUser (username: string): Promise<IUserModel> {
  const userData = new UserMongoModel()
  userData.username = username
  return await userData.save()
}

async function createPost (userId: string): Promise<IPostModel> {
  const postData = new PostMongoModel()
  postData.message = 'foo_bar'
  postData.author = userId
  postData.type = PostTypes.ORIGINAL

  return await postData.save()
}
