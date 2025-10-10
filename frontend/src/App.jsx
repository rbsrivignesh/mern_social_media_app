import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import ForgotPassword from './pages/ForgotPassword';
import Home from './pages/Home';
import { useDispatch, useSelector } from 'react-redux';
import getCurrentUser from './hooks/getCurrentUser';
import getSuggestedUsers from './hooks/getSuggestedUsers';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import Upload from './pages/Upload';
import getAllPosts from './hooks/getAllPosts';
import Loops from './pages/Loops';
import getAllLoops from './hooks/getAllLoops';
import Story from './pages/Story';
import getAllStories from './hooks/getAllStories';
import Message from './pages/Message';
import MessageArea from './pages/MessageArea';
export const serverUrl = import.meta.env.VITE_BACKEND_URL;
import { io } from 'socket.io-client'
import { setOnlineUsers, setSocket } from './redux/socketSlice';
import getFollowingList from './hooks/getFollowingList';
import getPreviousChatUsers from './hooks/getPreviousChatUsers';
import Search from './pages/Search';
import getAllNotifications from './hooks/getAllNotifications';
import Notifications from './pages/Notifications';
import { setNotifcationData } from './redux/userSlice';


const App = () => {
  getCurrentUser();
  getSuggestedUsers();
  getAllPosts();
  getAllLoops();
  getAllStories();
  getFollowingList();
  getPreviousChatUsers()
  getAllNotifications();
  const { userData, notificationData } = useSelector(state => state.user);
  const { socket } = useSelector(state => state.socket);
  const dispatch = useDispatch()

  useEffect(() => {
    if (userData) {
      const socketIo = io(serverUrl, {
        query: {
          userId: userData._id
        }
      }

      );
      // console.log(socketIo)
      dispatch(setSocket(socketIo));
      socketIo.on('getOnlineUsers', (users) => {
        dispatch(setOnlineUsers(users));
      })
      return () => socketIo.close();
    } else {
      if (socket) {
        socket.close();
        dispatch(setSocket(null))
      }
    }


  }, [userData])


  // console.log(notificationData);
  socket?.on('newNotification', (noti) => {
    console.log("works");
    dispatch(setNotifcationData([noti, ...notificationData]));
  });



  return (
    <Routes>
      <Route path='/signin' element={userData ? <Navigate to={"/"} /> : <SignIn />} />
      <Route path='/signup' element={userData ? <Navigate to={"/"} /> : <SignUp />} />
      <Route path='/forgot-password' element={userData ? <Navigate to={"/"} /> : <ForgotPassword />} />
      <Route path='/profile/:userName' element={userData ? <Profile /> : <Navigate to={"/signin"} />} />
      <Route path='/story/:userName' element={userData ? <Story /> : <Navigate to={"/signin"} />} />
      <Route path='/edit-profile' element={userData ? <EditProfile /> : <Navigate to={"/signin"} />} />
      <Route path='/upload' element={userData ? <Upload /> : <Navigate to={"/signin"} />} />
      <Route path='/loops' element={userData ? <Loops /> : <Navigate to={"/signin"} />} />
      <Route path='/search' element={userData ? <Search /> : <Navigate to={"/signin"} />} />
      <Route path='/messages' element={userData ? <Message /> : <Navigate to={"/signin"} />} />
      <Route path='/notifications' element={userData ? <Notifications /> : <Navigate to={"/signin"} />} />
      <Route path='/message-area' element={userData ? <MessageArea /> : <Navigate to={"/signin"} />} />
      <Route path='/' element={userData ? <Home /> : <Navigate to={"/signin"} />} />
    </Routes>
  )
}

export default App