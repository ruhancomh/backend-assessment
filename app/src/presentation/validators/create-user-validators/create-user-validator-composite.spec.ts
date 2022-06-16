import { MaximumParamSizeError } from '../../errors/maximum-param-size-error'
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

  test('Should throws MaximumParamSizeError if username exceed the maximum size', async () => {
    // Arrange
    const { sut } = makeSut()
    const input: HttpRequest = {
      body: {
        username: 'foo_bar_foo_bar_foo_bar'
      }
    }

    // Act & Assert
    expect(() => {
      sut.validate(input)
    }).toThrowError(new MaximumParamSizeError('username', 14))
  })

  test('Should pass if username is under the maximum size', async () => {
    // Arrange
    const { sut } = makeSut()
    const input: HttpRequest = {
      body: {
        username: 'foo_barfoo_bar'
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
