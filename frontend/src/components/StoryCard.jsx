import React, { useEffect, useState } from 'react'
import user from '../assets/user.jpg'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaEye } from 'react-icons/fa6'
import VideoPlayer from './VideoPlayer'
import { useSelector } from 'react-redux'
const StoryCard = ({ story }) => {
    const navigate = useNavigate()
    const [progress, setProgress] = useState(0);
    const { userData } = useSelector(state => state.user);
    const [showViewers, setShowViewers] = useState(false);
    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    navigate("/");
                    return 100;
                }
                // return prev+1;
            }
            )
        }, 150)

        return () => clearInterval(interval);
    }, [navigate]);
    return (
        <div className='lg:w-[500px] w-full h-[100vh] border-x-2 border-gray-800 pt-[10px] relative flex flex-col justify-center'>

            <div className='flex items-center gap-[10px] absolute top-[20px] px-[10px] z-50 '>

                <FaArrowLeft className='cursor-pointer' size={25} onClick={() => navigate("/")} color='white' />

                <div onClick={() => navigate(`/profile/${story?.author?.userName}`)} className='w-[30px] h-[30px] lg:w-[40px]  lg:h-[40px]  border-2 border-black rounded-full cursor-pointer overflow-hidden'>
                    <img src={story?.author?.profileImage || user} alt="" className='w-full h-full object-cover' />
                </div>

                <div className='w-[150px] font-semibold truncate text-white'>
                    {story?.author?.userName}

                </div>
            </div>

            {!showViewers && (
                <>
                    <div className='w-full h-[90vh]  flex  items-center justify-center'>        {story?.mediaType == "image" && (
                        <div className='w-[90%]  flex items-center justify-center'>
                            <img src={story?.media} alt="" className='w-[80%] rounded-2xl object-cover' />

                        </div>


                    )}
                        {story?.mediaType == "video" && (
                            <div className='w-[80%]  flex  flex-col items-center justify-center '>
                                s
                                <VideoPlayer media={story?.media} />

                            </div>


                        )}

                    </div>

                    {story?.author?.userName == userData?.userName && (

                        <div className='absolute w-[75%] flex items-center gap-[20px] text-white h-[70px] p-2 left-0 bottom-0 cursor-pointer' onClick={()=>setShowViewers(true)}>
                            <div className='text-white flex items-center gap-[5px]'><FaEye />{story?.viewers?.length} Viewers</div>

                            <div className="flex items-center -space-x-3">
                                {story?.viewers?.slice(0, 3).map((user, index) => (
                                    <div
                                        key={index}
                                        className="w-[30px] h-[30px] border-2 border-black rounded-full overflow-hidden"
                                    >
                                        <img
                                            src={user?.profileImage || user}
                                            alt=""
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ))}
                            </div>

                        </div>)}
                </>
            )}
            {showViewers && (
                <>
                    <div className='w-full h-[30%]  flex  items-center justify-center mt-[100px] overflow-hidden py-[30px] cursor-pointer'  onClick={()=>setShowViewers(false)}>         {story?.mediaType == "image" && (
                        <div className='h-full  flex items-center justify-center'>
                            <img src={story?.media} alt="" className='h-full rounded-2xl object-cover' />

                        </div>


                    )}
                        {story?.mediaType == "video" && (
                            <div className='h-full flex  flex-col items-center justify-center '>
                                <VideoPlayer media={story?.media} />

                            </div>




                        )}

                    </div>

                    <div className='w-full h-[70%] border-t-2 border-t-gray-800 p-[20px]'>
                        <div className='text-white flex items-center gap-[5px]'><FaEye />{story?.viewers?.length} Viewers</div>
<div className='w-full max-h-full flex flex-col gap-[10px] overflow-auto pt-[20px]'>
    
                         {story?.viewers?.map((viewer, index) => (
                <div key={index} className='w-full flex items-center gap-[20px] '>

                    <div onClick={() => navigate(`/profile/${viewer?.userName}`)} className='w-[30px] h-[30px] lg:w-[40px]  lg:h-[40px]  border-2 border-black rounded-full cursor-pointer overflow-hidden'>
                        <img src={viewer?.profileImage || user} alt="" className='w-full h-full object-cover' />
                    </div>

                    <div className='w-[150px] font-semibold truncate text-white'>
                        {viewer?.userName}

                    </div>
                </div>
            ))}

</div>


                    </div> </>
            )}

           



            <div className=' top-[10px] w-full h-[5px] bg-gray-900 absolute'>
                <div className='w-[200px] h-full bg-white transition-all duration-200 ease-linear' style={{ width: `${progress}%` }}></div>

            </div>


        </div>
    )
}

export default StoryCard