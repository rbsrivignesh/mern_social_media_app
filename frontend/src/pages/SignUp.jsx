import React, { useState } from 'react'
import logo from '../assets/icon.jpg'
import { FaEye, FaEyeSlash } from "react-icons/fa6";

import { serverUrl } from '../App';
import axios from 'axios'
import {ClipLoader} from 'react-spinners'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';

const SignUp = () => {
  const [inputClicked, setInputClicked] = useState({
    name : false, 
    userName : false,
    email : false,
    password: false
  })
   const [err, setErr]= useState("");

    const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [name, setName]= useState("");
  const [userName, setUserName]= useState("");
  const [email, setEmail]= useState("");
  const [password, setPassword]= useState("");
  const [loading, setLoading]= useState(false);

  const dispatch = useDispatch();
  const handleSignUp = async()=>{
    try {
      setErr("");
      setLoading(true)
      const result = await axios.post(serverUrl+"/api/auth/sign-up",{name,userName,email,password},{withCredentials : true})
      console.log(result.data)
      dispatch(setUserData(result.data));
      setLoading(false);


    } catch (error) {
      setLoading(false)
      console.log(error)
       setErr(error?.response?.data?.message);
    }
  }


  return (
    <div className='w-full h-screen bg-gradient-to-b from-black to-gray-900 flex flex-col justify-center items-center'>
        <div className='w-[90%] lg:max-w-[60%] h-[600px] bg-white rounded-2xl flex justify-center items-center overflow-hidden border-2 border-[#1a1f23]'>
            <div className='w-full lg:w-[50%] h-full bg-white flex flex-col items-center p-[10px] gap-[20px]'>
               <div className='flex gap-[10px] items-center text-[20px] font-semibold mt-[40px]'>
                <span>Sign Up To </span> <img className='w-[70px] rounded-full' src={logo} alt="" />
               </div>
               <div className='relative items-center flex justify-start w-[90%] h-[50px] rounded-2xl mt-[30px]  border-2 border-black' onClick={()=> setInputClicked({...inputClicked,name : true})}>
                <label htmlFor="name" className={`absolute left-[20px] p-[5px] bg-white text-[15px] ${inputClicked.name ? "top-[-15px] ":""}`} >
                  Enter Your Name
                </label >
                  <input onChange={(e)=>setName(e.target.value)}  value={name} type="text" id='name' className='w-[100%] h-[100%] rounded-2xl px-[20px] outline-none border-0' required />
               </div>
               <div className='relative items-center flex justify-start w-[90%] h-[50px] rounded-2xl  border-2 border-black' onClick={()=> setInputClicked({...inputClicked,userName : true})}>
                <label htmlFor="userName" className={`absolute left-[20px] p-[5px] bg-white text-[15px] ${inputClicked.userName ? "top-[-15px] ":""}`} >
                  Enter Your UserName
                </label >
                  <input onChange={(e)=>setUserName(e.target.value)}  value={userName}  type="text" id='userName' className='w-[100%] h-[100%] rounded-2xl px-[20px] outline-none border-0' required />
               </div>
               <div className='relative items-center flex justify-start w-[90%] h-[50px] rounded-2xl  border-2 border-black' onClick={()=> setInputClicked({...inputClicked,email : true})}>
                <label htmlFor="email" className={`absolute left-[20px] p-[5px] bg-white text-[15px] ${inputClicked.email ? "top-[-15px] ":""}`}>
                  Enter Your email address
                </label >
                  <input onChange={(e)=>setEmail(e.target.value)}  value={email}  type="email" id='email' className='w-[100%] h-[100%] rounded-2xl px-[20px] outline-none border-0' required />
               </div>
               <div onClick={()=> setInputClicked({...inputClicked,password : true})} className='relative items-center flex justify-start w-[90%] h-[50px] rounded-2xl  border-2 border-black'>
                <label htmlFor="password" className={`absolute left-[20px] p-[5px] bg-white text-[15px] ${inputClicked.password ? "top-[-15px] ":""}`}>
                  Enter Your Password
                </label >
                  <input onChange={(e)=>setPassword(e.target.value)}  value={password}  type={showPassword ? "text":"password" } id='password' className='w-[100%] h-[100%] rounded-2xl px-[20px] outline-none border-0' required />
                  {showPassword ? (  <FaEyeSlash  onClick={()=>setShowPassword(false)}  className='absolute cursor-pointer right-[20px] w-[15px] h-[15px]' />) :
                  <FaEye onClick={()=>setShowPassword(true)} className='absolute cursor-pointer right-[20px] w-[15px] h-[15px]' />
                    }
                
               </div>
                 {err && ( <p className='text-red-500'>{err}</p>
)} 
               <button disabled={loading} onClick={handleSignUp} className='w-[70%] px-[20px] py-[10px] bg-black text-white font-semibold h-[50px] cursor-pointer rounded-2xl mt-[30px]'> {loading ?<ClipLoader size={30} color='white' />:"Sign Up"}</button>
               <p className=' text-gray-800'>Already have an account ? <span onClick={()=>navigate("/signin")} className='border-b-2 border-b-black pb-[3px] text-black cursor-pointer'>Sign In</span></p>
            </div>
            <div className='md:w-[50%] h-full hidden lg:flex justify-center items-center bg-[#000000] flex-col gap-[10px] text-white text-[16px] font-semibold rounded-l-[30px] shadow-2xl shadow-black'>

                    <img src={logo} alt="" className='w-[40%]'/>
                    <p>Not Just A Platform ,It's an EMOTION</p>
            </div>


        </div>
    </div>
  )
}

export default SignUp