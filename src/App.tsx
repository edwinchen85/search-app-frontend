import React, { useState, useEffect, useRef } from 'react'
import axios, { AxiosResponse } from 'axios'
import loader from './components/loader'
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
  const [pageSize, setPageSize] = useState(4)
  const [results, setResults] = useState<IResult[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [prevPage, setPrevPage] = useState<number | undefined>()
  const [nextPage, setNextPage] = useState<number | undefined>()
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout>>()
  const [done, setDone] = useState(false)

  const ref = useRef(false)

  useEffect(() => {
    loader.start()
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

        setDone(!done)
        loader.close()
      })
      .catch(err => {
        console.error('error:', err)
        loader.close()
      })
    // eslint-disable-next-line
  }, [currentPage, pageSize])

  useEffect(() => {
    ref.current = done
  }, [done])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const val = e.target.value
    setCurrentPage(1)
    setSearch(val)

    if (timer) clearTimeout(timer)

    const t = setTimeout(() => {
      loader.start()
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

          setDone(!done)
          loader.close()
        })
        .catch(err => {
          console.error('error:', err)
          loader.close()
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
    <div className="App" data-testid="App">
      <div className="search-container">
        <input
          data-testid="search-input"
          type="search"
          className="search-input"
          value={search}
          onChange={handleSearch}
          placeholder="Type something..."
        />
      </div>
      <div className="result-header">RESULT</div>
      <div className="results" data-testid="results">
        {results.length > 0 &&
          results.map((res: IResult) => {
            if (ref.current !== done) {
              const startIndex = res.title.toLowerCase().indexOf(search)
              const endIndex = startIndex + search.length
              const keyword = res.title.slice(
                startIndex,
                startIndex + search.length
              )
              const title =
                res.title.slice(0, startIndex) +
                '<span class="highlight">' +
                keyword +
                '</span>' +
                res.title.slice(endIndex)
              return (
                <div className="result" key={res.id}>
                  <strong
                    className="title"
                    dangerouslySetInnerHTML={{ __html: title }}></strong>
                  <p className="description">{res.description}</p>
                </div>
              )
            } else {
              return (
                <div className="result" key={res.id}>
                  <strong className="title">{res.title}</strong>
                  <p className="description">{res.description}</p>
                </div>
              )
            }
          })}
      </div>
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
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
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
