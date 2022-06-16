import { IFindUserRepository } from '../../../../../data/protocols/repositories/find-user-repository'
import { MongoHelper } from '../../helpers/mongo-helper'
import { UserMongoModel } from '../../models/user-model'
import { UserMongoRepository } from './user-repository'

describe('User Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect()
  })

  afterEach(async () => {
    await MongoHelper.clear()
  })

  afterAll(async () => {
    await MongoHelper.close()
  })

  test('Should return an user on findUserById with success', async () => {
    // Arrange
    const sut = makeSut()
    const userData = new UserMongoModel()

    userData.username = 'foo_bar'

    await userData.save()

    // Act
    const user = await sut.findById(userData.id)

    // Assert
    expect(user).toBeTruthy()
    expect(user?.id).toBe(userData.id)
    expect(user?.username).toBe('foo_bar')
    expect(user?.createdAt).toBeTruthy()
  })

  test('Should return null on findUserById if no record found', async () => {
    // Arrange
    const sut = makeSut()
    const userId = '62aa4bff0d85c5f0b7724151'
    // Act
    const user = await sut.findById(userId)

    // Assert
    expect(user).toBeNull()
  })

  const makeSut = (): IFindUserRepository => {
    return new UserMongoRepository()
  }
})
