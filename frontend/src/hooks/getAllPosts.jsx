import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setPostData } from '../redux/postSlice'


const getAllPosts = () => {
    const dispatch = useDispatch()
    const {userData} = useSelector(state => state.user);
   
  useEffect(()=>{
    const fetchPosts = async()=>{
        try {
            const result = await axios.get(serverUrl+"/api/post/get-all",{withCredentials: true});
            dispatch(setPostData(result.data));

        } catch (error) {
            console.log(error);
        }
    }

    fetchPosts();
  },[dispatch,userData])
  // },[dispatch])
}

export default getAllPosts