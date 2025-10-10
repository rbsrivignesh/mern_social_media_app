import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setFollowing, setUserData } from '../redux/userSlice'
import { setCurrentUserStory } from '../redux/storySlice'
import { setPrevChatUsers } from '../redux/messageSlice'

const getPreviousChatUsers = () => {
    const dispatch = useDispatch();
    const {messages} = useSelector(state => state.message);
  useEffect(()=>{
    const fetchPreviousChatUsers = async()=>{
        try {
            const result = await axios.get(serverUrl+"/api/message/prev-chats",{withCredentials: true});
            // console.log(result.data)
            
            dispatch(setPrevChatUsers(result?.data));
          

        } catch (error) {
            console.log(error);
        }
    }

    fetchPreviousChatUsers();
  },[messages]);
}

export default getPreviousChatUsers