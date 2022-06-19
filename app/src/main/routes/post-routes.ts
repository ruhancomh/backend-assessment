import { Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeCreatePostController } from '../factories/post/create-post-controller-factory'
import { makeFindPostsController } from '../factories/post/find-posts-controller-factory'
import { makeQuotePostController } from '../factories/post/quote-post-controller-factory'
import { makeRepostPostController } from '../factories/post/repost-post-controller-factory'

export default (router: Router): void => {
  router.post('/posts/', adaptRoute(makeCreatePostController()))

  router.post('/posts/:postId/reposts', adaptRoute(makeRepostPostController()))

  router.post('/posts/:postId/quotes', adaptRoute(makeQuotePostController()))

  router.get('/posts', adaptRoute(makeFindPostsController()))
}
