import React, { useState, useEffect } from 'react'
import Nav from '../components/Nav'
import { useFirestore } from '../contexts/FirestoreContext'

export default function Home() {
  const {activeUser} = useFirestore()

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
      <div className="min-h-full">
        <Nav/>
        <header className="bg-white shadow" >
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 ">
            <h1 className="text-3xl font-bold text-gray-900">
                Home Feed
            </h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 font-bold">
            Hey {activeUser.username}!
          </div>
          <div>
            The Feed is still in development, 
          </div>
          <div>
            please feel free to test other functionality!
          </div>
        </main>
      </div>
    </>
  )
}