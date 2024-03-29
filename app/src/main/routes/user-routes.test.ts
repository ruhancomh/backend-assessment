import request from 'supertest'
import { DbCreatePostModel } from '../../data/protocols/dtos/db-create-post-model'
import { PostTypes } from '../../domain/enums/post-types'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { PostMongoModel } from '../../infra/db/mongodb/models/post-model'
import { UserMongoModel } from '../../infra/db/mongodb/models/user-model'
import app from '../config/app'

describe('User Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect()
  })

  afterEach(async () => {
    await MongoHelper.clear()
  })

  afterAll(async () => {
    await MongoHelper.close()
  })

  test('Should return 200 and an user on getUser with success', async () => {
    // Arrange
    const userData = new UserMongoModel()

    userData.username = 'foo_bar'

    await userData.save()

    const postData = new PostMongoModel()
    postData.author = userData.id
    postData.message = 'foo_bar'
    postData.type = PostTypes.ORIGINAL

    await postData.save()

    // Act & Assert
    await request(app)
      .get('/api/v1/users/' + String(userData.id))
      .send()
      .expect(200)
      .expect((res) => {
        expect(res.body.id).toBe(userData.id)
        expect(res.body.username).toBe(userData.username)
        expect(res.body.countPosts).toBe(1)
        expect(res.body.createdAt).toBeTruthy()
        expect(res.body.createdAtFormated).toBeTruthy()
      })
  })

  test('Should return 404 on getUser on user not found', async () => {
    // Arrange
    const userId = '507f191e810c19729de860ea'

    // Act & Assert
    await request(app)
      .get('/api/v1/users/' + userId)
      .send()
      .expect(404)
      .expect((res) => {
        expect(res.body).toEqual({
          message: 'User not found for id: ' + userId,
          name: 'ResourceNotFoundError',
          statusCode: 404
        })
      })
  })

  test('Should return 500 on getUser on unknow error', async () => {
    // Arrange
    const userId = '1'

    // Act & Assert
    await request(app)
      .get('/api/v1/users/' + userId)
      .send()
      .expect(500)
      .expect((res) => {
        expect(res.body).toEqual({
          message: 'Internal Server Error',
          name: 'InternalServerError',
          statusCode: 500
        })
      })
  })

  test('Should return 201 and an user on createUser with success', async () => {
    // Arrange
    const requestData = {
      username: 'foobbar'
    }

    // Act & Assert
    await request(app)
      .post('/api/v1/users/')
      .send(requestData)
      .expect(201)
      .expect((res) => {
        expect(res.body.id).toBeTruthy()
        expect(res.body.username).toBe(requestData.username)
        expect(res.body.createdAt).toBeTruthy()
      })
  })

  test('Should return 400 on createUser without required username', async () => {
    // Arrange
    const requestData = {}

    // Act & Assert
    await request(app)
      .post('/api/v1/users/')
      .send(requestData)
      .expect(400)
      .expect((res) => {
        expect(res.body).toEqual({
          message: 'Missing param: username',
          name: 'MissingParamError',
          statusCode: 400
        })
      })
  })

  test('Should return 400 on createUser with duplicated username', async () => {
    // Arrange
    const userData = new UserMongoModel()
    userData.username = 'foobbar'
    await userData.save()

    const requestData = {
      username: 'foobbar'
    }

    // Act & Assert
    await request(app)
      .post('/api/v1/users/')
      .send(requestData)
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toBeTruthy()
        expect(res.body.name).toBe('BadRequestError')
        expect(res.body.statusCode).toBe(400)
      })
  })

  test('Should return 400 on createUser if username exceed the maximum size', async () => {
    // Arrange
    const requestData = {
      username: 'foobbarffooobarrfoobbar'
    }

    // Act & Assert
    await request(app)
      .post('/api/v1/users/')
      .send(requestData)
      .expect(400)
      .expect((res) => {
        expect(res.body).toEqual({
          message: 'Param <username> exceeded the maximum size of <14>',
          name: 'MaximumParamSizeError',
          statusCode: 400
        })
      })
  })

  test('Should return 400 on createUser if username have not alphanumeric value', async () => {
    // Arrange
    const requestData = {
      username: 'foo_bar'
    }

    // Act & Assert
    await request(app)
      .post('/api/v1/users/')
      .send(requestData)
      .expect(400)
      .expect((res) => {
        expect(res.body).toEqual({
          message: 'Param <username> only accepts alphanumeric values',
          name: 'RequiredAlphanumericParamError',
          statusCode: 400
        })
      })
  })
})
