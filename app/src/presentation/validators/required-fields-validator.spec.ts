import { MissingParamError } from '../errors/missing-param-error'
import { RequiredFieldsValidator } from './required-fields-validator'
describe('Required Fields Validator', () => {
  test('Should return MissingParamError if required field is not provided', () => {
    // Arrange
    const { sut } = makeSut()
    const fields = {
      body: {
        foo: 'foo'
      }
    }

    // Act & Assert
    expect(() => {
      sut.validate(fields)
    }).toThrowError(new MissingParamError('bar'))
  })

  test('Should do nothing if all required fields are provided', () => {
    // Arrange
    const { sut } = makeSut()
    const fields = {
      body: {
        foo: 'foo',
        bar: 'bar'
      }
    }

    // Act & Assert
    expect(() => {
      sut.validate(fields)
    }).not.toThrow()
  })
})

interface SutTypes {
  sut: RequiredFieldsValidator
}

const makeSut = (): SutTypes => {
  const requiredFields = ['foo', 'bar']

  return {
    sut: new RequiredFieldsValidator(requiredFields)
  }
}
