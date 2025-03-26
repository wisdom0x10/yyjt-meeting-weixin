export const getCurrentPath = () => {
  const pages = getCurrentPages()

  const page = pages[pages.length - 1]

  const route = page.route

  return `/${route}`
}

export const getCurrentPathWithQuery = () => {
  const pages = getCurrentPages()

  const page = pages[pages.length - 1]

  const route = page.route

  const entries = Object.entries(page.options)

  return `/${route}?${entries.map((item) => item.join('=')).join('&')}`
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let lastFunc: ReturnType<typeof setTimeout>
  let lastRan: number
  return function (this: any, ...args: Parameters<T>): void {
    const context = this
    if (!lastRan) {
      func.apply(context, args)
      lastRan = Date.now()
    } else {
      clearTimeout(lastFunc)
      lastFunc = setTimeout(() => {
        if (Date.now() - lastRan >= limit) {
          func.apply(context, args)
          lastRan = Date.now()
        }
      }, limit - (Date.now() - lastRan))
    }
  }
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: any
  return function (this: any, ...args: Parameters<T>): void {
    const context = this
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(context, args), wait)
  }
}
