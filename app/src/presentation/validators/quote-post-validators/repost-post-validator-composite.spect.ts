import { MaximumParamSizeError } from "../../errors/maximum-param-size-error"
import { MissingParamError } from "../../errors/missing-param-error"
import { HttpRequest } from "../../protocols/http-request"
import { QuotePostValidatorComposite } from "./repost-post-validator-composite"

describe('QuotePost Validator Composite', () => {
  test('Should throws MissingParramError if no author is provided', async () => {
    // Arrange
    const { sut } = makeSut()
    const input: HttpRequest = {
      body: {
        message: 'foo bar'
      }
    }

    // Act & Assert
    expect(() => {
      sut.validate(input)
    }).toThrowError(new MissingParamError('authorId'))
  })

  test('Should throws MissingParramError if no message is provided', async () => {
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
    }).toThrowError(new MissingParamError('message'))
  })

  test('Should pass if valid input is provided', async () => {
    // Arrange
    const { sut } = makeSut()
    const input: HttpRequest = {
      body: {
        authorId: '123',
        message: 'foo bar'
      }
    }

    // Act & Assert
    expect(() => {
      sut.validate(input)
    }).not.toThrow()
  })

  test('Should throws MaximumParamSizeError if message exceed the maximum size', async () => {
    // Arrange
    const { sut } = makeSut()
    const message = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.' +
      'Lorem Ipsum has been the industry\'s standard dummy text ever since the ' +
      '1500s, when an unknown printer took a galley of type and scrambled it' +
      'to make a type specimen book. It has survived not only five centuries, but' +
      'also the leap into electronic typesetting, remaining essentially unchanged.' +
      'Lorem Ipsum has been the industry\'s standard dummy text ever since the ' +
      '1500s, when an unknown printer took a galley of type and scrambled it' +
      'to make a type specimen book. It has survived not only five centuries, but' +
      'also the leap into electronic typesetting, remaining essentially unchanged.' +
      'to make a type specimen book. It has survived not only five centuries, but' +
      'also the leap into electronic typesetting, remaining essentially unchanged.'

    const input: HttpRequest = {
      body: {
        message: message,
        authorId: '123'
      }
    }

    // Act & Assert
    expect(() => {
      sut.validate(input)
    }).toThrowError(new MaximumParamSizeError('message', 777))
  })

  test('Should pass if message is under the maximum size', async () => {
    // Arrange
    const { sut } = makeSut()
    const message = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.' +
      'Lorem Ipsum has been the industry\'s standard dummy text ever since the '

    const input: HttpRequest = {
      body: {
        message: message,
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
  sut: QuotePostValidatorComposite
}

const makeSut = (): SutTypes => {
  return {
    sut: new QuotePostValidatorComposite()
  }
}
