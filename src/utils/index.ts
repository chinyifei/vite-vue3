export const getStorage = (key: string) => {
  return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)!) : {}
}

export const setStorage = (key: string, value: unknown) => {
  localStorage.setItem(key, JSON.stringify(value))
}
