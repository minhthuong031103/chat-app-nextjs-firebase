'use client';

import React from 'react';
import PopupWrapper from './PopupWrapper';
import { useChat } from '@/app/context/chatContext';
import { useAuth } from '@/app/context/authContext';
import Avatar from '../Avatar';
import {
  getDoc,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/app/firebase/config';
import Search from '../Search';

export default function UsersPopup(props) {
  const { currentUser } = useAuth();
  const { users, dispatch } = useChat();
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
      dispatch({ type: 'CHANGE_USER', payload: user });
      props.onHide();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <PopupWrapper {...props}>
      <Search />
      <div
        className="mt-5 flex flex-col gap-2 
  grow relative overflow-auto scrollbar
  "
      >
        <div className="absolute w-full">
          {users &&
            Object.values(users).map((user) => {
              return (
                <div
                  key={user.uid}
                  className="flex items-center gap-4 rounded-xl hover:bg-c5 py-0
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
              );
            })}
        </div>
      </div>
    </PopupWrapper>
  );
}
