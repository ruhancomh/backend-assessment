import { IUserModel } from '../../../domain/models/user-model'
import { CreateUserModel } from '../../../domain/protocols/create-user-model'
import { ICreateUserRepository } from '../../protocols/repositories/user/create-user-repository'
import { DbCreateUser } from './db-create-user'

describe('DbCreateUser UseCase', () => {
  test('Should throw if UserRepository throws', async () => {
    // Arrange
    const { sut, userRepositoryStub } = makeSut()
    const userData: CreateUserModel = {
      username: 'foo_bar'
    }

    jest.spyOn(userRepositoryStub, 'create')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

    // Act
    const result = sut.create(userData)

    // Assert
    await expect(result).rejects.toThrow()
  })

  test('Should call UserRepository with correct values', async () => {
    // Arrange
    const { sut, userRepositoryStub } = makeSut()
    const userData: CreateUserModel = {
      username: 'foo_bar'
    }
    const findByIdSpy = jest.spyOn(userRepositoryStub, 'create')

    // Act
    await sut.create(userData)

    // Assert
    expect(findByIdSpy).toHaveBeenCalledWith({
      username: userData.username
    })
  })

  test('Should return an user on success', async () => {
    // Arrange
    const { sut } = makeSut()
    const userData: CreateUserModel = {
      username: 'foo_bar'
    }
    const expectedUser: IUserModel = {
      id: '123',
      username: 'foo_bar',
      createdAt: new Date('2022-06-13T10:00:00')
    }

    // Act
    const user = await sut.create(userData)

    // Assert
    expect(user).toEqual(expectedUser)
  })
})

interface SutTypes {
  sut: DbCreateUser
  userRepositoryStub: UserRepositoryStub
}

class UserRepositoryStub implements ICreateUserRepository {
  async create (userData: CreateUserModel): Promise<IUserModel> {
    const fakeUser: IUserModel = {
      id: '123',
      username: userData.username,
      createdAt: new Date('2022-06-13T10:00:00')
    }

    return fakeUser
  }
}

const makeSut = (): SutTypes => {
  const userRepositoryStub = new UserRepositoryStub()
  const sut = new DbCreateUser(userRepositoryStub)

  return {
    sut: sut,
    userRepositoryStub: userRepositoryStub
  }
}
