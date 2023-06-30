'use client';

import { createContext, useContext, useEffect } from 'react';
import { useState } from 'react';
import { onAuthStateChanged, signOut as authSignOut } from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { getDoc, doc } from 'firebase/firestore';
const UserContext = createContext();
export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const signOut = () => {
    authSignOut(auth).then(function () {
      setCurrentUser(null);
      setIsLoading(false);
    });
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      //the second argument is a call back function that will be called when the state of the user changes
      setIsLoading(true);
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        console.log(userDoc.data());
        setCurrentUser(userDoc.data());
        setIsLoading(false);
      } else {
        setCurrentUser(null);
        setIsLoading(false);
        return;
      }
    });

    return () => unsubscribe();
  }, []);
  return (
    <UserContext.Provider
      value={{ currentUser, isLoading, setCurrentUser, setIsLoading, signOut }}
    >
      {children}
    </UserContext.Provider>
  );
};
export const useAuth = () => useContext(UserContext);
