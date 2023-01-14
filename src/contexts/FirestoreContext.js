import React from "react";
import { useEffect, useContext, useState } from "react";
import { db } from "../firebase";
import { useAuth } from "./AuthContext";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

const FirestoreContext = React.createContext();

export function useFirestore() {
  return useContext(FirestoreContext);
}

export function FirestoreProvider({ children }) {
  const { currentUser } = useAuth();
  const [activeUser, setActiveUser] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const dbUsersCollection = db.collection("users");

  useEffect(() => {
    if (allUsers.length === 0) {
      fetchAllUsers();
    }

    setLoading(false);
  }, []);

  // USER FUNCTIONALITY

  async function fetchAllUsers() {
    await dbUsersCollection.get().then((snapshot) => {
      if (snapshot.docs.length > 0) {
        const tempUsers = [];
        snapshot.docs.forEach((user) => {
          if (user.data().email === currentUser.email) {
            setActiveUser(user.data());
            setNotifications(user.data().notifications);
          }
          tempUsers.push({
            id: user.data().id,
            firstName: user.data().firstName ? user.data().firstName : "",
            lastName: user.data().lastName ? user.data().lastName : "",
            photo: user.data().photo ? user.data().photo : "",
            friends: user.data().friends ? user.data().friends : [],
            notifications: user.data().notifications
              ? user.data().notifications
              : [],
            username: user.data().username,
          });
        });
        setAllUsers(tempUsers);
      }
    });
  }

  async function dismissNotification(notificationToDismiss){
    await db
      .collection("users")
      .doc(activeUser.id)
      .update({
        notifications: arrayRemove(
          notificationToDismiss
        ),
      })
  }

  async function refreshUser(id) {
    const docRef = doc(db, "users", id);
    const user = await getDoc(docRef);
    if (user.exists()) {
      setActiveUser(user.data());
    }
  }

  async function getActiveUser() {
    const data = await dbUsersCollection.get();
    data.docs.forEach((item) => {
      if (item.data().email === currentUser.email) {
        setActiveUser(item.data());
      }
    });
  }

  const value = {
    allUsers,
    activeUser,
    getActiveUser,
    notifications,
    refreshUser,
    fetchAllUsers,
    dismissNotification
  };

  return (
    <FirestoreContext.Provider value={value}>
      {!loading && children}
    </FirestoreContext.Provider>
  );
}
