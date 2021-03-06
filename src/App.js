import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import {
  ArtistDetail,
  Music,
  MusicDetail,
  Chart,
  LoaderBar,
  Header,
  SearchResult,
  PageNotFound,
} from './components/'
import { fetchCharts } from './api'
import { makeRandomNumber } from './lib/makeRandomNumber'
import { countryCodeList, topLimit } from './constant'

function App() {
  const [charts, setCharts] = useState([])
  const [randomMusic, setRandomMusic] = useState({})
  const [query, setQuery] = useState({
    currentCountryCode: 'KR',
    label: 'South Korea',
    limit: 50,
  })
  const [search, setSearch] = useState('')
  const [searchResult, setSearchResult] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isStandBy, setIsStandBy] = useState(false)
  const { currentCountryCode, limit } = query

  const getCharts = async () => {
    setIsLoading(true)
    const fetchedCharts = await fetchCharts(currentCountryCode, limit)
    setCharts(fetchedCharts)
    setIsLoading(false)
  }

  useEffect(() => {
    getCharts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getRandomMusic = () => {
    setIsStandBy(false)
    if (typeof charts === 'undefined') {
      return
    }
    const index = makeRandomNumber(limit)
    if (typeof charts[index].images.coverart === 'undefined') {
      throw new Error('Music List is not ready...')
    }
    setRandomMusic(charts[index])
    setIsStandBy(true)
  }

  return (
    <div className="appContainer">
      {isLoading && <LoaderBar />}
      <Header search={search} setSearch={setSearch} />
      <Routes>
        <>
          <Route
            path={`/`}
            element={
              <Music
                getRandomMusic={getRandomMusic}
                randomMusic={randomMusic}
                setQuery={setQuery}
                query={query}
                countryCodeList={countryCodeList}
                topLimit={topLimit}
                isStandBy={isStandBy}
                getCharts={getCharts}
              />
            }
          />
          <Route path={`/music/:id`} element={<MusicDetail />} />
          <Route
            path={`/chart`}
            element={
              <Chart
                charts={charts}
                getCharts={getCharts}
                query={query}
                setQuery={setQuery}
                isLoading={isLoading}
                countryCodeList={countryCodeList}
                topLimit={topLimit}
              />
            }
          />
          <Route path={`/artist/:id`} element={<ArtistDetail />} />
          <Route
            path={`/search/*`}
            element={
              <SearchResult
                searchResult={searchResult}
                setSearchResult={setSearchResult}
              />
            }
          />
          <Route path="/*" element={<PageNotFound />} />
        </>
      </Routes>
    </div>
  )
}
export default App
