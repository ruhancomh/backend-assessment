import { MissingParamError } from '../../errors/missing-param-error'
import { HttpRequest } from '../../protocols/http-request'
import { CreateUserValidatorComposite } from './create-user-validator-composite'

describe('CreateUser Validator Composite', () => {
  test('Should throws MissingParramError if no username is provided', async () => {
    // Arrange
    const { sut } = makeSut()
    const input: HttpRequest = {
      body: {}
    }

    // Act & Assert
    expect(() => {
      sut.validate(input)
    }).toThrowError(new MissingParamError('username'))
  })

  test('Should pass if valid input is provided', async () => {
    // Arrange
    const { sut } = makeSut()
    const input: HttpRequest = {
      body: {
        username: 'any_username'
      }
    }

    // Act & Assert
    expect(() => {
      sut.validate(input)
    }).not.toThrow()
  })
})

interface SutTypes {
  sut: CreateUserValidatorComposite
}

const makeSut = (): SutTypes => {
  return {
    sut: new CreateUserValidatorComposite()
  }
}
