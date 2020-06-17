import React from 'react'
import { render, cleanup, fireEvent } from '@testing-library/react'
import App from './App'

afterEach(() => {
  cleanup()
})

test('App component render', () => {
  const { getByTestId } = render(<App />)
  expect(getByTestId('App')).toBeTruthy()
})

test('Enter search input', async () => {
  const { getByTestId } = render(<App />)
  const searchInput = getByTestId('search-input') as HTMLInputElement

  fireEvent.change(getByTestId('search-input'), {
    target: {
      value: 'br',
    },
  })

  expect(searchInput.value).toBe('br')
})
