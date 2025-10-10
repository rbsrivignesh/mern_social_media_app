import React from 'react'
import user from '../assets/user.jpg'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';


const NotificationCard = ({noti}) => {
    const navigate= useNavigate();
   
  return (
    <div className='w-full  flex justify-between items-center p-[5px] min-h-[50px] bg-gray-800 rounded-full'>
    <div className='flex gap-[10px] items-center'>
          <div onClick={()=>navigate(`/profile/${noti?.sender?.userName}`)} className='w-[40px] h-[40px] border-2 border-black rounded-full cursor-pointer overflow-hidden'>
                            <img src={noti?.sender?.profileImage || user} alt="" className='w-full h-full object-cover' />
                        </div>

                        <div className=' flex flex-col '>
                            <h1 className='text-white  text-[16px] font-semibold'>{noti?.sender?.userName}</h1>
                            <div className='text-[15px] text-gray-200'>{noti?.message}</div>
                        </div>
    </div>

    <div className='w-[40px] h-[40px] rounded-full overflow-hidden border-4 border-black'>

       
        {noti?.loop ?  <video src={noti?.loop?.media} muted loop className='h-full w-full object-cover'/> : (noti?.post && noti?.post?.mediaType=="image" )? <img src={noti?.post?.media} className='w-full h-full object-cover'/> : (noti?.post && noti?.post?.mediaType=="image" ) ? <video src={noti?.post?.media} muted loop className='h-full w-full object-cover'/> :  <img src={noti?.receiver?.profileImage} className='w-full h-full object-cover'/> }

    </div>
    </div>
  )
}

export default NotificationCard