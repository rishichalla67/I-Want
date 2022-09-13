import React from 'react'
import { useEffect, useContext, useState} from 'react'
import { useFirestore } from '../contexts/FirestoreContext'

const CryptoContext = React.createContext()

export function useCryptoOracle() { 
    return useContext(CryptoContext)
}

export function CryptoProvider( { children } ) {
    const [loading, setLoading] = useState(false)
    const [positionPrices, setPositionPrices] = useState({})
    const [searchResults, setSearchResults] = useState([])
    const [tickerNameList, setTickerNameList] = useState([])
    const { getPortfolioTickerList } = useFirestore()


    useEffect(() => {
      refreshOraclePrices()
    }, [])

    async function refreshOraclePrices(){
      const tickerList = await getPortfolioTickerList()
      setTickerNameList(tickerList)

      const tickers = tickerList.map(ticker => ticker.symbol)
      console.log(tickers)
      setPositionPrices([])
      setLoading(true)
      // fetch("https://api.nomics.com/v1/currencies/ticker?key=f4335d03c35fda19304ee5a774da930698ac6ed1&per-page=100&ids=BTC,ETH,LUNA3,OSMO,JUNO,ATOM,RUNE,KUJI&interval=1h,30d")
      console.log(`https://api.coingecko.com/api/v3/simple/price?ids=${tickers.join(",")}&vs_currencies=usd`)
      fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${tickers.join(",")}&vs_currencies=usd`)
        .then(response => response.json())
        .then(tickers => {
          console.log(tickers)
          setPositionPrices(tickers)
          setLoading(false)
        })
    }

    function searchCoinGeckoAPI(ticker){
      fetch(`https://api.coingecko.com/api/v3/search?query=${ticker}`)
        .then(response => response.json())
        .then(searchResponse => {
          console.log(searchResponse)
          setSearchResults(searchResponse.coins)
          return(searchResponse.coins)
        })
    }

    const value = { 
      positionPrices,
      refreshOraclePrices,
      searchCoinGeckoAPI,
      searchResults,
      tickerNameList
    }

  return (
    <CryptoContext.Provider value={value}>
        {!loading && children}
    </CryptoContext.Provider>
  )
}
