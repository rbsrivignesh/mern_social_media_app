import React from 'react'
import { FaRegHeart } from 'react-icons/fa6'
import { BiMessageAltDetail } from 'react-icons/bi'
import logo from '../assets/icon.jpg'
import StoryDp from './StoryDp'
import Nav from './Nav'
import { useSelector } from 'react-redux'
import Post from './Post'
import { useNavigate } from 'react-router-dom'

const Feed = () => {
    const navigate = useNavigate();
    const { postData } = useSelector(state => state.post);
    const { userData, notificationData } = useSelector(state => state.user);
    const { currentUserStory } = useSelector(state => state.story)
    const { storyList } = useSelector(state => state.story);
    return (
        <div className='lg:w-[50%] w-full bg-black min-h-[100vh] lg:h-[100vh] relative lg:overflow-y-auto'>
            <div className='lg:hidden flex w-full h-[100px]  items-center justify-between p-[20px]'>
                <img src={logo} alt="" className='w-[50px] rounded-full' />
                <div className='flex gap-[20px] items-center'>
                    <div onClick={()=>navigate("/notifications")} className='relative cursor-pointer'>
                        <FaRegHeart size={30} color='white' />
                        {(notificationData?.length > 0 && notificationData?.some((noti) => noti?.isRead == false)) && (<div className='w-[10px] h-[10px] bg-blue-600 rounded-full absolute top-0 right-[-5px]'></div>)}

                    </div>

                    <BiMessageAltDetail onClick={() => navigate("/messages")} size={30} color='white' />
                </div>
            </div>
            <div className='flex w-full overflow-auto gap-[10px] items-center p-[20px]'>
                <StoryDp userName={"Your Story"} profileImage={userData.profileImage} story={currentUserStory} />
                {storyList?.map((story, index) => (
                    <StoryDp userName={story?.author?.userName} profileImage={story?.author?.profileImage} story={story} />
                ))}

            </div>

            <div className='w-full min-h-[100vh] flex flex-col items-center gap-[20px] p-[10px] pt-[40px] bg-white rounded-t-[60px] relative pb-[120px]'>



                <Nav />
                {postData?.map((post, index) => (
                    <Post post={post} key={index} />
                ))}
            </div>
        </div>
    )
}

export default Feed