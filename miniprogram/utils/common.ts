export const getCurrentPath = () => {
  const pages = getCurrentPages()

  const page = pages[pages.length - 1]

  const route = page.route

  return `/${route}`
}
