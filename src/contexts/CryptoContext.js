import React from 'react'
import { useEffect, useContext, useState} from 'react'

const CryptoContext = React.createContext()

export function useCryptoOracle() { 
    return useContext(CryptoContext)
}

export function CryptoProvider( { children } ) {
    const [loading, setLoading] = useState(false)
    const [nomicsTickers, setNomicsTickers] = useState([])
  

    useEffect(() => {
      refreshOraclePrices()
    }, [])

    function refreshOraclePrices(){
      setNomicsTickers([])
      setLoading(true)
      fetch("https://api.nomics.com/v1/currencies/ticker?key=f4335d03c35fda19304ee5a774da930698ac6ed1&per-page=100&ids=BTC,ETH,LUNA3,OSMO,JUNO,ATOM,RUNE,KUJI&interval=1h,30d")
        .then(response => response.json())
        .then(tickers => {
          let tempTickers = []
          tickers.forEach(ticker => {
            tempTickers.push(ticker)
          })
          setNomicsTickers(tempTickers)
          setLoading(false)
        })
    }
    

    const value = { 
      nomicsTickers,
      refreshOraclePrices
    }

  return (
    <CryptoContext.Provider value={value}>
        {!loading && children}
    </CryptoContext.Provider>
  )
}
