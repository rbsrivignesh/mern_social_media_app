import React, { useState } from 'react'
import logo from '../assets/icon.jpg'
import { FaEye, FaEyeSlash } from "react-icons/fa6";

import { serverUrl } from '../App';
import axios from 'axios'
import {ClipLoader} from 'react-spinners'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';

const SignIn = () => {
  const dispatch = useDispatch()
  const [inputClicked, setInputClicked] = useState({
   
    userName : false,
    email : false,
    password: false
  })
   const [err, setErr]= useState("");

    const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

 
  const [userName, setUserName]= useState("");
  const [email, setEmail]= useState("");
  const [password, setPassword]= useState("");
  const [loading, setLoading]= useState(false);


  const handleSignIn = async()=>{
    try {
      setErr("");
      setLoading(true)
      const result = await axios.post(serverUrl+"/api/auth/sign-in",{userName,password},{withCredentials : true})
    
      setLoading(false);
      dispatch(setUserData(result.data  ));
    } catch (error) {
       setErr(error?.response?.data?.message);
      setLoading(false)
      console.log(error)
    }
  }


  return (
    <div className='w-full h-screen bg-gradient-to-b from-black to-gray-900 flex flex-col justify-center items-center'>
        <div className='w-[90%] lg:max-w-[60%] h-[600px] bg-white rounded-2xl flex justify-center items-center  overflow-hidden border-2 border-[#1a1f23]'>
            <div className='w-full lg:w-[50%] h-full bg-white flex flex-col items-center justify-center p-[10px] gap-[20px]'>
               <div className='flex gap-[10px] items-center text-[20px] font-semibold mt-[40px]'>
                <span>Sign In To </span> <img className='w-[70px] rounded-full' src={logo} alt="" />
               </div>
              
               <div className='relative items-center flex justify-start w-[90%] h-[50px] rounded-2xl  border-2 border-black'  onClick={()=> setInputClicked({...inputClicked,userName : true})}>
                <label htmlFor="userName" className={`absolute left-[20px] p-[5px] bg-white text-[15px] ${inputClicked.userName ? "top-[-15px] ":""}`}>
                  Enter Your UserName
                </label >
                  <input onChange={(e)=>setUserName(e.target.value)}  value={userName}  type="text" id='userName' className='w-[100%] h-[100%] rounded-2xl px-[20px] outline-none border-0' required />
               </div>
              
               <div className='relative items-center flex justify-start w-[90%] h-[50px] rounded-2xl  border-2 border-black'  onClick={()=> setInputClicked({...inputClicked,password : true})}>
                <label htmlFor="password" className={`absolute left-[20px] p-[5px] bg-white text-[15px] ${inputClicked.password ? "top-[-15px] ":""}`}>
                  Enter Your Password
                </label >
                  <input onChange={(e)=>setPassword(e.target.value)}  value={password}  type={showPassword ? "text":"password" } id='password' className='w-[100%] h-[100%] rounded-2xl px-[20px] outline-none border-0' required />
                  {showPassword ? (  <FaEyeSlash  onClick={()=>setShowPassword(false)}  className='absolute cursor-pointer right-[20px] w-[15px] h-[15px]' />) :
                  <FaEye onClick={()=>setShowPassword(true)} className='absolute cursor-pointer right-[20px] w-[15px] h-[15px]' />
                    }
                
               </div>
               <div onClick={()=> navigate("/forgot-password")} className='w-[90%] px-[20px] cursor-pointer'>
                Forgot Password
               </div>
                 {err && ( <p className='text-red-500'>{err}</p>
)} 
               <button disabled={loading} onClick={handleSignIn} className='w-[70%] px-[20px] py-[10px] bg-black text-white font-semibold h-[50px] cursor-pointer rounded-2xl mt-[30px]'> {loading ?<ClipLoader size={30} color='white' />:"Sign In"}</button>
               <p className=' text-gray-800'>Create a new account ? <span onClick={()=>navigate("/signup")} className='border-b-2 border-b-black pb-[3px] text-black cursor-pointer'>Sign Up</span></p>
            </div>
            <div className='md:w-[50%] h-full hidden lg:flex justify-center items-center bg-[#000000] flex-col gap-[10px] text-white text-[16px] font-semibold rounded-l-[30px] shadow-2xl shadow-black'>

                    <img src={logo} alt="" className='w-[40%]'/>
                    <p>Not Just A Platform ,It's an EMOTION</p>
            </div>


        </div>
    </div>
  )
}

export default SignIn