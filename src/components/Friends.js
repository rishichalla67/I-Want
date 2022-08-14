import React, {useEffect, useState} from 'react'
import Nav from './Nav'
import { useAuth } from '../contexts/AuthContext'
import { useFirestore, getUsers } from '../contexts/FirestoreContext'
import {db} from '../firebase'
import { arrayRemove, arrayUnion} from 'firebase/firestore'
import { Notification } from '../Classes/Notification'


export default function Friends() {
  const {currentUser} = useAuth()
  const  {allUsers, activeUser, getUsers  } = useFirestore()
  const [error, setError] = useState([])

  useEffect(() => {
    getUsers()
  }, [])

  const addFriend = async(friendID) => {
    console.log(activeUser)
    await db.collection("users").doc(activeUser.id).update({
      friends: arrayUnion(friendID)
    }).then(() =>{
      getUsers()
      updateNotification(friendID)
    })
    
  }

  async function updateNotification(friendID){
    await db.collection("users").doc(friendID).update({
      notifications: arrayUnion(Notification(activeUser.id))
    }).then(() =>{
      console.log('Requested ' + friendID + 'to friends list')
      getUsers()
    })
  }

  const removeFriend = async(friendID) => {
    await db.collection("users").doc(activeUser.id).update({
      friends: arrayRemove(friendID)
    }).then(() =>{
      console.log('Removed ' + friendID + 'to friends list')
      getUsers()
    })
  }

  if(!activeUser.id){
    return (
      <div className="flex items-center justify-center space-x-2">
        <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 rounded-full" role="status">
          <span className="visually-hidden"></span>
        </div>
      </div>
    )
  }

  return (
    <>
        <Nav/>
        <div className="pt-10 grid place-items-center">
          <div className="p-3 min-w-90% md:max-w-5xl bg-slate-100 rounded-lg border border-slate-500 shadow-lg items-center">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-4xl leading-6 font-medium text-gray-900">My Friends</h3>
            </div>
            {error && error}
            {allUsers && allUsers.map((user) => {
                if(user.firstName === '' || !activeUser.friends.includes(user.id)){return}
                return(
                <div key={user.id} className="pt-10 grid place-items-center pb-5">
                  {activeUser.friends.includes(user.id) && 
                    <div className="p-3 min-w-75% md:max-w-5xl bg-slate-100 rounded-lg border border-slate-500 shadow-lg items-center">
                      {/* TODO: Make gradient be selected state */}
                      <div  className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gradient-to-r from-sky-300 via-sky-400 to-sky-500">
                        <dt className="text-xl font-medium text-black flex items-center justify-center">{user.firstName}</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center justify-center">
                          {user.photo && <img className="h-48 w-40 rounded-lg" src={ user.photo } alt="" />}
                        </dd>
                      </div>
                      <div onClick={() => removeFriend(user.id) } className="pt-2 hover:cursor-pointer hover:bg-">
                        {activeUser.friends.includes(user.id) && <a className="inline-flex justify-center w-full py-2 px-4 border border-transparent shadow-sm text-med font-medium rounded-md text-white bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-900">
                          Remove Friend
                        </a>}  
                        
                      </div>
                    </div>
                    
                  }
                </div>
                )})}
            <hr className="border-2 border-sky-300 drop-shadow-xl"></hr>
            <div>
              <div className="px-4 pt-5 sm:px-6">
                <h3 className="text-4xl leading-6 font-medium text-gray-900">Add Friends</h3>
              </div>
              {allUsers && allUsers.map((user) => {
                if(user.firstName === '' || activeUser.friends.includes(user.id)){return}
                return(
                <div key={user.id} className="pt-10 grid place-items-center">
                  {(user.firstName && user.photo && user.id !== activeUser.id) && 
                    <div className="p-3 min-w-75% md:max-w-5xl bg-slate-100 rounded-lg border border-slate-500 shadow-lg items-center">
                      {/* TODO: Make gradient be selected state */}
                      <div  className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gradient-to-r from-sky-300 via-sky-400 to-sky-500">
                        <dt className="text-xl font-medium text-black flex items-center justify-center">{user.firstName}</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center justify-center">
                          {user.photo && <img className="h-48 w-40 rounded-lg" src={ user.photo } alt="" />}
                        </dd>
                      </div>
                      <div onClick={() => addFriend(user.id) } className="pt-2 hover:cursor-pointer hover:bg-">
                        {!activeUser.friends.includes(user.id) && <a className="inline-flex justify-center w-full py-2 px-4 border border-transparent shadow-sm text-med font-medium rounded-md text-white bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-900">
                          Add Friend
                        </a>}  
                        
                      </div>
                      <div onClick={() => removeFriend(user.id) } className="pt-2 hover:cursor-pointer hover:bg-">
                        {activeUser.friends.includes(user.id) && <a className="inline-flex justify-center w-full py-2 px-4 border border-transparent shadow-sm text-med font-medium rounded-md text-white bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-900">
                          Remove Friend
                        </a>}  
                        
                      </div>
                    </div>
                    
                  }
                </div>
                )})}
            </div>
          </div>
          
        </div>
        
    </>
  )
}