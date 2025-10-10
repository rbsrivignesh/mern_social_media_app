import React from 'react'
import { GoHomeFill } from 'react-icons/go'
import { FiSearch, FiPlusSquare } from 'react-icons/fi'
import { RxVideo } from 'react-icons/rx'
import user from '../assets/user.jpg'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Nav = () => {
    const navigate = useNavigate();
    const {userData} = useSelector(state => state.user);
    return (
        <div className='w-[90%] lg:w-[40%] h-[80px] bg-black flex justify-around items-center fixed bottom-[20px] rounded-full shadow-2xl shadow-[hsl(0,0%,0%)] z-[100]'>
            <div className='cursor-pointer' onClick={()=> navigate("/")}><GoHomeFill color='white' size={30} /></div>
            <div className='cursor-pointer' onClick={()=> navigate("/search")}><FiSearch color='white' size={30} /></div>
            <div className='cursor-pointer' onClick={()=> navigate("/loops")}><RxVideo color='white' size={30} /></div>
            <div className='cursor-pointer' onClick={()=> navigate("/upload")}><FiPlusSquare color='white' size={30} /></div>
            <div onClick={()=> navigate(`/profile/${userData?.userName}`)} className='w-[40px] h-[40px] border-2 border-black rounded-full cursor-pointer overflow-hidden'>
                <img src={userData?.profileImage || user} alt="" className='w-full h-full  object-cover' />
            </div>

        </div>
    )
}

export default Nav