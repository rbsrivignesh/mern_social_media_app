import React, { useEffect, useRef } from 'react'
import user from '../assets/user.jpg'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
const ReceiverMessage = ({message}) => {
  const navigate =useNavigate()
  const {selectedUser} = useSelector(state => state.message);
 const scroll = useRef();
 
   useEffect(()=>{
     scroll.current.scrollIntoView({behavior : "smooth"})
   },[message.message, message.image])
   return (
     <div ref={scroll}   className='w-fit max-w-[60%] bg-[#1a1f1f] rounded-t-2xl rounded-br-2xl rounded-bl-0 px-[10px] py-[10px] relative mr-auto left-0 flex flex-col gap-[10px]'>
    {message.image && ( 
        <img className='h-[200px] object-cover rounded-2xl' src={message.image} alt='' />
      )}

      {message.message && (<div className='text-[18px] text-white wrap-break-word'>
        {message.message}
      </div>)}
      <div className='w-[30px] h-[30px] rounded-full cursor-pointer overflow-hidden absolute left-[-35px] bottom-0'  onClick={() => navigate(`/profile/${selectedUser?.userName}`)} >
        <img src={selectedUser?.profileImage || user} className='h-full w-full object-cover' alt="" />
      </div>
    </div>
  )
}

export default ReceiverMessage