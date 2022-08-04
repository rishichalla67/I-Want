import React from 'react'
import { useEffect, useContext, useState} from 'react'
import {auth, db} from '../firebase'

const AuthContext = React.createContext()

export function useAuth() { 
    return useContext(AuthContext)
}

export function AuthProvider( { children } ) {
    const [currentUser, setCurrentUser] = useState()
    const [user, setUser] = useState()
    const [loading, setLoading] = useState(true)

    function signup(email, password){
        return auth.createUserWithEmailAndPassword(email, password)
    }

    function login(email, password){
        return auth.signInWithEmailAndPassword(email, password)
    }

    function logout(){
        return auth.signOut()
    }

    function resetPassword(email) {
        return auth.sendPasswordResetEmail(email)
    }

    // function getUser(){
    //     getUsers()
    // }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user)
            setLoading(false)
        })
        return unsubscribe
    }, [])
    

    const value = { 
        currentUser,
        login,
        logout,
        signup,
        resetPassword
    }

  return (
    <AuthContext.Provider value={value}>
        {!loading && children}
    </AuthContext.Provider>
  )
}
