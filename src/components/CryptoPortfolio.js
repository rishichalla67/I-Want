import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useCryptoOracle } from '../contexts/CryptoContext'
import { useFirestore } from '../contexts/FirestoreContext'
import {Position} from '../Classes/Position'
import { PricePoint } from '../Classes/PricePoint'
import debounce from 'lodash.debounce';
import {ResponsiveContainer, Line, LineChart, XAxis, YAxis, Area, Tooltip, CartesianGrid} from "recharts"

const PORTFOLIO_ID = "rishiChalla"

export default function CryptoPortfolio() {
    const symbolRef = useRef()
    const quantityRef = useRef()
    const typeRef = useRef()
    const searchRef = useRef()
    const [portfolioValue, setPortfolioValue] = useState(0)
    const [portfolioValueHistory, setPortfolioValueHistory] = useState([])
    const [editPositions, setEditPositions] = useState(false)
    // const [searchResults, setSearchResults] = useState([])
    const [portfolioPositions, setPortfolioPositions] = useState([])
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { nomicsTickers, refreshOraclePrices, searchCoinGeckoAPI, searchResults } = useCryptoOracle()
    const { allPortfolioIds, getPortfolio, addPosition, removePosition, recordPortfolioValue } = useFirestore()

    useEffect(() => {
      setLoading(true)
      if(portfolioValue === 0){
        getPortfolioData()
      }

      const interval=setInterval(()=>{
        refreshOraclePrices()
        // calculatePortfolioValue(portfolioPositions)
        
        },180000)
          
        
        setLoading(false)
        return()=>clearInterval(interval)
         
      }, [])

    async function getPortfolioData(){
      const portfolio = await getPortfolio(PORTFOLIO_ID)
      calculatePortfolioValue(portfolio)
      setPortfolioValueHistory(portfolio.portfolioValueHistory)
    }

    function getCurrentDate(){
      var tempDate = new Date();
      var date = tempDate.getFullYear() + '-' + (tempDate.getMonth()+1) + '-' + tempDate.getDate() +' '+ tempDate.getHours()+':'+ tempDate.getMinutes()+':'+ tempDate.getSeconds();
      return(date)
    }

    function calculatePortfolioValue(portfolio){
      let totalSum = 0
      let positionsList = []
      const positions = portfolio.positions
      if(positions.length > 0){
        positions.forEach(position => {
          positionsList.push(position)
          if(nomicsTickers[position.symbol]){
            if(position.type === "LP"){
              //TODO: Add logic to calculate LPs
            }
            else{
              totalSum += parseFloat(nomicsTickers[position.symbol].usd) * position.quantity
            }
          }

        })
      }
      setPortfolioValue(totalSum.toFixed(2))
      setPortfolioPositions(positionsList)
      if(totalSum !== 0){
        recordPortfolioValue(PricePoint(getCurrentDate(), totalSum), PORTFOLIO_ID).catch(err => setError(err.message))
      }
    }

    const debouncedChangeHandler = useCallback(
      debounce(handleSearchSubmit, 300)
    , [])

    async function handleSearchSubmit(){
      
      const searchResponse = await searchCoinGeckoAPI(searchRef.current.value)
      console.log(searchResponse)
      // setSearchResults(searchResponse)
    }

    async function handleSubmit(e) {
      e.preventDefault()
      
      setLoading(true)
      await addPosition(Position(symbolRef.current.value, quantityRef.current.value, typeRef.current.value), PORTFOLIO_ID).catch(err => setError(err.message))
      setLoading(false)
      
    }

    function autofillAddPosition(value){
      symbolRef.current.value = value
      console.log(value, symbolRef)
    }

    if(loading) {
      return (
        <div className="h-screen bg-gradient-to-r from-sky-400 via-sky-400 to-sky-500 flex items-center justify-center space-x-2">
          <div className="items-center spinner-border animate-spin inline-block w-12 h-12 border-4 rounded-full" role="status">
            <span className="visually-hidden"></span>
          </div>
        </div>
      )
    }

    return (
      <div className="h-full bg-gradient-to-r from-sky-400 via-sky-400 to-sky-500">
        <div className="text-white pt-3 grid place-items-center">
          <div className="bg-black min-w-95% min-h-98vh md:max-w-5xl rounded-lg border border-slate-500 shadow-lg items-center ">
            
            <div className="flex justify-center px-4 py-5 sm:px-6">
              <h3 className="text-xl align-content-center leading-6 font-medium">Rishi's Crypto Portfolio</h3>
              
            </div>
            {error && <div role="alert">
              <div className="bg-red-500 text-white font-bold rounded-t px-4 py-2">
                  Error
              </div>
              <div className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
                  <p>{error}</p>
              </div>
            </div>}
            <div className="flex border-t border-b pb-2 border-gray-200">
              <h3 className="pl-3 pt-2 text-xl leading-6 font-medium">{`Portfolio Value: $${portfolioValue}`}</h3>
            </div>  
            {!editPositions ? 
            <div className="flex flex-col justify-center px-4 py-5 sm:px-6 pt-10 border-gray-200">
              {portfolioValueHistory.length > 0 && 
              <div className="flex justify-center w-full">
                <ResponsiveContainer width="100%" height={300 || 250}>
                    <LineChart data={portfolioValueHistory} margin={{ top: 5, right: 30, bottom: 5 }}>
                      <XAxis dataKey="date"/>
                      <YAxis dataKey="value" tickLine={{ stroke: 'red' }}/>
                      <Tooltip style={{ color: 'red'}}/>
                      <Line type="natural" dataKey="value" stroke='#0EA5E9' dot={false}/>
                    </LineChart>
                </ResponsiveContainer>
              </div>}
              <div className="flex pb-2 border border-gray-200">
                <a className="pl-3 text-white-500 text-2xl">-</a>
                  <h3 className="pl-3 pt-2 text-xl leading-6 text-sky-500 font-medium">Crypto</h3>
              <div className="grow pt-2 pr-3 text-xl leading-6 text-sky-500 font-medium text-right">
                      Value
                    </div>
              </div>
        
              {portfolioPositions.map((position) => {
                return(
                  <div key={`${position.symbol}-${position.quantity}-${position.type}`} className="flex pb-2 border border-gray-200">

                    
                      <button type="button" className="pl-3 text-red-500 text-2xl" onClick={() => removePosition(position, PORTFOLIO_ID)}>
                        -
                      </button>
                      <h3 className="pl-3 pt-2 text-xl leading-6 font-medium">{`${position.symbol}`}</h3>
                    
                    <div className="grow pt-2 pr-1 text-xl leading-6 font-medium text-right">
                      {/* {console.log(nomicsTickers[position.symbol])} */}
                      {`$${(parseFloat(position.quantity)*parseFloat(nomicsTickers[position.symbol].usd)).toFixed(2)}`}
                    </div>
                  </div> 
              )})}
              <div className="pt-2">
                <button className="bg-sky-500 hover:bg-sky-700 text-black font-bold py-2 px-4 rounded" onClick={() => {setEditPositions(true)}}>Add Position</button>
              </div>
            </div> :
            <div>
              <form className="mt-8 mx-8" action="#" onSubmit={handleSubmit}>
                <div className=" rounded-md shadow-sm -space-y-px">
                  <div>
                  <h3 className="flex align-content-left font-semibold">Crypto Ticker</h3>
                    <label htmlFor="Symbol" className="sr-only">
                      Symbol
                    </label>
                    <input
                      id="symbol"
                      name="symbol"
                      type="symbol"
                      ref={symbolRef}
                      required
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="example: bitcoin"
                    />
                  </div>
                  <div className="pt-2 ">
                    <h3 className="flex align-content-left font-semibold">Quantity</h3>
                    <label htmlFor="quantity" className="sr-only">
                      Quantity
                    </label>
                    <input
                      id="quantity"
                      name="quantity"
                      type="quantity"
                      ref={quantityRef}
                      autoComplete="quantity"
                      required
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="example: .01"
                    />
                  </div>
                  <div className="pt-2">
                    <h3 className="flex align-content-left font-semibold">Position Type</h3>
                    <label htmlFor="type" className="sr-only">
                      Position Type
                    </label>
                    <input
                      id="type"
                      name="type"
                      type="type"
                      ref={typeRef}
                      required
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="examples: 'STAKE' or 'LP' or 'HOLD'"
                    />
                  </div>
                  <div className="pt-4">
                    <button
                      type="submit"
                      className="bg-sky-500 hover:bg-sky-700 text-black font-bold py-2 px-4 rounded"
                      disabled = {loading}
                    >
                      Add Position
                    </button>
                  </div>
                  <div className="pt-2 pb-2">
                    <button className="bg-red-500 hover:bg-red-700 text-black font-bold py-2 px-4 rounded" onClick={() => {setEditPositions(false)}}>Cancel</button>
                  </div>
                </div>
              </form>
              <div className="px-10 border-t" action="#" onSubmit={handleSubmit}>
                <div className="pt-2 sm:px-6">
                  <h3 className="font-semibold">Search CoinGecko API</h3>
                  <input
                    id="search"
                    name="search"
                    autoComplete="off"
                    onChange={debouncedChangeHandler}
                    ref={searchRef}
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Search..."
                  />
                </div>
              </div>
            <div className="px-10 overflow-y-auto h-48 border-b">
              {searchResults && searchResults.map(result => {
                  return(
                    <div className="flex justify-center">
                      <div onClick={() => autofillAddPosition(result.api_symbol)} key={result.id} className="pt-2">{result.api_symbol}</div>
                    </div>
                  )
                })
              }
            </div>
        </div>}
      </div> 
    </div>   
  </div>
  )
}

