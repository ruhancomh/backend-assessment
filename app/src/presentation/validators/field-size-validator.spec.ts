import { MaximumParamSizeError } from '../errors/maximum-param-size-error'
import { FieldSizeValidator } from './field-size-validator'

describe('Field Size Validator', () => {
  test('Should return MaximumParamSizeError if param exceed the maximum size', () => {
    // Arrange
    const { sut } = makeSut()
    const fields = {
      body: {
        foo: 'foobarfoo'
      }
    }

    // Act & Assert
    expect(() => {
      sut.validate(fields)
    }).toThrowError(new MaximumParamSizeError('foo', 5))
  })

  test('Should pass if fields are under the maximum size', () => {
    // Arrange
    const { sut } = makeSut()
    const fields = {
      body: {
        foo: 'foooo',
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
  sut: FieldSizeValidator
}

const makeSut = (): SutTypes => {
  const fieldSizes = new Map<string, number>([
    ['foo', 5],
    ['bar', 3]
  ])

  return {
    sut: new FieldSizeValidator(fieldSizes)
  }
}
