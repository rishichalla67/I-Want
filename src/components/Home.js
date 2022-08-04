import React, { useState } from 'react'
import Nav from '../components/Nav'
import { useAuth } from '../contexts/AuthContext'

export default function Home() {
    const {currentUser, user} = useAuth()
    
  return (
    <>
      <div className="min-h-full">
        <Nav/>
        <header className="bg-white shadow bg-slate-100" >
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 ">
            <h1 className="text-3xl font-bold text-gray-900">
                Home Feed
            </h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 font-bold">
            Hey {currentUser.email}!
          </div>
          <div>
            The Feed is still in development, but thank you for joining
          </div>
        </main>
      </div>
    </>
  )
}