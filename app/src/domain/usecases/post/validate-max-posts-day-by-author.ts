export interface IValidateMaxPostsDayByAuthor {
  pass: (authorId: string) => Promise<boolean>
  getMaxPostsPerDay: () => number
}
