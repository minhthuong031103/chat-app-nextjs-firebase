import React, { useState } from 'react';
import { RiSearch2Line } from 'react-icons/ri';
import { db } from '../firebase/config';
import {
  query,
  collection,
  where,
  getDocs,
  getDoc,
  setDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import Avatar from './Avatar';
import { useAuth } from '../context/authContext';
import { useChat } from '../context/chatContext';
export default function Search() {
  const [username, setUsername] = useState('');
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);
  const { currentUser } = useAuth();
  const { dispatch } = useChat();
  const onkeyup = async (e) => {
    if (e.code === 'Enter' && !!username) {
      try {
        setErr(false);
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('email', '==', username));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
          setErr('No user found');
          setUser(null);
        } else {
          querySnapshot.forEach((doc) => {
            setUser(doc.data());
          });
        }
      } catch (error) {
        console.log(error);
        setErr(error);
      }
    }
  };
  const handleSelect = async (user) => {
    try {
      const combinedId =
        currentUser.uid > user.uid
          ? currentUser.uid + user.uid
          : user.uid + currentUser.uid;

      const res = await getDoc(doc(db, 'chats', combinedId));
      if (!res.exists()) {
        //not exist
        await setDoc(doc(db, 'chats', combinedId), {
          messages: [], //set combinedId chats null
        });
        const currentUserChatRef = await getDoc(
          doc(db, 'userChats', currentUser.uid)
        );
        const userChatRef = await getDoc(doc(db, 'userChats', user.uid));
        if (!currentUserChatRef.exists()) {
          await setDoc(doc(db, 'chats', currentUser.uid), {});
        }
        await updateDoc(doc(db, 'userChats', currentUser.uid), {
          [combinedId + '.userInfo']: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL || null,
            color: user.color,
          },
          [combinedId + '.date']: serverTimestamp(),
        });
        if (!userChatRef.exists()) {
          await setDoc(doc(db, 'chats', user.uid), {});
        }
      } else {
        //exist
      }
      setUser(null);
      setUsername('');

      dispatch({ type: 'CHANGE_USER', payload: user });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="shrink-0">
      <div className="relative">
        <RiSearch2Line className="absolute top-4 left-4 text-c3" />
        <input
          type="text"
          placeholder="Search user by Email..."
          onChange={(e) => {
            setUsername(e.target.value);
          }}
          onKeyUp={onkeyup}
          value={username}
          autoFocus
          className="w-full h-12 rounded-xl bg-c1/[0.5] pl-11 pr-16
placeholder:text-c3 outline-none text-base
"
        />
        <span className="absolute top-[14px] right-4 text-sm text-c3">
          Enter
        </span>
      </div>
      {err && (
        <>
          <div className="mt-5 w-full text-center text-sm ">User not found</div>
          <div className="w-full h-[1px] bg-white/[0.1] mt-5"></div>
        </>
      )}
      {user && (
        <>
          <div
            key={user.uid}
            className="mt-5 flex items-center gap-4 rounded-xl hover:bg-c5 py-0
   px-4 cursor-pointer
   "
            onClick={() => handleSelect(user)}
          >
            <Avatar size="large" user={user} />
            <div className="flex flex-col gap-1 grow">
              <span className="text-base text-white flex items-center justify-between">
                {user.displayName}
              </span>
              <p className="text-small text-c3">{user.email}</p>
            </div>
          </div>
          <div
            className="w-full h-[1px] bg-white/[0.1] mt-5
           
           "
          ></div>
        </>
      )}
    </div>
  );
}
