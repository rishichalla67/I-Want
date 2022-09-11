import React, { useState, useEffect, useRef } from 'react'
import { useCryptoOracle } from '../contexts/CryptoContext'
import { useFirestore } from '../contexts/FirestoreContext'
import {Position} from '../Classes/Position'
import { PricePoint } from '../Classes/PricePoint'

const PORTFOLIO_ID = "rishiChalla"

export default function CryptoPortfolio() {
    const symbolRef = useRef()
    const quantityRef = useRef()
    const typeRef = useRef()
    const [portfolioValue, setPortfolioValue] = useState(0)
    const [editPositions, setEditPositions] = useState(false)
    const [portfolioPositions, setPortfolioPositions] = useState([])
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { nomicsTickers, refreshOraclePrices } = useCryptoOracle()
    const { allPortfolioIds, getPortfolio, addPosition, removePosition, recordPortfolioValue } = useFirestore()

    useEffect(() => {
      setLoading(true)
      if(portfolioValue === 0){
        getPortfolioData()
      }
        
        

        const interval=setInterval(()=>{
          if(portfolioValue !== 0){
            recordPortfolioValue(PricePoint(getCurrentDate(), portfolioValue), PORTFOLIO_ID).catch(err => setError(err.message))
          }
          refreshOraclePrices()
          calculatePortfolioValue(portfolioPositions)
         },180000)
           
         setLoading(false)
         return()=>clearInterval(interval)
         
      }, [])

    async function getPortfolioData(){
      const portfolio = await getPortfolio(PORTFOLIO_ID)
      calculatePortfolioValue(portfolio)
    }

    function getCurrentDate(){
      var tempDate = new Date();
      var date = tempDate.getFullYear() + '-' + (tempDate.getMonth()+1) + '-' + tempDate.getDate() +' '+ tempDate.getHours()+':'+ tempDate.getMinutes()+':'+ tempDate.getSeconds();
      return(date)
    }

    function calculatePortfolioValue(portfolio){
      let totalSum = 0
      let positionsList = []
      console.log(portfolio)
      const positions = portfolio.positions
      if(positions.length > 0){
        positions.forEach(position => {
          positionsList.push(position)
          console.log(nomicsTickers[position.symbol])
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
      // recordPortfolioValue(PricePoint(getCurrentDate(), totalSum.toFixed(2)), PORTFOLIO_ID).catch(err => setError(err.message))
    }

    async function handleSubmit(e) {
      e.preventDefault()
      
      setLoading(true)
      await addPosition(Position(symbolRef.current.value, quantityRef.current.value, typeRef.current.value), PORTFOLIO_ID).catch(err => setError(err.message))
      setLoading(false)
      
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
      <div className="h-screen bg-gradient-to-r from-sky-400 via-sky-400 to-sky-500">
        <div className="text-white pt-3 grid place-items-center">
          <div className="bg-black min-w-95% min-h-98vh md:max-w-5xl rounded-lg border border-slate-500 shadow-lg items-center ">
          {!editPositions ? 
            <div>
              <div className="flex justify-center px-4 py-5 sm:px-6">
                <h3 className="text-xl leading-6 font-medium">Rishi's Crypto Portfolio</h3>
                
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
              {/* <LineChart width={730} height={250} data={}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="pv" stroke="#8884d8" />
                <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
              </LineChart> */}
              <div className="flex flex-col justify-center px-4 py-5 sm:px-6 pt-10 border-gray-200">
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
                        {`$${(parseFloat(position.quantity)*parseFloat(nomicsTickers[position.symbol].usd)).toFixed(2)}`}
                      </div>
                    </div> 
                )})}
              </div>
            </div> :
            <div>
              <div className="flex justify-center px-4 py-5 sm:px-6">
                <h3 className="text-xl leading-6 font-medium">Crypto Portfolio</h3>
              </div>
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
                      className="appearance-none rounded-none w-full relative block px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      placeholder="example: BTC"
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
                      className="appearance-none rounded-none w-full relative block px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md rounded-b-md  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
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
                      className="appearance-none rounded-none w-full relative block  px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md rounded-b-md  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      placeholder="examples: 'STAKE' or 'LP' or 'HOLD'"
                    />
                  </div>
                  <div className="pt-4">
                    <button
                      type="submit"
                      className="bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded"
                      disabled = {loading}
                    >
                      Add Position
                    </button>
                  </div>
                  
                </div>
              </form>
              </div>}
              <div className="pt-2">
                {editPositions ?  <button className="bg-red-500 hover:bg-red-700 text-black font-bold py-2 px-4 rounded" onClick={() => {setEditPositions(false)}}>Cancel</button> : <button className="bg-sky-500 hover:bg-sky-700 text-slate-100 font-bold py-2 px-4 rounded" onClick={() => {setEditPositions(true)}}>Add Position</button>}
              </div>
          </div> 
        </div>
      </div>
    )
}

