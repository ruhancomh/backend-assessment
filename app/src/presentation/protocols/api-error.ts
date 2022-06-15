export interface ApiError extends Error {
  message: string
  name: string
  statusCode: number
}
