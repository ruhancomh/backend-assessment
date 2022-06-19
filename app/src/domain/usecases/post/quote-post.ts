import { IPostModel } from '../../models/post-model'
import { QuotePostModel } from '../../protocols/quote-post-model'

export interface IQuotePost {
  quote: (quoteData: QuotePostModel) => Promise<IPostModel>
}
