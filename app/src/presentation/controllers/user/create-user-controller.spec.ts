import { IUserModel } from '../../../domain/models/user-model'
import { CreateUserModel } from '../../../domain/protocols/create-user-model'
import { ICreateUser } from '../../../domain/usecases/user/create-user'
import { DuplicateKeyError } from '../../../infra/errors/duplicate-key-error'
import { BadRequestError } from '../../errors/bad-request-error'
import { InternalServerError } from '../../errors/internal-server-error'
import { HttpRequest } from '../../protocols/http-request'
import { Validator } from '../../protocols/validator'
import { CreateUserController } from './create-user-controller'

describe('CreateUser Controller', () => {
  test('Should call createUser with correct value', async () => {
    // Arrange
    const { sut, createUserStub } = makeSut()
    const getSpy = jest.spyOn(createUserStub, 'create')
    const fakeRequest = makeFakeRequest()

    // Act
    await sut.handle(fakeRequest)

    // Assert
    expect(getSpy).toBeCalledWith({ username: 'foo_bar' })
  })

  test('Should return an user and 201 on success', async () => {
    // Arrange
    const { sut } = makeSut()
    const fakeRequest = makeFakeRequest()

    // Act
    const httpResponse = await sut.handle(fakeRequest)

    // Assert
    expect(httpResponse.statusCode).toBe(201)
    expect(httpResponse.body.id).toBeTruthy()
    expect(httpResponse.body.createdAt).toBeTruthy()
    expect(httpResponse.body.username).toBe('foo_bar')
  })

  test('Should return 400 if duplicated key error', async () => {
    // Arrange
    const { sut, createUserStub } = makeSut()

    jest.spyOn(createUserStub, 'create').mockImplementationOnce(() => {
      throw new DuplicateKeyError('Foo bar')
    })

    const fakeRequest = makeFakeRequest()

    // Act
    const httpResponse = await sut.handle(fakeRequest)

    // Assert
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new BadRequestError('Foo bar'))
  })

  test('Should return 500 if CreaUser throws', async () => {
    // Arrange
    const { sut, createUserStub } = makeSut()

    jest.spyOn(createUserStub, 'create').mockImplementationOnce(() => {
      throw new Error()
    })

    const fakeRequest = makeFakeRequest()

    // Act
    const httpResponse = await sut.handle(fakeRequest)

    // Assert
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new InternalServerError())
  })
})

interface SutTypes {
  sut: CreateUserController
  createUserStub: ICreateUser
}

class CreateUserStub implements ICreateUser {
  async create (createUser: CreateUserModel): Promise<IUserModel> {
    return await Promise.resolve({
      id: '123',
      username: createUser.username,
      createdAt: new Date('2022-06-13T10:00:00')
    })
  }
}

class ValidatorStub implements Validator {
  validate (input: any): void {
  }
}

const makeSut = (): SutTypes => {
  const createUserStub = new CreateUserStub()
  const validatorStub = new ValidatorStub()

  return {
    sut: new CreateUserController(createUserStub, validatorStub),
    createUserStub: createUserStub
  }
}

const makeFakeRequest = (): HttpRequest => {
  return {
    body: {
      username: 'foo_bar'
    }
  }
}
