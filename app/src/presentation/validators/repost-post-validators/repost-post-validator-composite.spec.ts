import { MissingParamError } from '../../errors/missing-param-error'
import { HttpRequest } from '../../protocols/http-request'
import { RepostPostValidatorComposite } from './repost-post-validator-composite'

describe('RepostPost Validator Composite', () => {
  test('Should throws MissingParramError if no author is provided', async () => {
    // Arrange
    const { sut } = makeSut()
    const input: HttpRequest = {
      body: {}
    }

    // Act & Assert
    expect(() => {
      sut.validate(input)
    }).toThrowError(new MissingParamError('authorId'))
  })

  test('Should pass if valid input is provided', async () => {
    // Arrange
    const { sut } = makeSut()
    const input: HttpRequest = {
      body: {
        authorId: '123'
      }
    }

    // Act & Assert
    expect(() => {
      sut.validate(input)
    }).not.toThrow()
  })
})

interface SutTypes {
  sut: RepostPostValidatorComposite
}

const makeSut = (): SutTypes => {
  return {
    sut: new RepostPostValidatorComposite()
  }
}
