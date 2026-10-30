import { demoServer } from './demoServer'

export const api = demoServer

export { ApiError, getErrorMessage } from './ApiError'
export type {
  Category,
  CategoryInput,
  CollectionApi,
  FlowType,
  Transaction,
  TransactionInput,
} from './types'
