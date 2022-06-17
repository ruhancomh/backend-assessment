import { ICountPostsByAuthorRepository } from '../../protocols/repositories/post/count-posts-by-author-repository'
import { DbCountPostsByAuthor } from './db-count-posts-by-author'

describe('DbCountPostsByAuthor UseCase', () => {
  test('Should throw if PostRepository throws', async () => {
    // Arrange
    const { sut, postRepositoryStub } = makeSut()
    const authorId = '123'

    jest.spyOn(postRepositoryStub, 'countByAuthor')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

    // Act
    const result = sut.count(authorId)

    // Assert
    await expect(result).rejects.toThrow()
  })

  test('Should call PostRepository with correct values', async () => {
    // Arrange
    const { sut, postRepositoryStub } = makeSut()
    const authorId = '123'
    const findByIdSpy = jest.spyOn(postRepositoryStub, 'countByAuthor')

    // Act
    await sut.count(authorId)

    // Assert
    expect(findByIdSpy).toHaveBeenCalledWith(authorId)
  })

  test('Should return the posts count on success', async () => {
    // Arrange
    const { sut } = makeSut()
    const authorId = '123'

    // Act
    const user = await sut.count(authorId)

    // Assert
    expect(user).toEqual(2)
  })
})

interface SutTypes {
  sut: DbCountPostsByAuthor
  postRepositoryStub: PostRepositoryStub
}

class PostRepositoryStub implements ICountPostsByAuthorRepository {
  async countByAuthor (authorId: string): Promise<number> {
    return 2
  }
}

const makeSut = (): SutTypes => {
  const postRepositoryStub = new PostRepositoryStub()
  const sut = new DbCountPostsByAuthor(postRepositoryStub)

  return {
    sut: sut,
    postRepositoryStub: postRepositoryStub
  }
}
