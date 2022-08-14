import React, {useState, useEffect, useRef} from 'react'
import Nav from './Nav'
import { useAuth } from '../contexts/AuthContext'
import {db} from '../firebase'
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"
import {useNavigate} from 'react-router-dom'

export default function EditProfile() {
    const bioRef = useRef()
    const firstNameRef = useRef()
    const lastNameRef = useRef()
    const streetAddressRef = useRef()
    const cityRef = useRef()
    const countryRef = useRef()
    const stateRef = useRef()
    const postalCodeRef = useRef()
    const {currentUser} = useAuth()
    const storage = getStorage()
    const [error, setError] = useState('')
    const [photoURL, setPhotoURL] = useState('')
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
      getUsers()
    }, [])
    
    const getUsers=async()=>{
      const response=db.collection('users');
      const data=await response.get();
      data.docs.forEach(item=>{
        if(item.data().email === currentUser.email){
          setUser(item.data())
        }
      })
      
    }

    async function uploadPhoto(photoFile) {
        setLoading(true)
        console.log(photoFile)
        const fileRef = ref(storage, 'pfp' + '/' + user.id)
        await uploadBytes(fileRef, photoFile).then(
            await getDownloadURL(fileRef)
            .then(function(url){
              setPhotoURL(url)
              setLoading(false)
            })
          ).catch(err => setError(err.message))
        
    }


    const updateUser = (URL) => {
      db.collection("users").doc(user.id).update({
        photo: user.photo ? user.photo : URL,
        bio : bioRef.current.value!==''? bioRef.current.value :user.bio,
        firstName : firstNameRef.current.value!==''? firstNameRef.current.value :user.firstName,
        lastName : lastNameRef.current.value!==''? lastNameRef.current.value :user.lastName,
        street : streetAddressRef.current.value!==''? streetAddressRef.current.value :user.street,
        city : cityRef.current.value!==''? cityRef.current.value :user.city,
        country : countryRef.current.value!==''? countryRef.current.value :user.country,
        state : stateRef.current.value!==''? stateRef.current.value :user.state,
        postalCode : postalCodeRef.current.value!==''? postalCodeRef.current.value :user.postalCode
      }).then(() => {
        navigate('/profile')
      }).catch(err => setError(err.message));
    }

    async function saveProfile(e) {
      e.preventDefault()
      
      setError("")
      setLoading(true)
      updateUser(photoURL)
      setLoading(false)
  }
  
  if(user.firstName){
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
        <div className='pt-10 grid place-items-center'>
            <div className="md:max-w-7xl bg-slate-100 rounded-lg border border-slate-500 shadow-lg items-center ">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-xl leading-6 font-medium text-gray-900">Profile</h3>
                </div>
                {error && <div role="alert">
                  <div className="bg-red-500 text-white font-bold rounded-t px-4 py-2">
                      Error
                  </div>
                  <div className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
                      <p>{error}</p>
                  </div>
                </div>}
                <form action="#" onSubmit={saveProfile}>
                <div className="shadow sm:rounded-md sm:overflow-hidden">
                    <div className="px-4 py-5 bg-white space-y-6 sm:p-6">

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Photo</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md" disabled={loading}>
                          <div className="space-y-1 text-center">
                            <span className="inline-block h-12 w-12 rounded-full overflow-hidden ">
                                <img className="h-12 w-12 rounded-full" disabled={user.photo === '' && photoURL !== ''} src={ user.photo } alt="" />
                                <img className="h-12 w-12 rounded-full" disabled={photoURL !== ''} src={ photoURL } alt="" />
                            </span>
                            <div className="flex text-sm text-gray-600">
                              <label
                                  htmlFor="file-upload"
                                  className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                              >
                                  <span className="hidden md:block">Upload a file</span>
                                  <span className="pl-6 md:hidden">Upload a file</span>
                                  
                                  <input id="file-upload" name="file-upload" type="file" accept=".png" onChange={(e) => {
                                    uploadPhoto(e.target.files[0])
                                    console.log(e.target.files)
                                    }} className="sr-only" />
                              </label>
                              <p className="pl-1 hidden md:block">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                          </div>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="about" className="block text-sm font-medium text-gray-700">
                        Bio
                        </label>
                        <div className="mt-1">
                        <textarea
                            id="about"
                            name="about"
                            ref={bioRef}
                            rows={3}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md placeholder-gray-400"
                            placeholder={user.bio && user.bio}
                            // defaultValue={user.bio && user.bio}
                        />
                        </div>
                    </div>

                    <div className="px-4 py-5 bg-white sm:p-6">
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                        First name
                      </label>
                      <input
                        type="text"
                        name="first-name"
                        id="first-name"
                        ref={firstNameRef}
                        placeholder={user.firstName && user.firstName}
                        // defaultValue={user.firstName && user.firstName}
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md placeholder-gray-400"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
                        Last name
                      </label>
                      <input
                        type="text"
                        name="last-name"
                        id="last-name"
                        ref={lastNameRef}
                        placeholder={user.lastName && user.lastName}
                        // defaultValue={user.lastName && user.lastName}
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md placeholder-gray-400"
                      />
                    </div>

                    <div className="col-span-6">
                      <label htmlFor="street-address" className="block text-sm font-medium text-gray-700">
                        Street address
                      </label>
                      <input
                        type="text"
                        name="street-address"
                        id="street-address"
                        ref={streetAddressRef}
                        placeholder={user.street && user.street}
                        // defaultValue={user.street && user.street}
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md placeholder-gray-400"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        id="city"
                        ref={cityRef}
                        placeholder={user.city && user.city}
                        // defaultValue={user.city && user.city}
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md placeholder-gray-400"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                      <label htmlFor="region" className="block text-sm font-medium text-gray-700">
                        State / Province
                      </label>
                      <input
                        type="text"
                        name="region"
                        id="region"
                        ref={stateRef}
                        placeholder={user.state && user.state}
                        // defaultValue={user.state && user.state}
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md placeholder-gray-400"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                      <label htmlFor="postal-code" className="block text-sm font-medium text-gray-700">
                        ZIP / Postal code
                      </label>
                      <input
                        type="text"
                        name="postal-code"
                        id="postal-code"
                        ref={postalCodeRef}
                        placeholder={user.postalCode && user.postalCode}
                        // defaultValue={user.postalCode && user.postalCode}
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md placeholder-gray-400"
                      />
                    </div>
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="country" className="block text-sm font-medium text-gray-700 pt-3">
                        Country
                      </label>
                      <input
                        id="country"
                        name="country"
                        ref={countryRef}
                        placeholder={user.country && user.country}
                        // defaultValue={user.country && user.country}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm placeholder-gray-400"
                      >
                        
                      </input>
                    </div>
                </div>
                    
                    </div>
                    <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex justify-center w-full py-2 px-4 border border-transparent shadow-sm text-med font-medium rounded-md text-white bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Save
                    </button>
                    <div className="pt-2">
                    <a href="/profile" className="inline-flex justify-center w-full py-2 px-4 border border-transparent shadow-sm text-med font-medium rounded-md text-white bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                      Cancel
                    </a>
                    </div>
                    
                    </div>
                </div>
                </form>
            </div>
            {/* </div> */}
      </div>

      <div className="hidden sm:block" aria-hidden="true">
        <div className="py-5">
          <div className="border-t border-gray-200" />
        </div>
      </div>


      {/* <div className="hidden sm:block" aria-hidden="true">
        <div className="py-5">
          <div className="border-t border-gray-200" />
        </div>
      </div> */}
    </>
  )
}
