import React, { Fragment, useState, useEffect } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { BellIcon, MenuIcon, XIcon } from '@heroicons/react/outline'
import { useAuth } from '../contexts/AuthContext'
import { db } from '../firebase'
import { useNavigate} from 'react-router-dom'
  
  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  

export default function Nav() {
  const navigate = useNavigate()
  const {currentUser, logout} = useAuth()
  const [error, setError] = useState()
  const [user, setUser] = useState([])

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

  async function handleLogout() {
    setError("")

    await logout()
    .then(() => navigate)
    .catch(err => setError(err.message))
  }

  const navigateProfile = () => {
    navigate('/profile');
  }  

  // Add here for user specific menu
  const userNavigation = [
    { name: 'Profile', href: '/profile', },
    { name: 'Sign out', href: '', onClick: handleLogout},
  ]

  // Add here for more nav bar tabs
  const navigation = [
    { name: 'Feed', href: '/', current: true },
    { name: 'Friends', href: '/Friends', current: true },

  ]



  return (
    <>
        <Disclosure as="nav" className="bg-gradient-to-r from-sky-300 via-sky-400 to-sky-500">
          {({ open }) => (
            <>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid justify-items-stretch">
                <div className="flex items-center justify-self-end h-16">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {/* <img
                        className="h-8 w-8"
                        src='assets\logo.jpg'
                        alt="Workflow"
                      /> */}
                    </div>
                    <div className="hidden md:block">
                      <div className="ml-10 flex items-baseline space-x-4">
                        {navigation.map((item) => (
                          <a
                            key={item.name}
                            href={item.href}
                            className={classNames(
                              item.current
                                ? 'bg-gray-900 text-white'
                                : 'text-slate-900 hover:bg-gray-700 hover:text-white',
                              'px-3 py-2 rounded-md text-sm font-medium'
                            )}
                            aria-current={item.current ? 'page' : undefined}
                          >
                            {item.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-4 flex items-center md:ml-6">
                      <button
                        type="button"
                        className="bg-gray-800 p-1 rounded-full text-slate-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                      >
                        <span className="sr-only">View notifications</span>
                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                      </button>

                      {/* Profile dropdown */}
                      <Menu as="div" className="ml-3 relative">
                        <div>
                          <Menu.Button className="max-w-xs bg-gray-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                            <span className="sr-only">Open user menu</span>
                            <img className="h-8 w-8 rounded-full" src={user.photo && user.photo} alt="" />
                          </Menu.Button>
                        </div>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none hover:text-white">
                          {userNavigation.map((item) => (
                                <Disclosure.Button
                                key={item.name}
                                as="a"
                                onClick={item.onClick}
                                href={item.href}
                                className={classNames(
                                    item.current ? 'bg-gray-900 text-white' : 'text-slate-900 hover:bg-gray-700 hover:text-white',
                                    'block px-3 py-2 rounded-md text-base font-medium'
                                )}
                                aria-current={item.current ? 'page' : undefined}
                                >
                                {item.name}
                                </Disclosure.Button>
                            ))}  
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                  </div>
                  <div className="-mr-2 flex md:hidden">
                    {/* Mobile menu button */}
                    <Disclosure.Button className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XIcon className="block h-6 w-6" aria-hidden="true" />
                      ) : (
                        <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                      )}
                    </Disclosure.Button>
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="md:hidden">
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                  {navigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      href={item.href}
                      className={classNames(
                        item.current ? 'bg-gray-900 text-white' : 'text-slate-900 hover:bg-gray-700 hover:text-white',
                        'block px-3 py-2 rounded-md text-base font-medium'
                      )}
                      aria-current={item.current ? 'page' : undefined}
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
                <div className="pt-4 pb-3 border-t border-gray-700">
                  <div className="px-2 space-y-1">
                    {userNavigation.map((item) => (
                      <Disclosure.Button
                        key={item.name}
                        as="a"
                        onClick={item.onClick}
                        href={item.href}
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-white hover:bg-gray-700 cursor-pointer"
                      >
                        {item.name}
                      </Disclosure.Button>
                    ))}
                  </div>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
        
        <div role="alert" hidden={user.firstName}>
          <div className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
              <p>Please update your profile to include your first name!</p>
              <p>This allows you to be added as a friend</p>
              <div className="pt-2">
                    <a href="/edit-profile" className="inline-flex justify-center w- py-2 px-4 border border-transparent shadow-sm text-med font-medium rounded-md text-white bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                      Edit Profile
                    </a>
              </div>
                    
          </div>
        </div>
    </>
  )
}
