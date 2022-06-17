export interface ICountPostsByAuthorRepository {
  countByAuthor: (authorId: string) => Promise<number>
}
