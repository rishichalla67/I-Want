import React, { useEffect, useState } from "react";
import Nav from "./Nav/Nav";
import { useFirestore } from "../contexts/FirestoreContext";
import { db } from "../firebase";
import { arrayRemove, arrayUnion } from "firebase/firestore";
import { Notification } from "../Classes/Notification";
import { TabList, Tab, TabPanel } from 'react-tabs';
import Button from '@material-ui/core/Button';


export default function Friends() {
  const { allUsers, activeUser, fetchAllUsers } = useFirestore();
  const [activeTab, setActiveTab] = useState('my-friends');
  const [error, setError] = useState([]);

  useEffect(() => {
    fetchAllUsers();
  }, []);
  
  const addFriend = async (friendID, friendUsername) => {
    // DECOM
    await db
      .collection("users")
      .doc(activeUser.id)
      .update({
        friends: arrayUnion(friendUsername),
      })
      .then(() => {
        fetchAllUsers();
        sendFriendRequest(friendID);
      });
  };

  async function sendFriendRequest(friendID, friendUsername) {
    await db
      .collection("users")
      .doc(friendID)
      .update({
        notifications: arrayUnion(
          Notification(
            friendUsername,
            " has requested to be your friend...",
            activeUser.id,
            activeUser.username,
            activeUser.firstName,
            "friendRequest"
          )
        ),
      })
      .then(() => {
        console.log("Requested " + friendID + " to friends list");
        fetchAllUsers();
      });

      await db
      .collection("users")
      .doc(activeUser.id)
      .update({
        notifications: arrayUnion(
          Notification(
            friendUsername,
            " has recieved your friend request",
            activeUser.id,
            activeUser.username,
            activeUser.firstName,
            "pendingFriendRequest"
          )
        ),
      })
      .then(() => {
        fetchAllUsers();
      });
  }

  async function removeNotification(id, notification) {
    await db
      .collection("users")
      .doc(id)
      .update({
        notifications: arrayRemove(
          notification
        ),
      })
      .then(() => {
        fetchAllUsers();
      });
  }

  const acceptFriendRequest = async (notification) => {
    await db
    .collection("users")
    .doc(activeUser.id)
    .update({
      friends: arrayUnion(notification.requesterUsername),
    })
    .then(() => {
      fetchAllUsers();
      removeNotification(activeUser.id, notification);
    });
    await db
    .collection("users")
    .doc(notification.requesterID)
    .update({
      friends: arrayUnion(activeUser.username),
    })
    .then(() => {
      let notif = notification;
      notif.message = " has recieved your friend request"
      console.log(notif)
      removeNotification(notif.requesterID, notif)
      fetchAllUsers();
    });
  }

  const removeFriend = async (friendUsername) => {
    await db
      .collection("users")
      .doc(activeUser.id)
      .update({
        friends: arrayRemove(friendUsername),
      })
      .then(() => {
        console.log("Removed " + friendUsername + "from friends list");
        fetchAllUsers();
      });
  };

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
      <Nav />
      <div className="pt-10 grid place-items-center">
        <div className="p-3 max-w-55% md:max-w-5xl md: bg-slate-100 rounded-lg border border-slate-500 shadow-lg items-center">
          <div className="relative flex-1 flex flex-col">
            {error && error}
            <div className="bg-gray-100 px-2 py-1 border-b border-gray-200">
              <div className="flex justify-start items-center">
                <button
                  className={`${
                    activeTab === 'my-friends' ? 'bg-gradient-to-r from-sky-300 via-sky-400 to-sky-500' : 'bg-white'
                  } rounded-t-md py-2 px-4 mx-1 font-semibold text-gray-700 text-lg md:text-xl lg:text-2xl hover:text-gray-900 focus:outline-none focus:shadow-outline-blue active:bg-blue-800`}
                  onClick={() => setActiveTab('my-friends')}
                >
                  My Friends
                </button>
                <button
                  className={`${
                    activeTab === 'pending-friends' ? 'bg-gradient-to-r from-sky-300 via-sky-400 to-sky-500' : 'bg-white'
                  } rounded-t-md py-2 px-4 mx-1 font-semibold text-gray-700 text-lg md:text-xl lg:text-2xl hover:text-gray-900 focus:outline-none focus:shadow-outline-blue active:bg-blue-800`}
                  onClick={() => setActiveTab('pending-friends')}
                >
                  Pending Friends
                </button>
                <button
                  className={`${
                    activeTab === 'add-friends' ? 'bg-gradient-to-r from-sky-300 via-sky-400 to-sky-500' : 'bg-white'
                  } rounded-t-md py-2 px-4 mx-1 font-semibold text-gray-700 text-lg md:text-xl lg:text-2xl hover:text-gray-900 focus:outline-none focus:shadow-outline-blue active:bg-blue-800`}
                  onClick={() => setActiveTab('add-friends')}
                >
                  Add Friends
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {activeTab === 'my-friends' && (
                <>
                  {allUsers &&
                    allUsers.map((user) => {
                      if (
                        user.firstName === "" ||
                        !activeUser.friends.includes(user.username)
                      ) {
                        return;
                      }
                      return (
                        <div
                          key={user.id}
                          className="pt-10 grid place-items-center pb-5"
                        >
                          {activeUser.friends.includes(user.username) && (
                            <div className="p-3 min-w-75% md:max-w-5xl bg-slate-100 rounded-lg border border-slate-500 shadow-lg items-center">
                              <div className="sm:hidden bg-gray-50 px-4 py-5 bg-gradient-to-r from-sky-300 via-sky-400 to-sky-500">
                                <div className="text-xl font-medium text-black flex items-center justify-center">
                                  {user.firstName}
                                </div>
                                <div className="align-items">{user.username}</div>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center justify-center">
                                  {user.photo && (
                                    <img
                                      className="h-48 w-40 rounded-lg"
                                      src={user.photo}
                                      alt=""
                                    />
                                  )}
                                </dd>
                              </div>
                              <div className="hidden bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gradient-to-r from-sky-300 via-sky-400 to-sky-500">
                                <div className="text-xl font-medium text-black flex items-center justify-center">
                                  {user.firstName}
                                </div>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center justify-center">
                                  {user.photo && (
                                    <img
                                      className="h-48 w-40 rounded-lg"
                                      src={user.photo}
                                      alt=""
                                    />
                                  )}
                                </dd>
                              </div>
                              <div
                                onClick={() => removeFriend(user.username)}
                                className="pt-2 hover:cursor-pointer hover:bg-"
                              >
                                {activeUser.friends.includes(user.username) && (
                                  <a className="inline-flex justify-center w-full py-2 px-4 border border-transparent shadow-sm text-med font-medium rounded-md text-white bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-900">
                                    Remove Friend
                                  </a>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </>
              )}
              {activeTab === 'pending-friends' && (
                <>
                  <div className="p-6 flex-auto">
                    <ul className="list-reset">
                      {activeUser.notifications.map((notif) => {
                        if(notif.notificationType === "friendRequest"){
                          return (
                            <li className="my-4 text-slate-500 text-lg leading-relaxed" key={notif.requesterID}>
                              <div className="bg-blue-200 rounded-md p-2 flex justify-between">
                                <div className="flex-auto text-left">
                                  <p className="font-semibold block text-sm text-black">{notif.requesterUsername}</p>
                                  <p className="text-sm text-left">{notif.message}</p>
                                </div>
                                <div className="flex p-2">
                                  <button onClick={() => acceptFriendRequest(notif)} className="rounded-lg w-24 h-8 flex items-center justify-center bg-green-400 text-gray-800 font-bold mx-2 py-2 px-4">
                                    Accept
                                  </button>
                                  <button 
                                     onClick={() => {
                                      removeNotification(activeUser.id,notif)
                                      const notification = notif
                                      notification.message = " has recieved your friend request"
                                      console.log(notification)
                                      removeNotification(notif.requesterID, notification)
                                     }} 
                                     className="rounded-lg w-24 h-8 flex items-center justify-center bg-red-400 text-gray-800 font-bold py-2 px-4">
                                    Reject
                                  </button>
                                </div>
                              </div>
                            </li>
                          );
                        }
                        if(notif.notificationType === "pendingFriendRequest"){
                          console.log(notif.requesterUsername)
                          if(activeUser.friends.includes(notif.username)){
                              return;
                          }
                          else{
                            return (
                              <li className="my-4 text-slate-500 text-lg leading-relaxed" key={notif.requesterID}>
                                <div className="bg-blue-200 rounded-md p-2 flex justify-between">
                                  <div className="flex-auto text-left">
                                    <p className="font-semibold block text-sm text-black">{notif.username}</p>
                                    <p className="text-sm text-left">{notif.message}</p>
                                  </div>
                                  <div className="flex p-2">
                                    <button className="rounded-lg w-l h-8 flex items-center justify-center bg-slate-400 text-gray-800 font-bold py-2 px-4">
                                      Pending...
                                    </button>
                                  </div>
                                </div>
                              </li>
                            );
                          }
                          
                        }
                        
                      })}
                    </ul>
                  </div>
                </>
              )}
              {activeTab === 'add-friends' && (
                <>
                  {allUsers &&
                    allUsers.map((user) => {
                      if (
                        user.firstName === "" ||
                        activeUser.friends.includes(user.username)
                      ) {
                        return;
                      }
                      return (
                        <div
                          key={user.username}
                          className="pt-2 grid place-items-center"
                        >
                          {user.firstName && user.photo && user.id !== activeUser.id && (
                            <div className="p-3 min-w-75% md:max-w-5xl bg-slate-100 rounded-lg border border-slate-500 shadow-lg items-center">
                              <div className="sm:hidden bg-gray-50 px-4 py-5 bg-gradient-to-r from-sky-300 via-sky-400 to-sky-500">
                                <dt className="text-xl font-medium text-black flex items-center justify-center">
                                  {user.firstName}
                                </dt>
                                <div className="align-items">{user.username}</div>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center justify-center">
                                  {user.photo && (
                                    <img
                                      className="h-48 w-40 rounded-lg"
                                      src={user.photo}
                                      alt=""
                                    />
                                  )}
                                </dd>
                              </div>
                              <div className="hidden bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gradient-to-r from-sky-300 via-sky-400 to-sky-500">
                                <dt className="text-xl font-medium text-black flex items-center justify-center">
                                  {user.firstName}
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center justify-center">
                                  {user.photo && (
                                    <img
                                      className="h-48 w-40 rounded-lg"
                                      src={user.photo}
                                      alt=""
                                    />
                                  )}
                                </dd>
                              </div>
                              <div
                                onClick={() => sendFriendRequest(user.id, user.username)}
                                className="pt-2 hover:cursor-pointer hover:bg-"
                              >
                                {!activeUser.friends.includes(user.username) && (
                                  <a className="inline-flex justify-center w-full py-2 px-4 border border-transparent shadow-sm text-med font-medium rounded-md text-white bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-900">
                                    Add Friend
                                  </a>
                                )}
                              </div>
                              <div
                                onClick={() => removeFriend(user.username)}
                                className="pt-2 hover:cursor-pointer hover:bg-"
                              >
                                {activeUser.friends.includes(user.username) && (
                                  <a className="inline-flex justify-center w-full py-2 px-4 border border-transparent shadow-sm text-med font-medium rounded-md text-white bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-900">
                                    Remove Friend
                                  </a>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </>
              )}
              </div>
            </div>
          </div>
      </div>
    </>
  );
}
