import React, { useState, useEffect } from 'react'
import axios, { AxiosResponse } from 'axios'
import './App.css'

interface IResult {
  id: number
  title: string
  description: string
}

interface IData {
  previous?: {
    page: number
  }
  next?: {
    page: number
  }
  results: IResult[]
}

function App() {
  const [search, setSearch] = useState('')
  const [pageSize, setPageSize] = useState(20)
  const [results, setResults] = useState<IResult[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [prevPage, setPrevPage] = useState<number | undefined>()
  const [nextPage, setNextPage] = useState<number | undefined>()
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    axios
      .get(
        `http://localhost:3000/patrols?page=${currentPage}&limit=${pageSize}&search=${search}`
      )
      .then((response: AxiosResponse<IData>) => {
        setResults(response.data.results)
        if (response.data.previous) setPrevPage(response.data.previous.page)
        else setPrevPage(undefined)
        if (response.data.next) setNextPage(response.data.next.page)
        else setNextPage(undefined)
      })
    // eslint-disable-next-line
  }, [currentPage, pageSize])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const val = e.target.value
    setCurrentPage(1)
    setSearch(val)

    if (timer) clearTimeout(timer)

    const t = setTimeout(() => {
      axios
        .get(
          `http://localhost:3000/patrols?page=1&limit=${pageSize}&search=${val}`
        )
        .then((response: AxiosResponse<IData>) => {
          setResults(response.data.results)
          if (response.data.previous) setPrevPage(response.data.previous.page)
          else setPrevPage(undefined)
          if (response.data.next) setNextPage(response.data.next.page)
          else setNextPage(undefined)
        })
    }, 500)

    setTimer(t)
  }

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault()
    setPageSize(parseInt(e.target.value))
    setCurrentPage(1)
    setPrevPage(undefined)
    setNextPage(undefined)
    setSearch('')
  }

  const handlePreviousClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setCurrentPage(prevPage || 1)
  }

  const handleNextClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setCurrentPage(nextPage || 1)
  }

  return (
    <div className="App">
      <div className="search-container">
        <input
          type="search"
          className="search-input"
          value={search}
          onChange={handleSearch}
          placeholder="Type something..."
        />
      </div>
      {results.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Height</th>
              <th>Mass</th>
              <th>Hair Color</th>
              <th>Skin Color</th>
              <th>Eye Color</th>
              <th>Birth Year</th>
            </tr>
          </thead>
          <tbody>
            {results.map(res => {
              return (
                <tr key={res.name}>
                  <td>{res.name}</td>
                  <td>{res.height}</td>
                  <td>{res.mass}</td>
                  <td>{res.hair_color}</td>
                  <td>{res.skin_color}</td>
                  <td>{res.eye_color}</td>
                  <td>{res.birth_year}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
      {results.length === 0 && (
        <div className="no-result">No results found.</div>
      )}
      <div className="pagination">
        <div>
          <span className="page-size">Search result number</span>
          <select
            className="select"
            value={pageSize}
            onChange={handlePageSizeChange}>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
          </select>
        </div>
        <div>
          {prevPage && (
            <span className="prev-page">
              <a href="/#" onClick={handlePreviousClick}>
                Previous
              </a>
            </span>
          )}
          <span className="current-page">{currentPage}</span>
          {nextPage && (
            <span className="next-page">
              <a href="/#" onClick={handleNextClick}>
                Next
              </a>
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
