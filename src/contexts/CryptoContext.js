import React from 'react'
import { useEffect, useContext, useState} from 'react'

const CryptoContext = React.createContext()

export const allTickers = ['bitcoin', 'kujira', 'cosmos', 'terra-luna-2', 'juno-network']

export function useCryptoOracle() { 
    return useContext(CryptoContext)
}

export function CryptoProvider( { children } ) {
    const [loading, setLoading] = useState(false)
    const [nomicsTickers, setNomicsTickers] = useState({})
  

    useEffect(() => {
      refreshOraclePrices()
    }, [])

    function refreshOraclePrices(){
      setNomicsTickers([])
      setLoading(true)
      // fetch("https://api.nomics.com/v1/currencies/ticker?key=f4335d03c35fda19304ee5a774da930698ac6ed1&per-page=100&ids=BTC,ETH,LUNA3,OSMO,JUNO,ATOM,RUNE,KUJI&interval=1h,30d")
      fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,kujira,cosmos,terra-luna-2,juno-network,evmos,osmosis&vs_currencies=usd")
        .then(response => response.json())
        .then(tickers => {
          console.log(tickers)
          // let tempTickers = []
          // allTickers.forEach(ticker => {
          //   let tempTicker = {
          //     symbol: ticker,
          //     price: tickers[ticker].usd
          //   }
            
          //   tempTickers.push(tempTicker)
          // })
          // console.log(tempTickers)
          setNomicsTickers(tickers)
          setLoading(false)
        })
    }
    

    const value = { 
      nomicsTickers,
      refreshOraclePrices,
      allTickers
    }

  return (
    <CryptoContext.Provider value={value}>
        {!loading && children}
    </CryptoContext.Provider>
  )
}
