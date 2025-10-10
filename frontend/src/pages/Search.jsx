import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { FaArrowLeft } from 'react-icons/fa6'
import { FiSearch } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setSearchData } from '../redux/userSlice'
import userI from '../assets/user.jpg'

const Search = () => {
    const navigate = useNavigate()
    const [input, setInput]= useState("");
    const {searchData} = useSelector(state=>state.user)
    const dispatch = useDispatch();
    const handleSearch = async()=>{
        // e.preventDefault();
        try {
            const result = await axios.get(`${serverUrl}/api/user/search?keyword=${input}`,{withCredentials : true});
            console.log(result.data);
            dispatch(setSearchData(result.data));

            
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(()=>{handleSearch()},[input])
    return (
        <div className='w-full min-h-[100vh] bg-black flex items-center flex-col gap-[20px] p-[25px] pt-[20px]'>
            <div className='w-[200px] h-[80px] flex justify-start items-center gap-[30px] px-[30px] absolute top-[20px] left-[20px]' >

                <FaArrowLeft className='cursor-pointer absolute left-[20px] ' size={25} onClick={() => navigate(`/`)} color='white' />

                <h1 className='text-white text-[20px] px-[20px] font-semibold'>Search</h1>


            </div>

            <div className='w-full h-[80px] flex items-center justify-center'>
                <form className='w-[90%] max-w-[800px] h-[80%] rounded-full bg-[#0f1414] flex items-center px-[20px]'>
                    <FiSearch size={20} color='white' />
                    <input type="text" className='w-full h-full outline-0 rounded-full px-[20px] text-white text-[18px]' value={input} onChange={(e)=>setInput(e.target.value)}  placeholder='Search .....'/>
                </form>
            </div>
            
           {input && searchData?.map((user)=>(
            <div onClick={()=>navigate(`/profile/${user?.userName}`)}  className='w-[90vw] max-w-[700px] h-[60px] rounded-full bg-white flex items-center gap-[20px] px-[5px] hover:bg-gray-200 cursor-pointer'>
                <div className='w-[50px] h-[50px] border-2 border-black rounded-full cursor-pointer overflow-hidden'>
                                    <img src={user?.profileImage || userI} alt="" className='w-full h-full object-cover' />
                                </div>
                
                                <div>
                                    <div className='text-[18px] text-black font-semibold'>{user?.userName}</div>
                                    <div className='text-[14px] text-gray-400 font-semibold'>{user?.name}</div>
                                </div>
            </div>
           ))}

           {!input && (<div className='text-[30px] font-bold text-gray-700'>Search Here</div>)}
        </div>
    )
}

export default Search