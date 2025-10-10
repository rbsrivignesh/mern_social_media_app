import React from 'react'
import { FaArrowLeft } from 'react-icons/fa6'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import OnlineUser from '../components/OnlineUser';
import { setSelectedUser } from '../redux/messageSlice';
import user from '../assets/user.jpg'

const Message = () => {
    const navigate = useNavigate();
    const {following} = useSelector(state => state.user);
    const {onlineUsers} = useSelector(state => state.socket);
    const {prevChatUsers} = useSelector(state => state.message);
    const dispatch = useDispatch()
    return (
        <div className='w-full min-h-[100vh] bg-black flex items-center flex-col gap-[20px] p-[25px] pt-[20px]'>
            <div className='w-full h-[80px] flex items-center gap-[20px] px-[30px] ' >
               

                    <FaArrowLeft className='cursor-pointer lg:hidden ' size={25} onClick={() => navigate(`/`)} color='white' />

                    <h1 className='text-white text-[20px]  font-semibold'>Messages</h1>


            </div>
            <div className='w-full h-[80px] flex gap-[20px] justify-start items-center overflow-x-auto p-[20px] border-b-2 border-gray-800'>
                {following?.map((user,index)=>(
                    onlineUsers.includes(user._id) && (<OnlineUser user={user} />)
                ))}
            </div>

            <div className='w-full h-full overflow-auto flex flex-col gap-[20px]'>
{prevChatUsers?.map((user,index)=>(
    <div className='text-white cursor-pointer w-full flex items-center gap-[10px]' onClick={()=>{
        dispatch(setSelectedUser(user));
        navigate("/message-area");
    }}>
{onlineUsers?.includes(user._id)? <OnlineUser user={user}/> : <div className='w-[50px] h-[50px] border-2 border-black rounded-full cursor-pointer overflow-hidden'>
                    <img src={user?.profileImage || user} alt="" className='w-full h-full object-cover' />
                </div> }

                <div className='flex flex-col'>
                    <div className='text-white text-[18px] font-semibold'>{user?.userName}</div>
                    {onlineUsers?.includes(user._id) && (<div className='text-blue-500 text-[15px]'>Active Now</div>) }
    
</div>



    </div>
))}






            </div>
        </div>
    )
}

export default Message