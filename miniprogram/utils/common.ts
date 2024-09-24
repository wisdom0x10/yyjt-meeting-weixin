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
