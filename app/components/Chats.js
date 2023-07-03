'use client';

import React, { useEffect } from 'react';
import { useChat } from '../context/chatContext';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
export default function Chats() {
  const { users, setUsers } = useChat();

  useEffect(() => {
    onSnapshot(collection(db, 'users'), (snapshot) => {
      const updatedUsers = {};
      snapshot.forEach((doc) => {
        updatedUsers[doc.id] = doc.data();
        console.log(doc.data());
      });
      setUsers(updatedUsers);
    });
  }, []);
  return <div>chats</div>;
}
