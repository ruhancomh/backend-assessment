import { RequiredAlphanumericParamError } from '../errors/required-alphanumeric-param-error'
import { StringAlphanumericValidator } from './string-alphanumeric-validator'

describe('String Alphanumeric Validator', () => {
  test('Should return RequiredAlphanumericParamError if param have not alphanumeric value', () => {
    // Arrange
    const { sut } = makeSut()
    const fields = {
      body: {
        foo: '!foo1-',
        bar: 'bar??-'
      }
    }

    // Act & Assert
    expect(() => {
      sut.validate(fields)
    }).toThrowError(new RequiredAlphanumericParamError('foo'))
  })

  test('Should pass if params have alphanumeric value', () => {
    // Arrange
    const { sut } = makeSut()
    const fields = {
      body: {
        foo: 'f0o',
        bar: 'b4r'
      }
    }

    // Act & Assert
    expect(() => {
      sut.validate(fields)
    }).not.toThrow()
  })
})

interface SutTypes {
  sut: StringAlphanumericValidator
}

const makeSut = (): SutTypes => {
  const fields = ['foo', 'bar']

  return {
    sut: new StringAlphanumericValidator(fields)
  }
}
