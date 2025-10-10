import axios from 'axios';
import React, { useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa6';
import { ClipLoader } from 'react-spinners';
import { serverUrl } from '../App';
import { useNavigate } from 'react-router-dom';


const ForgotPassword = () => {
    const navigate = useNavigate();
    const [inputClicked, setInputClicked] = useState({
        email: false,
        newPassword: false,
        otp: false,
        confirmNewPassword: false
    })
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("")
    const [step, setStep] = useState(1);
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
    const [err, setErr]= useState("");

    const handleStep1 = async()=>{
        try {
            setLoading(true)
            setErr("");
           const results = await axios.post(serverUrl+"/api/auth/send-otp",{email},{withCredentials: true});
            const {emails,otp} = results.data;
            const result = await axios.post(serverUrl+"/api/auth/trial-otp",{emails,otp},{withCredentials: true});

            
            setLoading(false)
            setStep(2);
        } catch (error) {
            setErr(error?.response?.data?.message);
             setLoading(false)
            console.log(error)
        }
    }
    const handleStep2 = async()=>{
        try {
            setLoading(true)
             setErr("");
            const result = await axios.post(serverUrl+"/api/auth/verify-otp",{email,otp},{withCredentials: true});
            console.log(result.data);
            setLoading(false)
            setStep(3);
        } catch (error) {
             setLoading(false)
              setErr(error?.response?.data?.message);
             console.log(error)
        }
    }
    const handleStep3 = async()=>{
        try {
            setLoading(true)
             setErr("");
             if(!newPassword || !confirmNewPassword || newPassword !== confirmNewPassword){
                setErr("Passwords Don't Match");
                setLoading(false)
                return null;
             }
            const result = await axios.post(serverUrl+"/api/auth/reset-password",{email,newPassword},{withCredentials: true});
            console.log(result.data);
            setLoading(false)
            navigate("/signin")
           

        } catch (error) {
             setLoading(false)
              setErr(error?.response?.data?.message);
                 console.log(error)
        }
    }

    return (
        <div className='w-full h-screen bg-gradient-to-b from-black to-gray-900 flex flex-col justify-center items-center'>
            {step === 1 &&

                (<div className='w-[90%] max-w-[500px] h-[500px] bg-white rounded-2xl flex justify-center items-center flex-col border-[#1a1f23]'>
                    <h2 className='text-[30px] font-semibold'>Forgot Password</h2>
                    <div className='relative items-center flex justify-start w-[90%] h-[50px] rounded-2xl  border-2 border-black mt-[30px]' onClick={() => setInputClicked({ ...inputClicked, email: true })}>
                        <label htmlFor="email" className={`absolute left-[20px] p-[5px] bg-white text-[15px] ${inputClicked.email ? "top-[-15px] " : ""}`} >
                            Enter email
                        </label >
                        <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" id='email' className='w-[100%] h-[100%] rounded-2xl px-[20px] outline-none border-0' required />
                    </div>

                  {err && ( <p className='text-red-500'>{err}</p>)} 
                    <button onClick={handleStep1} disabled={loading} className='w-[70%] px-[20px] py-[10px] bg-black text-white font-semibold h-[50px] cursor-pointer rounded-2xl mt-[30px]'> {loading ? <ClipLoader size={30} color='white' /> : "Send OTP"}</button>

                </div>)}
            {step === 2 &&

                (<div className='w-[90%] max-w-[500px] h-[500px] bg-white rounded-2xl flex justify-center items-center flex-col border-[#1a1f23]'>
                    <h2 className='text-[30px] font-semibold'>Forgot Password</h2>
                    <div className='relative items-center flex justify-start w-[90%] h-[50px] rounded-2xl  border-2 border-black mt-[30px]' onClick={() => setInputClicked({ ...inputClicked, otp: true })}>
                        <label htmlFor="otp" className={`absolute left-[20px] p-[5px] bg-white text-[15px] ${inputClicked.otp ? "top-[-15px] " : ""}`} >
                            Enter otp
                        </label >
                        <input onChange={(e) => setOtp(e.target.value)} value={otp} type="number" id='otp' className='w-[100%] h-[100%] rounded-2xl px-[20px] outline-none border-0' required />
                    </div>

                     {err && ( <p className='text-red-500'>{err}</p>
)} 
<button onClick={handleStep2} disabled={loading} className='w-[70%] px-[20px] py-[10px] bg-black text-white font-semibold h-[50px] cursor-pointer rounded-2xl mt-[30px]'> {loading ? <ClipLoader size={30} color='white' /> : "Verify OTP"}</button>


                </div>)}
            {step === 3 &&

                (<div className='w-[90%] max-w-[500px] h-[500px] bg-white rounded-2xl flex justify-center items-center flex-col border-[#1a1f23]'>
                    <h2 className='text-[30px] font-semibold'>Forgot Password</h2>
                    <div className='relative items-center flex justify-start w-[90%] h-[50px] rounded-2xl  border-2 border-black  mt-[30px]'  onClick={() => setInputClicked({ ...inputClicked, newPassword: true })}>
                        <label htmlFor="newPassword" className={`absolute left-[20px] p-[5px] bg-white text-[15px] ${inputClicked.newPassword ? "top-[-15px] " : ""}`}>
                            New Password
                        </label >
                        <input onChange={(e) => setNewPassword(e.target.value)} value={newPassword} type={showNewPassword ? "text" : "password"} id='newPassword' className='w-[100%] h-[100%] rounded-2xl px-[20px] outline-none border-0' required />
                        {showNewPassword ? (<FaEyeSlash onClick={() => setShowNewPassword(false)} className='absolute cursor-pointer right-[20px] w-[15px] h-[15px]' />) :
                            <FaEye onClick={() => setShowNewPassword(true)} className='absolute cursor-pointer right-[20px] w-[15px] h-[15px]' />
                        }

                    </div>
                    <div className='relative items-center flex justify-start w-[90%] h-[50px] rounded-2xl  border-2 border-black mt-[30px]' onClick={() => setInputClicked({ ...inputClicked, confirmNewPassword: true })}>
                        <label htmlFor="confirmPassword" className={`absolute left-[20px] p-[5px] bg-white text-[15px] ${inputClicked.confirmNewPassword ? "top-[-15px] " : ""}`} >
                            Confirm Password
                        </label >
                        <input onChange={(e) => setConfirmNewPassword(e.target.value)} value={confirmNewPassword} type={showConfirmNewPassword ? "text" : "password"} id='confirmPassword' className='w-[100%] h-[100%] rounded-2xl px-[20px] outline-none border-0' required />
                        {showConfirmNewPassword ? (<FaEyeSlash onClick={() => setShowConfirmNewPassword(false)} className='absolute cursor-pointer right-[20px] w-[15px] h-[15px]' />) :
                            <FaEye onClick={() => setShowConfirmNewPassword(true)} className='absolute cursor-pointer right-[20px] w-[15px] h-[15px]' />
                        }

                    </div>

                     {err && ( <p className='text-red-500'>{err}</p>
)} 
<button onClick={handleStep3} disabled={loading} className='w-[70%] px-[20px] py-[10px] bg-black text-white font-semibold h-[50px] cursor-pointer rounded-2xl mt-[30px]'> {loading ? <ClipLoader size={30} color='white' /> : "Reset Password"}</button>


                </div>)}
        </div>
    )
}

export default ForgotPassword