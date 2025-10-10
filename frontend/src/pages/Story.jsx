import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { serverUrl } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import { setStoryData } from '../redux/storySlice';
import StoryCard from '../components/StoryCard';

const Story = () => {
    const {userName} = useParams();
    const dispatch = useDispatch();
    const {storyData} = useSelector(state => state.story);
    const handleStory = async()=>{
        try {
            const result = await axios.get(`${serverUrl}/api/story/get-by-username/${userName}`,{withCredentials : true});
            dispatch(setStoryData(result.data[0]));
           

           
            
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{ 
        if(userName){
            handleStory()}},[userName])
  return (
    <div className='w-full h-[100vh] bg-black flex justify-center items-center'>
        {storyData && ( <StoryCard story={storyData}/>)}
       
    </div>
  )
}

export default Story