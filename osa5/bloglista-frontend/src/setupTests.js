import '@testing-library/jest-dom/extend-expect'

let savedItems = {}

const localStorageMock = {
  setItem: (key, item) => {
    savedItems[key] = item
    console.log('localStorageMock savedItems: ', savedItems)
  },
  getItem: (key) => savedItems[key],
  clear: savedItems = {}
}

Object.defineProperty(window, 'localStorage', { value: localStorageMock })
