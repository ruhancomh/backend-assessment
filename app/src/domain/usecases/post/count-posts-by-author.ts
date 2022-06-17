export interface ICountPostsByAuthor {
  count: (authorId: string) => Promise<number>
}
