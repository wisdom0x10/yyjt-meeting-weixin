interface WXEvent<T = any, K = any> {
  detail: T
  target: { id: string; dataset: any }
}
