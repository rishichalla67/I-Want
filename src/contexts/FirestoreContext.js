import React from 'react'
import { useEffect, useContext, useState} from 'react'
import {db} from '../firebase'
import { useAuth } from './AuthContext'
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";


const FirestoreContext = React.createContext()

export function useFirestore() { 
    return useContext(FirestoreContext)
}

export function FirestoreProvider( { children } ) {
    const {currentUser} = useAuth()
    const [activeUser, setActiveUser] = useState([])
    const [allUsers, setAllUsers] = useState([])
    const [notifications, setNotifications] = useState([])
    const [loading, setLoading] = useState(true)
    const [allPortfolioIds, setAllPortfolioIds] = useState([])
    const [tickerList, setTickerList] = useState([])

    useEffect(() => {
      if(allUsers.length === 0){
          fetchAllUsers()
          getUsers()
          setLoading(false)
        }
        getPortfolioIds()
        getPortfolioTickerList()
  }, [])


    // CRYPTO PORTFOLIO FUNCTIONS

    async function getPortfolioIds(){
      const portfolios = await db.collection("portfolios").get()
      let ids = []
      portfolios.forEach((portfolio) => {
        ids.push(portfolio.id)
      })
      setAllPortfolioIds(ids)
    }

    async function getPortfolioTickerList(){
      const docRef = doc(db, "portfolios", "tickerList");
      const portfolio = await getDoc(docRef);
      if(portfolio.exists()){
        console.log(portfolio.data().tickers)
        setTickerList(portfolio.data().tickers)
        return(portfolio.data().tickers)
      }    
    }
    
    async function addTicker(ticker){
      if(!tickerList.includes(ticker)){
        const portfolioPositionsRef = doc(db, "portfolios", "tickerList")
        await updateDoc(portfolioPositionsRef, {
          tickers: arrayUnion(ticker)
        })
      }
    }

    async function getPortfolio(portfolioId){
      const docRef = doc(db, "portfolios", portfolioId);
      const portfolio = await getDoc(docRef);
      if(portfolio.exists()){
        return(portfolio.data())
      }    
    }

    async function addPosition(position, portfolioName){
      const portfolioPositionsRef = doc(db, "portfolios", portfolioName)
      await updateDoc(portfolioPositionsRef, {
        positions: arrayUnion(position)
      })
    }

    async function removePosition(position, portfolioName){
      const portfolioPositionsRef = doc(db, "portfolios", portfolioName)
      await updateDoc(portfolioPositionsRef, {
        positions: arrayRemove(position)
      })
    }

    async function recordPortfolioValue(record, portfolioName){
      const portfolioPositionsRef = doc(db, "portfolios", portfolioName)
      await updateDoc(portfolioPositionsRef, {
        portfolioValueHistory: arrayUnion(record)
      })
    }

    async function cleanupDuplicatesInHistorical(portfolioName){
      const docRef = doc(db, "portfolios", portfolioName);
      const portfolio = await getDoc(docRef);
      let duplicatePricePoints = []
      const portfolioValueHistory = portfolio.data().portfolioValueHistory
      if(portfolio.exists()){
        let prev = 0
        portfolioValueHistory.forEach((pricePoint) => {
          if(prev === 0){
            prev = pricePoint.value
          }
          else if(prev === pricePoint.value){
            duplicatePricePoints.push(pricePoint)
          }
          prev = pricePoint.value
        })
      } 
      if(duplicatePricePoints.length !== 0){
        const portfolioPositionsRef = doc(db, "portfolios", portfolioName)
        await updateDoc(portfolioPositionsRef, {
          portfolioValueHistory: arrayRemove(...duplicatePricePoints)
        })
        console.log("Removed duplicate values: " + duplicatePricePoints.map((duplicate) => {return(duplicate.date, duplicate.value)}))
      }
      
    }

    // USER FUNCTIONALITY

    async function fetchAllUsers(){
        await db.collection("users").get()
        .then((snapshot) => {
          if(snapshot.docs.length > 0){
            const tempUsers = []
            snapshot.docs.forEach((user)=>{
                if(user.data().email === currentUser.email){
                    setActiveUser(user.data())
                    setNotifications(user.data().notifications)
                }
              tempUsers.push({
                id: user.data().id,
                firstName: user.data().firstName?user.data().firstName:'',
                lastName: user.data().lastName?user.data().lastName:'',
                photo: user.data().photo?user.data().photo:'',
                friends: user.data().friends?user.data().friends:[],
                notifications: user.data().notifications?user.data().notifications:[],
                username: user.data().username
              })
              
            })
            setAllUsers(tempUsers)
            
          }
        }).catch()
      }

      async function refreshUser(id) {
        const docRef = doc(db, "users", id);
        const user = await getDoc(docRef);
        if(user.exists()){
          setActiveUser(user.data())
          console.log(user.data())
        }         
      }
      
      async function getUsers() {
        const response=db.collection('users');
        const data=await response.get();
        const temp = []
        data.docs.forEach(item=>{
          if(item.data().email === currentUser.email){
            setActiveUser(item.data())
            temp.push(item.data())
          }
        })
        return temp
      }


    
    

    const value = { 
        allUsers,
        activeUser,
        getUsers,
        notifications,
        refreshUser,
        allPortfolioIds,
        getPortfolio,
        addPosition,
        removePosition,
        recordPortfolioValue,
        cleanupDuplicatesInHistorical,
        tickerList,
        addTicker,
        getPortfolioTickerList
    }

  return (
    <FirestoreContext.Provider value={value}>
        {!loading && children}
    </FirestoreContext.Provider>
  )
}