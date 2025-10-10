import React from 'react'
import user from '../assets/user.jpg'

import { useNavigate } from 'react-router-dom'
import FollowButton from './FollowButton'
const OtherUser = ({userData}) => {
    const navigate = useNavigate();
    return (
        <div className='w-full h-[80px] flex items-center justify-between border-b-2 border-gray-800'>

            <div className='flex items-center gap-[10px]'>

                <div onClick={()=>navigate(`/profile/${userData?.userName}`)} className='w-[50px] h-[50px] border-2 border-black rounded-full cursor-pointer overflow-hidden'>
                    <img src={userData?.profileImage || user} alt="" className='w-full h-full object-cover' />
                </div>

                <div>
                    <div className='text-[15px] text-white font-semibold'>{userData?.userName}</div>
                    <div className='text-[13px] text-gray-300 font-semibold'>{userData?.name}</div>
                </div>

            </div>
            <FollowButton tailwind={'px-[10px] w-[100px] py-[5px] h-[40px] bg-white rounded-2xl cursor-pointer'} targetUserId={userData._id} data={userData} />
           
        </div>
    )
}

export default OtherUser