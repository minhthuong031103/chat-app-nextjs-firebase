import { useState } from 'react';
import { BiCheck, BiEdit } from 'react-icons/bi';
import Avatar from './Avatar';
import { useAuth } from '../context/authContext';
import Icon from './Icon';
import { FiPlus } from 'react-icons/fi';
import { IoClose, IoLogOutOutline } from 'react-icons/io5';
import { BsFillCheckCircleFill } from 'react-icons/bs';
import { toast } from 'react-toastify';
import ToastMessage from './ToastMessage';
import { db, auth } from '../firebase/config';
import {
  MdAddAPhoto,
  MdDeleteForever,
  MdPhoto,
  MdPhotoCamera,
} from 'react-icons/md';
import { storage } from '../firebase/config';
import { profileColors } from '../constant/color';
import UsersPopup from './popup/UsersPopup';
import { doc, updateDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
export default function LeftNav() {
  var toastId = null;
  const uploadImageToFireStore = (file) => {
    try {
      if (file) {
        const storageRef = ref(storage, 'images');
        const uploadTask = uploadBytesResumable(storageRef, file);
        // Register three observers:
        // 1. 'state_changed' observer, called any time the state changes
        // 2. Error observer, called on failure
        // 3. Completion observer, called on successful completion
        toastId = toast.loading('Uploading...');
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused');
                break;
              case 'running':
                console.log('Upload is running');
                break;
            }
          },
          (error) => {
            // Handle unsuccessful uploads
          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then(
              async (downloadURL) => {
                console.log('File available at', downloadURL);

                handleUpdateProfile('photo', downloadURL);

                await updateProfile(authUser, { photoURL: downloadURL });
              }
            );
          }
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
  const [userPopup, setUserPopup] = useState(false); // [1
  const [editProfile, setEditProfile] = useState(false); // [1
  const { currentUser, signOut, setCurrentUser } = useAuth();
  const [nameEdited, setNameEdited] = useState(false);
  const authUser = auth.currentUser;
  const handleUpdateProfile = async (type, value) => {
    //color,name,photo, photo removed
    let obj = { ...currentUser };
    switch (type) {
      case 'color':
        obj.color = value;
        break;
      case 'name':
        obj.displayName = value;
        break;
      case 'photo':
        obj.photoURL = value;
        break;
      case 'photo-remove':
        obj.photoURL = null;
        break;
      default:
        break;
    }
    if (type !== 'photo') {
      toastId = toast.loading('Uploading...');
    }

    try {
      //logic
      const currentUserDoc = doc(db, 'users', currentUser.uid);
      await updateDoc(currentUserDoc, obj);
      setCurrentUser(obj);
      if (type === 'photo-remove') {
        await updateProfile(authUser, { photoURL: null });
      }
      if (type === 'name') {
        await updateProfile(authUser, { displayName: value });
        setNameEdited(false);
      }

      toast.update(toastId, {
        render: 'Update successfully',
        type: 'success',
        isLoading: false,
        autoClose: 2000,
      });
    } catch (error) {
      console.log(error.message);

      if (error.message === 'Firebase: Error (auth/invalid-email).') {
        toast.update(toastId, {
          render: 'Invalid email',
          type: 'error',
          isLoading: false,
          autoClose: 2000,
        });
      }
      if (error.message === 'Firebase: Error (auth/user-not-found).') {
        toast.update(toastId, {
          render: 'User not found',
          type: 'error',
          isLoading: false,
          autoClose: 2000,
        });
      }
    }
  };
  const onkeyup = (event) => {
    if (event.target.innerText.trim() !== currentUser.displayName) {
      setNameEdited(true);
    } else {
      setNameEdited(false);
    }
  };

  const onkeydown = (event) => {
    if (event.key === 'Enter' && event.keyCode === 13) {
      event.preventDefault();
    }
  };

  const editProfileContainer = () => {
    return (
      <div className="relative flex flex-col items-center ">
        <ToastMessage />
        <Icon
          size="small"
          className="absolute top-0 right-5 hover:bg-c2"
          icon={<IoClose size={20} />}
          onClick={() => {
            setEditProfile(false);
          }}
        />
        <div className="relative rounded-full group cursor-pointer ">
          <Avatar size="xx-large" user={currentUser} />
          <div
            className="w-full h-full rounded-full bg-black/[0.5] 
          absolute top-0 left-0 justify-center items-center 
          hidden group-hover:flex
          "
          >
            <label htmlFor="fileUpload">
              {currentUser.photoURL ? (
                <MdPhotoCamera
                  size={34}
                  className="hover:cursor-pointer text-white"
                />
              ) : (
                <MdAddAPhoto
                  size={34}
                  className="hover:cursor-pointer text-white"
                />
              )}
            </label>
            <input
              id="fileUpload"
              onChange={(e) => uploadImageToFireStore(e.target.files[0])}
              type="file"
              style={{ display: 'none' }}
            />
          </div>
          {currentUser.photoURL && (
            <div
              className="w-6 h-6 rounded-full bg-red-500 flex justify-center
          items-center absolute right-0 bottom-0
          "
              onClick={() => {
                handleUpdateProfile('photo-remove');
              }}
            >
              <MdDeleteForever size={14} />
            </div>
          )}
        </div>
        <div className="mt-5 flex flex-col items-center">
          <div className="flex items-center gap-2">
            {!nameEdited && <BiEdit size={20} className="text-c3" />}
            {nameEdited && (
              <BsFillCheckCircleFill
                size={20}
                className="text-c4 cursor-pointer"
                onClick={
                  () => {
                    handleUpdateProfile(
                      'name',
                      document.getElementById('displayNameEdit').innerText
                    );
                  }
                  //name edit logic
                }
              />
            )}
            <div
              contentEditable
              className="outline-none
            bg-transparent border-none text-center
            "
              id="displayNameEdit"
              onKeyUp={onkeyup}
              onKeyDown={onkeydown}
            >
              {currentUser.displayName}
            </div>
          </div>
          <span className="text-c3 text-sm">{currentUser.email}</span>
        </div>
        <div className="grid grid-cols-5 gap-4 mt-5">
          {profileColors.map((color, index) => (
            <span
              key={index}
              className="w-10 h-10 rounded-full flex items-center justify-center
cursor-pointer transition-transform hover:scale-125 
"
              style={{ backgroundColor: color }}
              onClick={() => {
                handleUpdateProfile('color', color);
              }}
            >
              {color === currentUser.color && <BiCheck size={20} />}
            </span>
          ))}
        </div>
      </div>
    );
  };
  return (
    <div
      className={`${
        editProfile ? 'w-[350px]' : 'w-[80px] items-center'
      } flex flex-col justify-between py-5 shrink-0 transition-all`}
    >
      {editProfile ? (
        editProfileContainer()
      ) : (
        <div
          className="relative group cursor-pointer"
          onClick={() => setEditProfile(true)}
        >
          <Avatar size="large" user={currentUser} />
          <div className="w-full h-full rounded-full bg-black/[0.5] absolute top-0 left-0 justify-center items-center hidden group-hover:flex">
            <BiEdit size={14} />
          </div>
        </div>
      )}

      <div
        className={`flex gap-5 ${
          editProfile ? 'ml-5' : 'flex-col items-center'
        }`}
      >
        <Icon
          size="x-large"
          className="bg-green-500 hover:bg-gray-600"
          icon={<FiPlus size={24} />}
          onClick={() => setUserPopup(!userPopup)}
        />
        <Icon
          size="x-large"
          className="hover:bg-c2"
          icon={<IoLogOutOutline size={24} />}
          onClick={signOut}
        />
      </div>
      {userPopup && (
        <UsersPopup onHide={() => setUserPopup(false)} title="Find Users" />
      )}
    </div>
  );
}
