import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import user from '../assets/user.jpg'
import { useNavigate } from 'react-router-dom'

const SenderMessage = ({message}) => {
  const navigate = useNavigate()
  const {userData} = useSelector(state=> state.user);
  const scroll = useRef();

  useEffect(()=>{
    scroll.current.scrollIntoView({behavior : "smooth"})
  },[message.message ,message.image])
  return (
    <div ref={scroll}  className='w-fit max-w-[60%] bg-gradient-to-br from-[#9500ff] to-[#ff0095] rounded-t-2xl rounded-bl-2xl rounded-br-0 px-[10px] py-[10px] relative ml-auto right-0 flex flex-col gap-[10px]'>
    {message.image && ( 
        <img className='h-[200px] object-cover rounded-2xl' src={message.image} alt='' />
      )}

      {message.message && (<div className='text-[18px] text-white wrap-break-word'>
        {message.message}
      </div>)}
      <div className='w-[30px] h-[30px] rounded-full cursor-pointer overflow-hidden absolute right-[-35px] bottom-0'  onClick={() => navigate(`/profile/${userData?.userName}`)} >
        <img src={userData?.profileImage || user} className='h-full w-full object-cover' alt="" />
      </div>
    </div>
  )
}

export default SenderMessage