import React, { useRef, useState } from 'react'
import { FaArrowLeft } from 'react-icons/fa6'
import { useDispatch, useSelector } from 'react-redux';
import { Form, useNavigate } from 'react-router-dom'
import user from '../assets/user.jpg'
import axios from 'axios';
import { serverUrl } from '../App';
import { setProfileData, setUserData } from '../redux/userSlice';
import { ClipLoader } from 'react-spinners';

const EditProfile = () => {
    const navigate = useNavigate();
    const { userData } = useSelector(state => state.user);
    const imageInput = useRef();
    const [frontendImage, setFrontendImage] = useState(userData?.profileImage || user);
    const [backendImage, setBackendImage] = useState(null);
    const [name,setName] = useState(userData?.name || "");
    const [userName,setUserName] = useState(userData?.userName || "");
    const [bio,setBio] = useState(userData?.bio || "");
    const [profession,setProfession] = useState(userData?.profession || "");
    const [gender,setGender] = useState(userData?.gender || "");
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const handleImage = (e)=>{
        const file = e.target.files[0];
        setBackendImage(file);
        setFrontendImage(URL.createObjectURL(file));
    }

    const handleEditProfile = async()=>{
        try {
            setLoading(true)
            const formdata = new FormData();
            formdata.append("name",name)
            formdata.append("userName",userName)
            formdata.append("bio",bio)
            formdata.append("profession",profession)
            formdata.append("gender",gender)
            if(backendImage){

                formdata.append("profileImage",backendImage)
            }
            const result = await axios.post(`${serverUrl}/api/user/edit-profile`,formdata,{withCredentials : true})

            dispatch(setProfileData(result.data));
            dispatch(setUserData(result.data));
            setLoading(false);
            navigate(`/profile/${userData?.userName}`)
        } catch (error) {
            console.log(error)
            setLoading(false);
        }
    }

    return (
        <div className='w-full min-h-[100vh] bg-black flex items-center flex-col gap-[20px] p-[25px] pt-[20px]'>
            <div className='w-full h-[80px] flex items-center gap-[20px] px-[30px] ' >
                
                <FaArrowLeft className='cursor-pointer absolute left-[20px] ' size={25} onClick={() => navigate(`/profile/${userData?.userName}`)} color='white' />

                <h1 className='text-white text-[20px] px-[20px] font-semibold'>Edit Profile</h1>


            </div>

            <div onClick={()=>imageInput.current.click()} className='w-[60px] h-[60px] md:w-[100px] md:h-[100px] border-2 border-black rounded-full cursor-pointer overflow-hidden'>
                <input onChange={handleImage} type="file" accept='image/*' ref={imageInput} hidden/>
                <img src={frontendImage} alt="" className='w-full h-full object-cover' />
            </div>

            <div  onClick={()=>imageInput.current.click()}className='text-blue-500 text-center text-[18px] font-semibold cursor-pointer'>Change your Profile Picture</div>

            <input type="text" className='w-[90%] max-w-[600px] h-[60px] bg-[#0a1010] border-2 text-white font-semibold border-gray-700 rounded-2xl px-[20px] outline-none' placeholder='Enter Your Name' value={name} onChange={(e)=>setName(e.target.value)} />
            <input type="text" className='w-[90%] max-w-[600px] h-[60px] bg-[#0a1010] border-2 text-white font-semibold border-gray-700 rounded-2xl px-[20px] outline-none' placeholder='Enter Your UserName'  value={userName} onChange={(e)=>setUserName(e.target.value)} />
            <input type="text" className='w-[90%] max-w-[600px] h-[60px] bg-[#0a1010] border-2 text-white font-semibold border-gray-700 rounded-2xl px-[20px] outline-none' placeholder='Bio' value={bio} onChange={(e)=>setBio(e.target.value)} />
            <input type="text" className='w-[90%] max-w-[600px] h-[60px] bg-[#0a1010] border-2 text-white font-semibold border-gray-700 rounded-2xl px-[20px] outline-none' placeholder='Profession'  value={profession} onChange={(e)=>setProfession(e.target.value)} />
            <input type="text" className='w-[90%] max-w-[600px] h-[60px] bg-[#0a1010] border-2 text-white font-semibold border-gray-700 rounded-2xl px-[20px] outline-none' placeholder='Gender'  value={gender} onChange={(e)=>setGender(e.target.value)} />

            <button onClick={handleEditProfile} className='px-[10px] w-[60%] max-w-[400px] py-[5px] h-[50px] bg-white cursor-pointer rounded-2xl' disabled = {loading}>{loading ? <ClipLoader color='black' size={30}/> : "Save Profile"}</button>



        </div>
    )
}

export default EditProfile