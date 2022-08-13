import React, {useEffect, useState} from 'react'
import Nav from './Nav'
import { useAuth } from '../contexts/AuthContext'
import {db} from '../firebase'


export default function Friends() {
  const {currentUser} = useAuth()
  const [user, setUser] = useState([])
  const [error, setError] = useState([])
  const [allUsers, setAllUsers] = useState([])
  useEffect(() => {
    if(allUsers.length === 0){
      fetchAllUsers()
    }
  }, [])

  async function fetchAllUsers(){
    await db.collection("users").get()
    .then((snapshot) => {
      console.log(snapshot)
      if(snapshot.docs.length > 0){
        console.log(snapshot.docs.length)
        const tempUsers = []
        snapshot.docs.forEach((user)=>{
          tempUsers.push({
            id: user.data().id,
            firstName: user.data().firstName?user.data().firstName:'',
            lastName: user.data().lastName?user.data().lastName:'',
            photo: user.data().photo?user.data().photo:'',
            friends: user.data().friends?user.data().friends:[]
          })
          
        })
        setAllUsers(tempUsers)
      }
    })
  }


  return (
    <>
        <Nav/>
        <div className="pt-10 grid place-items-center">
          <div className="p-3 min-w-75% md:max-w-5xl bg-slate-100 rounded-lg border border-slate-500 shadow-lg items-center ">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-xl leading-6 font-medium text-gray-900">Friends</h3>
            </div>
            {error && error}
            <hr></hr>
            <div>
              {allUsers && allUsers.map((user) => {
                if(user.firstName === ''){return}
                return(
                <div key={user.id} className="pt-10 grid place-items-center">
                  {(user.firstName && user.photo) && 
                    <div className="p-3 min-w-75% md:max-w-5xl bg-slate-100 rounded-lg border border-slate-500 shadow-lg items-center">
                      {/* TODO: Make gradient be selected state */}
                      <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gradient-to-r from-sky-300 via-sky-400 to-sky-500">
                        <dt className="text-xl font-medium text-black flex items-center justify-center">{user.firstName}</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center justify-center">
                          {user.photo && <img className="h-48 w-40 rounded-lg" src={ user.photo } alt="" />}
                        </dd>
                      </div>
                    </div>
                  }
                </div>
                // <div key={user.id} className={'px-3 py-2 rounded-md text-sm font-medium'}>
                //   {user.photo && <img className="h-8 w-8 rounded-full" src={user.photo}/>}
                //   {user.firstName}
                // </div>
                )})}
            </div>
            <div className="pt-2">
                    <a href="" className="inline-flex justify-center w-full py-2 px-4 border border-transparent shadow-sm text-med font-medium rounded-md text-white bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-900">
                      Add Friends
                    </a>
                    </div>
          </div>
          
        </div>
        
    </>
  )
}
