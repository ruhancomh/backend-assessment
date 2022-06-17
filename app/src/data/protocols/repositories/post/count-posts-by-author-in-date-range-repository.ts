export interface ICountPostsByAuthorInDateRangeRepository {
  countByAuthorInDateRange: (authorId: string, startDate: Date, endDate: Date) => Promise<number>
}
