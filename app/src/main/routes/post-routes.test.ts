import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'
import request from 'supertest'
import { PostTypes } from '../../domain/enums/post-types'
import { UserMongoModel } from '../../infra/db/mongodb/models/user-model'

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
    const userData = new UserMongoModel()
    userData.username = 'fooBar'
    await userData.save()

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
})
