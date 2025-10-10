import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setFollowing, setUserData } from '../redux/userSlice'
import { setCurrentUserStory } from '../redux/storySlice'

const getFollowingList = () => {
    const dispatch = useDispatch();
    const {userData} = useSelector(state => state.user);
  useEffect(()=>{
    const fetchFollowingList = async()=>{
        try {
            const result = await axios.get(serverUrl+"/api/user/following-list",{withCredentials: true});
            // console.log(result.data)
            
            dispatch(setFollowing(result?.data));
          

        } catch (error) {
            console.log(error);
        }
    }

    fetchFollowingList();
  },[userData]);
}

export default getFollowingList