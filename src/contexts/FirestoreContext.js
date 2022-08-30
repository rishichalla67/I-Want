import React from 'react'
import { useEffect, useContext, useState} from 'react'
import {db} from '../firebase'
import { useAuth } from './AuthContext'
import { doc, getDoc } from "firebase/firestore";


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


    useEffect(() => {
        if(allUsers.length === 0){
            fetchAllUsers()
            getUsers()
            setLoading(false)
          }
    }, [])
    

    const value = { 
        allUsers,
        activeUser,
        getUsers,
        notifications,
        refreshUser
    }

  return (
    <FirestoreContext.Provider value={value}>
        {!loading && children}
    </FirestoreContext.Provider>
  )
}