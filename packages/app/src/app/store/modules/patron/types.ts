export type State = {
  price: number
  isUpdatingSubscription: boolean
  tier: number
  error: string
}

export type SubscriptionErrorResult = {
  errors: {
    detail: string[]
  }
}
