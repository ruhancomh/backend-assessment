import { IUserModel } from '../../../domain/models/user-model'
import { UserNotFoundError } from '../../errors/user-not-found-error'
import { IUserRepository } from '../../protocols/repositories/user-repository'
import { DbGetUser } from './db-get-user'

describe('DbGetUser UseCase', () => {
  test('Should throw if UserRepository throws', async () => {
    // Arrange
    const { sut, userRepositoryStub } = makeSut()
    const userId: string = '123'

    jest.spyOn(userRepositoryStub, 'findById')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

    // Act
    const result = sut.get(userId)

    // Assert
    await expect(result).rejects.toThrow()
  })

  test('Should call UserRepository with correct values', async () => {
    // Arrange
    const { sut, userRepositoryStub } = makeSut()
    const userId: string = '123'
    const findByIdSpy = jest.spyOn(userRepositoryStub, 'findById')

    // Act
    await sut.get(userId)

    // Assert
    expect(findByIdSpy).toHaveBeenCalledWith('123')
  })

  test('Should return an user on success', async () => {
    // Arrange
    const { sut } = makeSut()
    const userId: string = '123'
    const expectedUser: IUserModel = {
      id: '123',
      username: 'foo_bar',
      createdAt: new Date('2022-06-13T10:00:00')
    }

    // Act
    const user = await sut.get(userId)

    // Assert
    expect(user).toEqual(expectedUser)
  })

  test('Should throw UserNotFoundError if user not found', async () => {
    // Arrange
    const { sut, userRepositoryStub } = makeSut()
    const userId: string = '123'

    jest.spyOn(userRepositoryStub, 'findById')
      .mockReturnValueOnce(new Promise((resolve, reject) => resolve(null)))

    // Act
    const result = sut.get(userId)

    // Assert
    await expect(result).rejects.toThrow(UserNotFoundError)
  })
})

interface SutTypes {
  sut: DbGetUser
  userRepositoryStub: UserRepositoryStub
}

class UserRepositoryStub implements IUserRepository {
  async findById (id: string): Promise<IUserModel| null> {
    const fakeUser: IUserModel = {
      id: '123',
      username: 'foo_bar',
      createdAt: new Date('2022-06-13T10:00:00')
    }

    return fakeUser
  }
}

const makeSut = (): SutTypes => {
  const userRepositoryStub = new UserRepositoryStub()
  const sut = new DbGetUser(userRepositoryStub)

  return {
    sut: sut,
    userRepositoryStub: userRepositoryStub
  }
}
