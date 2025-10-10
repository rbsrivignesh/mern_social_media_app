import React, { useEffect, useRef, useState } from 'react'
import user from '../assets/user.jpg'
import { FaArrowLeft } from 'react-icons/fa6';
import { LuImage } from 'react-icons/lu';
import { IoMdSend } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import { serverUrl } from '../App';
import { setMessages } from '../redux/messageSlice';
import SenderMessage from '../components/SenderMessage';
import ReceiverMessage from '../components/ReceiverMessage';

const MessageArea = () => {
    const { selectedUser, messages } = useSelector(state => state.message);
    const {userData} = useSelector(state => state.user);
    const {socket} = useSelector(state => state.socket);
    const navigate = useNavigate();
    const [input, setInput] = useState("");
    const imageInput = useRef();
    const [frontEndImage, setFrontEndImage] = useState(null);
    const [backEndImage, setBackEndImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const handleImage = (e) => {
        const file = e.target.files[0];
        setBackEndImage(file);
        setFrontEndImage(URL.createObjectURL(file));
    }
    const handleSubmit = async (e) => {
        try {
            const formData = new FormData();
            formData.append("message",input);
            if(backEndImage){
                formData.append('image',backEndImage);
            }
            setLoading(true)
            e.preventDefault();
            const result = await axios.post(`${serverUrl}/api/message/send/${selectedUser._id}`, formData, { withCredentials: true });


            dispatch(setMessages([...messages, result.data]))
            setInput("")
            setFrontEndImage(null);
            setBackEndImage(null);


            setLoading(false);
            
        } catch (error) {
            
            setFrontEndImage(null);
            setBackEndImage(null);
            setInput("")
            setLoading(false);
            console.log(error)
        }
    }

    const getAllMessages = async () => {
        try {
           
           
            const result = await axios.get(`${serverUrl}/api/message/get-all/${selectedUser._id}`, { withCredentials: true });


            dispatch(setMessages( result.data))



        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{getAllMessages()},[]);

    useEffect(()=>{
        

            console.log("Socket Calling");
            socket?.on("newMessage",(mess)=>{
            
                    console.log(messages)
                dispatch(setMessages([...messages,mess]));}
            )
            
            return ()=>{
                console.log("socket offing")
                socket?.off("newMessage");}
            
    },[messages,setMessages])
    return (

        <div className='w-full h-[100vh] bg-black relative'>
            <div className='w-full flex items-center gap-[15px] px-[20px] py-[10px] fixed top-0 z-[100] bg-black '>
                <div className=' h-[80px] flex items-center gap-[20px] px-[10px] ' >


                    <FaArrowLeft className='cursor-pointer  ' size={25} onClick={() => navigate(`/`)} color='white' />




                </div>

                <div onClick={() => navigate(`/profile/${selectedUser?.userName}`)} className='w-[50px] h-[50px] border-2 border-black rounded-full cursor-pointer overflow-hidden'>
                    <img src={selectedUser?.profileImage || user} alt="" className='w-full h-full object-cover' />
                </div>

                <div className='text-white text-[18px] font-semibold'>
                    <div>{selectedUser?.userName}</div>
                    <div className='text-[14px] text-gray-400'>{selectedUser?.name}</div>
                </div>

            </div>

            <div className='w-full h-[80px] fixed bottom-0 flex justify-center items-center bg-black z-[100]'>

                <form onSubmit={handleSubmit} className='w-[90%] max-w-[800px] h-[80%] rounded-full bg-[#131616] flex items-center gap-[10px] px-[20px] relative'>
                    {frontEndImage && (
                        <div className='w-[100px] h-[100px] rounded-2xl absolute top-[-120px] right-[10px] overflow-hidden'>
                            <img src={frontEndImage} className='h-full object-cover w-full' alt="" />
                        </div>
                    )}
                    <input onChange={handleImage} type="file" name="" id="" accept='image/*' hidden ref={imageInput} />
                    <input onChange={(e) => setInput(e.target.value)} value={input} type="text" placeholder='Message' className='w-full h-full px-[20px] text-[18px] text-white outline-0 ' />
                    <div onClick={() => imageInput.current.click()}>
                        <LuImage size={28} color="white" className='cursor-pointer' />
                    </div>
                    {(input || frontEndImage) && (<button disabled={loading} type='submit' className='w-[60px] h-[40px] rounded-full bg-gradient-to-br from-[#9500ff] to-[#ff0095] flex items-center justify-center cursor-pointer'>{loading ? <ClipLoader size={25} color='white' /> : <IoMdSend size={25} color='white' />} </button>)}
                </form>
            </div>

            <div className='w-full h-[90%] pt-[110px] pb-[80px]  px-[50px] flex flex-col gap-[50px] overflow-auto bg-black'>
{messages && messages.map((mess,index)=>(
 
    mess.sender == userData._id ? <SenderMessage message={mess}/> : <ReceiverMessage message={mess}/>
))}
            </div>



        </div>
    )
}

export default MessageArea