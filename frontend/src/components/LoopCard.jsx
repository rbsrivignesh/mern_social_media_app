import React, { useEffect, useRef, useState } from 'react'
import { FiVolume2, FiVolumeX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import user from '../assets/user.jpg'
import FollowButton from './FollowButton';
import { useDispatch, useSelector } from 'react-redux';
import { GoHeart, GoHeartFill } from 'react-icons/go';
import { MdOutlineComment } from 'react-icons/md';
import axios from 'axios';
import { serverUrl } from '../App';
import { setLoopData } from '../redux/loopSlice';
import { IoSendSharp } from 'react-icons/io5';


const LoopCard = ({ loop }) => {
    const videoRef = useRef()
    const commentRef = useRef()
    const { loopData } = useSelector(state => state.loop)
    const {socket} = useSelector(state=> state.socket);
    const dispatch = useDispatch()
    const [showHeart, setShowHeart] = useState(false);

    const { userData } = useSelector(state => state.user)
    const navigate = useNavigate();
    const [message, setMessage] = useState("");

    const [showComment, setShowComment] = useState(false);
    const [mute, setMute] = useState(true);
    const [isPlaying, setIsPlaying] = useState(true);
    const handleClick = () => {
        if (isPlaying) {
            videoRef.current.pause();
            setIsPlaying(false);
        }
        else {
            videoRef.current.play();
            setIsPlaying(true);
        }
    }


    useEffect(() => {
        const handleClickOutSide = (event) => {
            // console.log(commentRef.current);
            // console.log(event.target);
            // console.log(event)
            // console.log(commentRef.current.contains(event.target));
            if (commentRef.current && !commentRef.current.contains(event.target)) {
                setShowComment(false);
            }
        }

        if (showComment) {
            document.addEventListener("mousedown", handleClickOutSide)
        }
        else {
            document.removeEventListener("mousedown", handleClickOutSide)
        }

        return () => { document.removeEventListener("mousedown", handleClickOutSide) }
    }, [showComment])
    const [progress, setProgress] = useState(0);
    const handleTimeUpdate = () => {
        const video = videoRef.current;
        if (video) {
            const percent = (video?.currentTime / video?.duration) * 100;
            setProgress(percent);
        }
    }
    const handleLike = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/loop/like/${loop?._id}`, { withCredentials: true });

            const updatedloop = result.data;

            const updatedloops = loopData?.map(p => p._id == loop._id ? updatedloop : p);
            dispatch(setLoopData(updatedloops));




        } catch (error) {
            console.log(error);
        }
    }

    const handleComment = async () => {
        try {
            const result = await axios.post(`${serverUrl}/api/loop/comment/${loop?._id}`, { message }, { withCredentials: true });

            const updatedloop = result.data;

            const updatedloops = loopData?.map(p => p._id == loop._id ? updatedloop : p);
            dispatch(setLoopData(updatedloops));

            setMessage("");




        } catch (error) {
            setMessage("");
            console.log(error)
        }
    }
    const handleLikeOnDoubleClick = () => {
        setShowHeart(true);
        setTimeout(() => setShowHeart(false), 6000);
        { !loop?.likes?.includes(userData?._id) ? handleLike() : null }
    }

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            const video = videoRef.current;
            if (entry.isIntersecting) {
                video?.play();
            }
            else {
                video?.pause();
            }
        }, { threshold: 0.6 });

        if (videoRef.current) {



            observer.observe(videoRef.current);
        }

        return () => {
            if (videoRef.current) {



                observer.unobserve(videoRef.current);
            }
        }
    }, [])

    
      useEffect(() => {
        socket?.on("likedLoop", (updatedData) => {
    
          const updatedPosts = loopData?.map(p => p._id == updatedData.loopId ? { ...p, likes: updatedData.likes } : p);
          dispatch(setLoopData(updatedPosts));
        })
        socket?.on("commentedLoop", (updatedData) => {
    
          const updatedPosts = loopData?.map(p => p._id == updatedData.loopId ? { ...p, comments: updatedData.comments } : p);
          dispatch(setLoopData(updatedPosts));
        })
    
        return () => {
          socket?.off("likedLoop");
          socket?.off("commentedLoop");
        }
      }, [socket, loopData, dispatch])
    return (
        <div className='w-full lg:w-[480px] h-[100vh] flex items-center justify-center border-l-2 border-r-2 border-gray-800 relative overflow-hidden'>

            {showHeart && (<div className='absolute top-1/2 left-1/2  transform -translate-x-1/2 -translate-y-1/2  z-50' >

                <GoHeartFill className='heart-animation h-[100px] w-[100px] text-white drop-shadow-2xl' />
            </div>)}


            <div ref={commentRef} className={`absolute z-[200] bottom-0 w-full h-[500px] p-[10px] rounded-t-4xl bg-[#0e1718] transition-transform duration-300 ease-in-out left-0 shadow-2xl shadow-black ${showComment ? "translate-y-0" : "translate-y-[100%] "}`}>
                <h1 className='text-white text-[20px] font-semibold text-center'>Comments</h1>

                <div className='w-full h-[350px] overflow-y-auto flex flex-col gap-[20px]'>

                    {loop?.comments.length == 0 && (<div className='text-center text-white text-[20px] font-semibold mt-[50px]'> No Comments Yet</div>)}
                    {loop?.comments?.map((com, index) => (
                        <div className='w-full flex flex-col gap-[5px] border-b-[1px] border-gray-800 justify-center pb-[10px] mt-[10px]' key={index}>
                            <div className='flex justify-start items-center md:gap-[20px] gap-[10px]' >
                                <div onClick={() => navigate(`/profile/${com?.author?.userName}`)} className='w-[30px] h-[30px] lg:w-[40px]  lg:h-[40px]  border-2 border-black rounded-full cursor-pointer overflow-hidden'>
                                    <img src={com?.author?.profileImage || user} alt="" className='w-full h-full object-cover' />
                                </div>

                                <div className='w-[150px] font-semibold truncate text-white'>
                                    {com?.author?.userName}

                                </div>

                            </div>

                            <div className='text-white pl-[60px]'>
                                {com?.message}
                            </div>
                        </div>
                    ))}


                </div>
                <div className='w-full h-[80px] flex items-center justify-between px-[10px] py-[20px] fixed bottom-0'>
                    <div className='w-[30px] h-[30px] lg:w-[40px]  lg:h-[40px]  border-2 border-black rounded-full cursor-pointer overflow-hidden'>
                        <img src={loop?.author?.profileImage || user} alt="" className='w-full h-full object-cover' />
                    </div>
                    <input onChange={(e) => setMessage(e.target.value)} value={message} type="text" className='px-[10px] border-b-2 border-b-gray-500 w-[90%] outline-none h-[40px] text-white' placeholder='Write comment..' />
                  {message && (  <button onClick={handleComment} className='absolute right-[20px] cursor-pointer'><IoSendSharp color='white' className='w-[25px] h-[25px]' /></button>)}
                </div>
            </div>



            <video onTimeUpdate={handleTimeUpdate} onClick={handleClick} ref={videoRef} autoPlay loop muted={mute} src={loop?.media} className='w-full max-h-full' onDoubleClick={handleLikeOnDoubleClick} />
            <div className='absolute top-[20px] right-[10px] cursor-pointer' onClick={() => setMute(prev => !prev)}>
                {!mute ? <FiVolume2 size={20} color='white' /> : <FiVolumeX color='white' size={20} />}
            </div>

            <div className=' bottom-0 w-full h-[5px] bg-gray-900 absolute'>
                <div className='w-[200px] h-full bg-white transition-all duration-200 ease-linear' style={{ width: `${progress}%` }}></div>

            </div>

            <div className='w-full absolute h-[100px] bottom-[10px] p-[10px] flex flex-col '>
                <div className='flex items-center md:gap-[10px] gap-[10px]' >
                    <div onClick={() => navigate(`/profile/${loop?.author?.userName}`)} className='w-[30px] h-[30px] lg:w-[40px]  lg:h-[40px]  border-2 border-black rounded-full cursor-pointer overflow-hidden'>
                        <img src={loop?.author?.profileImage || user} alt="" className='w-full h-full object-cover' />
                    </div>

                    <div className='w-[120px] font-semibold truncate text-white'>
                        {loop?.author?.userName}

                    </div>
                    {userData?._id != loop?.author?._id && (<FollowButton tailwind={'px-[10px] py-[5px] text-white border-2 text-[14px] rounded-2xl cursor-pointer'} data={loop?.author} targetUserId={loop?.author?._id} />
                    )}
                </div>

                <div className='text-white px-[10px]'>
                    {loop?.caption}
                </div>

                <div className='absolute right-0  flex flex-col gap-[20px] text-white bottom-[150px] justify-center px-[10px]'>


                    <div className='flex flex-col items-center cursor-pointer'>
                        <div onClick={handleLike}>
                            {loop?.likes?.includes(userData?._id) && <GoHeartFill className='cursor-pointer h-[25px] w-[25px] text-red-600' />}
                            {!loop?.likes?.includes(userData?._id) && <GoHeart className='cursor-pointer h-[25px] w-[25px]' />}


                        </div>
                        <div>
                            <span>{loop?.likes?.length}</span>
                        </div>
                    </div>
                    <div className='flex items-center flex-col '><MdOutlineComment onClick={() => setShowComment(prev => !prev)} className='cursor-pointer h-[25px] w-[25px]' />
                        <span>{loop?.comments?.length}</span></div>


                </div>
            </div>
        </div>
    )
}

export default LoopCard