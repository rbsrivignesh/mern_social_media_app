import React, { useEffect, useState } from 'react'
import user from '../assets/user.jpg'
import { useSelector } from 'react-redux'
import { FiPlusCircle } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { serverUrl } from '../App'
const StoryDp = ({ profileImage, userName, story }) => {
    const navigate = useNavigate();
    const {userData} = useSelector(state => state.user);
    const {storyData,storyList} = useSelector(state => state.story);
    const [viewed,setViewed] = useState(false);

    useEffect(()=>{
       if( story?.viewers?.some((viewer)=> viewer._id == userData._id)){
        setViewed(true);
       }
       else{
        setViewed(false)
       }

    },[story,userData,storyData,storyList])

    const handleViewers = async()=>{
        try {
            const result = await axios.get(`${serverUrl}/api/story/view/${story._id}`,{withCredentials : true});

        } catch (error) {
            console.log(error)
        }
    }
    const handleClick = () => {
        if (!story && userName == "Your Story") {
            navigate("/upload")
        }
        else if(story && userName == "Your Story") {
            // handleViewers();
            navigate(`/story/${userData?.userName}`);

        }
        else{
            handleViewers();
            navigate(`/story/${story?.author?.userName}`);
        }
          
    }
    return (
        <div className='flex flex-col w-[80px]'>
            <div className={`w-[70px] h-[70px] ${!story ? "" : !viewed ?"bg-gradient-to-b from-blue-500 to-blue-950 " : "bg-gradient-to-b from-gray-500 to-black-950 "} rounded-full flex justify-center items-center relative`}>
                <div onClick={handleClick} className='w-[62px] h-[62px] border-2 border-black rounded-full cursor-pointer overflow-hidden '>
                    <img src={profileImage || user} alt="" className='w-full object-cover h-full' />
                    {!story && userName == "Your Story" && (
                        <div>
                            <FiPlusCircle  size={25} className='absolute bottom-[-3px] right-[10px] bg-white rounded-full' />
                        </div>
                    )}

                </div>
            </div>
            <div className='text-white text-[14px] text-center truncate w-[70px]'>
                {userName}
            </div>
        </div>
    )
}

export default StoryDp