import React, { Fragment, useState, useEffect } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { BellIcon, MenuIcon, XIcon } from "@heroicons/react/outline";
import { useAuth } from "../../contexts/AuthContext";
import { useFirestore } from "../../contexts/FirestoreContext";
import { useNavigate } from "react-router-dom";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Nav() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [error, setError] = useState();
  const [notifications, setNotifications] = useState();
  const { activeUser, getActiveUser, allUsers, dismissNotification } = useFirestore();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getActiveUser();
    const temp = [];
    if (activeUser.notifications !== undefined && notifications) {
      activeUser.notifications.forEach((notif) => {
        // console.log("notif: " + notif.requesterID)
        temp.push(notif.requesterID);
      });
      setNotifications(temp);
    }
  }, []);

  async function handleLogout() {
    setError("");
    await logout()
      .then(() => navigate)
      .catch((err) => setError(err.message));
  }

  // Add here for user specific menu
  const userNavigation = [
    { name: "Profile", href: "/profile" },
    { name: "Sign out", href: "", onClick: handleLogout },
  ];

  // Add here for more nav bar tabs
  const navigation = [
    { name: "Feed", href: "/", current: true },
    { name: "Friends", href: "/Friends", current: true }
  ];

  if (!activeUser.id) {
    return (
      <div className="flex items-center justify-center space-x-2">
        <div
          className="spinner-border animate-spin inline-block w-12 h-12 border-4 rounded-full"
          role="status"
        >
          <span className="visually-hidden"></span>
        </div>
      </div>
    );
  }

  return (
    <>
      {showModal ? (
        <>
          <Nav />
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-l my-6 mx-auto max-w-75%">
              <div className="border-0 rounded-lg shadow-lg relative bg-white outline-none focus:outline-none grid place-items-center">
                <div className=" justify-between p-5 border-b border-solid border-slate-200 rounded-t grid place-items-center">
                  <h3 className="text-3xl font-semibold">Notifications</h3>
                </div>
                <div className="p-6 flex-auto">
                  <ul className="list-reset">
                    {activeUser.notifications.map((notif) => {
                      return (
                        <li className="my-4 text-slate-500 text-lg leading-relaxed" key={notif.requesterID}>
                          <div className="bg-gradient-to-r from-sky-300 via-sky-400 to-sky-500 rounded-md p-2 flex">
                            <span className="font-semibold block text-center text-sm text-black pr-1 pt-2">
                              {notif.username}
                            </span>
                            <p className=" block text-sm text-center pt-2 text-black">
                              {notif.message}
                            </p>
                            <button onClick={() => dismissNotification(notif).then(getActiveUser())} className="mx-3 p-1 hover:bg-red-600 hover:text-white text-slate-800 px-1 border-none hover:border hover:border-blue-700 rounded font-bold text-lg">
                              Dismiss
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : (
        <Disclosure
          as="nav"
          className="bg-gradient-to-r from-sky-300 via-sky-400 to-sky-500"
        >
          {({ open }) => (
            <>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid justify-items-stretch">
                <div className="flex items-center justify-self-end h-16">
                  <div className="flex items-center">
                    <div className="flex-shrink-0"></div>
                    <div className="hidden md:block">
                      <div className="ml-10 flex items-baseline space-x-4">
                        {navigation.map((item) => (
                          <a
                            key={item.name}
                            href={item.href}
                            hidden={item.name === "Friends" && !activeUser.firstName}
                            className={classNames(
                              item.current
                                ? "bg-gray-900 text-white"
                                : "text-slate-900 hover:bg-gray-700 hover:text-white",
                              "px-3 py-2 rounded-md text-sm font-medium"
                            )}
                            aria-current={item.current ? "page" : undefined}
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
                        onClick={() => setShowModal(true)}
                        className="bg-gray-800 p-1 rounded-full text-slate-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                      >
                        <span className=" sr-only">View notifications</span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={classNames(
                                  activeUser.notifications.length > 0
                                    ? "animate-pulse"
                                    : "",
                                  "w-6 h-6"
                                )}
                                >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                        </svg>
                        {/* <BellIcon className="h-6 w-6" aria-hidden="true" /> */}
                      </button>

                      {/* Profile dropdown */}
                      <Menu as="div" className="ml-3 relative">
                        <div>
                          <Menu.Button className="max-w-xs bg-gray-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                            <span className="sr-only">Open user menu</span>
                            <img
                              className="h-8 w-8 rounded-full"
                              src={activeUser.photo && activeUser.photo}
                              alt=""
                            />
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
                                  item.current
                                    ? "bg-gray-900 text-white"
                                    : "text-slate-900 hover:bg-gray-700 hover:text-white",
                                  "block px-3 py-2 rounded-md text-base font-medium"
                                )}
                                aria-current={item.current ? "page" : undefined}
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
                        <MenuIcon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      )}
                    </Disclosure.Button>
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="md:hidden">
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                {navigation.map((item) => {
                  if (item.name === "Friends" && !activeUser.firstName) {
                    return null;
                  }
                  return (
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      href={item.href}
                      className={classNames(
                        item.current
                          ? "bg-gray-900 text-white"
                          : "text-slate-900 hover:bg-gray-700 hover:text-white",
                        "block px-3 py-2 rounded-md text-base font-medium"
                      )}
                      aria-current={item.current ? "page" : undefined}
                    >
                      {item.name}
                    </Disclosure.Button>
                  );
                })}
                </div>
                <div className="pt-4 pb-3 border-t border-gray-700">
                  <div className="px-2 space-y-1">
                    <button
                      type="button"
                      onClick={() => setShowModal(true)}
                      className="bg-gray-800 p-1 rounded-full text-slate-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                    >
                      <span className="sr-only">View notifications</span>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                      </svg>

                      {/* <BellIcon className="animate-ping h-6 w-6" aria-hidden="true" /> */}
                    </button>
                    {userNavigation.map((item) => (
                      <Disclosure.Button
                        key={item.name}
                        as="a"
                        hidden={!activeUser.firstName && item.name === "Friends" }
                        onClick={item.onClick}
                        href={item.href}
                        className="block px-3 py-2 rounded-md text-base font-medium text-sky-blue hover:text-white hover:bg-gray-700 cursor-pointer"
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
      )}

      <div role="alert" hidden={activeUser.firstName}>
        <div className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
          <p>Please update your profile to include your first name!</p>
          <p>This allows you to be added as a friend</p>
          <div className="pt-2">
            <a
              href="/profile"
              className="inline-flex justify-center w- py-2 px-4 border border-transparent shadow-sm text-med font-medium rounded-md text-white bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Edit Profile
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
