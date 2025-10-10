import React from 'react'
import logo from '../assets/icon.jpg'
import user from '../assets/user.jpg'
import { FaRegHeart } from 'react-icons/fa6'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { serverUrl } from '../App'
import { setUserData } from '../redux/userSlice'
import OtherUser from './OtherUser'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Notifications from '../pages/Notifications'


const LeftHome = () => {
    const { userData, suggestedUsers, notificationData } = useSelector(state => state.user);
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [showNotifications, setShowNotifications] = useState(false)

    const handleLogOut = async () => {
        try {
            const result = await axios.get(serverUrl + "/api/auth/sign-out", { withCredentials: true });

            console.log(result.data);
            dispatch(setUserData(null));
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className={`w-[25%] hidden lg:block h-[100vh] bg-black border-r-2 border-gray-900 ${showNotifications? "overflow-hidden" :"overflow-auto"} `}>
        {/* <div className={`w-[25%] hidden lg:block h-[100vh] bg-black border-r-2 border-gray-900 overflow-auto `}> */}
            <div className='w-full h-[100px] flex items-center justify-between p-[20px]'>
                <img src={logo} alt="" className='w-[50px] rounded-full' />
                <div  onClick={()=>{ setShowNotifications(prev => !prev)}}  className='relative cursor-pointer'>
                    <FaRegHeart size={25} color='white' />
                  {(notificationData?.length > 0 && notificationData?.some((noti)=> noti?.isRead == false)) && (<div className='w-[10px] h-[10px] bg-blue-600 rounded-full absolute top-0 right-[-5px]'></div>)}

                </div>
            </div>

            {!showNotifications && (
                <>
                 <div className='flex justify-between items-center w-full gap-[10px] px-[10px] border-b-2 border-b-gray-900 py-[10px]'>

                <div className='flex items-center gap-[10px]'>

                    <div onClick={() => navigate(`/profile/${userData?.userName}`)} className='w-[60px] h-[60px] border-2 border-black rounded-full cursor-pointer overflow-hidden'>
                        <img src={userData?.profileImage || user} alt="" className='w-full h-full object-cover' />
                    </div>

                    <div>
                        <div className='text-[18px] text-white font-semibold'>{userData?.userName}</div>
                        <div className='text-[15px] text-gray-300 font-semibold'>{userData?.name}</div>
                    </div>

                </div>

                <div onClick={handleLogOut} className='text-blue-500 font-semibold cursor-pointer'>
                    Log Out
                </div>

            </div>


            <div className='w-full flex flex-col gap-[20px] p-[20px]'>
                <h1 className='text-white text-[19px]'>Suggested Users</h1>
                <div>
                    {suggestedUsers && suggestedUsers?.slice(0, 3)?.map((user, index) => (
                        <OtherUser key={index} userData={user} />
                    ))

                    }

                </div>
            </div>
                </>
                
            )}

            {showNotifications && (<Notifications/>)}

           
        </div>
    )
}

export default LeftHome