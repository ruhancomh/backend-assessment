import { MaximumParamSizeError } from '../../errors/maximum-param-size-error'
import { MissingParamError } from '../../errors/missing-param-error'
import { RequiredAlphanumericParamError } from '../../errors/required-alphanumeric-param-error'
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
        username: 'anyUsername'
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
        username: 'foobbarrfooobarrfoobbar'
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
        username: 'fooobarfoobbar'
      }
    }

    // Act & Assert
    expect(() => {
      sut.validate(input)
    }).not.toThrow()
  })

  test('Should throws RequiredAlphanumericParamError if username have not alphanumeric value', async () => {
    // Arrange
    const { sut } = makeSut()
    const input: HttpRequest = {
      body: {
        username: 'f0o-o?'
      }
    }

    // Act & Assert
    expect(() => {
      sut.validate(input)
    }).toThrowError(new RequiredAlphanumericParamError('username'))
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
