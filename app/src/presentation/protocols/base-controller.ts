import { HttpRequest } from './http-request'
import { HttpResponse } from './http-response'

export interface BaseController {
  handle: (httRequest: HttpRequest) => Promise<HttpResponse>
}
