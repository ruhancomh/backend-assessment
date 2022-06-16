import { HttpRequest } from '../protocols/http-request'
import { Validator } from '../protocols/validator'
import { ValidatorComposite } from './validator-composite'

describe('Validator Composite', () => {
  test('Should pass correct values to validators', () => {
    // Arrange
    const { sut, fooValidatorStub } = makeSut()
    const input: HttpRequest = {
      body: {
        foo: 'foo'
      }
    }

    const validateSpy = jest.spyOn(fooValidatorStub, 'validate')

    // Act
    sut.validate(input)

    // Assert
    expect(validateSpy).toBeCalledWith(input)
  })

  test('Should throw Error if validator throws', () => {
    // Arrange
    const { sut, fooValidatorStub } = makeSut()
    const input: HttpRequest = {
      body: {
        foo: 'foo'
      }
    }

    jest.spyOn(fooValidatorStub, 'validate').mockImplementationOnce(() => {
      throw new Error('error')
    })

    // Act & Assert
    expect(() => {
      sut.validate(input)
    }).toThrowError(new Error('error'))
  })
})

interface SutTypes {
  fooValidatorStub: FooValidatorStub
  sut: ValidatorComposite
}

class FooValidatorStub implements Validator {
  validate (input: any): void {
  }
}

class ValidatorCompositeStub extends ValidatorComposite {
}

const makeSut = (): SutTypes => {
  const fooValidatorStub = new FooValidatorStub()

  return {
    sut: new ValidatorCompositeStub([fooValidatorStub]),
    fooValidatorStub: fooValidatorStub
  }
}
