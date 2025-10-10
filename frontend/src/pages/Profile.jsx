import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { serverUrl } from '../App'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setProfileData, setUserData } from '../redux/userSlice'
import { FaArrowLeft } from 'react-icons/fa6'
import user from '../assets/user.jpg'
import Nav from '../components/Nav'
import FollowButton from '../components/FollowButton'
import Post from '../components/Post'
import { setSelectedUser } from '../redux/messageSlice'

const Profile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const { userName } = useParams();
    const [postType, setPostType] = useState("posts")
    const { profileData, userData } = useSelector(state => state.user);
    const { postData } = useSelector(state => state.post);
    const handleProfile = async () => {
        try {

            const result = await axios.get(`${serverUrl}/api/user/get-profile/${userName}`, { withCredentials: true });
            dispatch(setProfileData(result.data));



        } catch (error) {
            console.log(error)
        }
    }
    const handleLogOut = async () => {
        try {
            const result = await axios.get(serverUrl + "/api/auth/sign-out", { withCredentials: true });

            console.log(result.data);
            dispatch(setUserData(null));
        } catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {
        scrollTo(0,0)
        handleProfile();
    }, [userName, dispatch])
    return (
        <div className='w-full min-h-screen bg-black'>
            <div className='text-white w-full h-[80px] flex justify-between items-center px-[30px]'>
                <div className='cursor-pointer' onClick={() => navigate("/")}><FaArrowLeft size={25} /></div>
                <div className='font-semibold text-[20px]'>{profileData?.userName}</div>

                <div onClick={handleLogOut} className='font-semibold cursor-pointer text-[20px] text-blue-500'>Log out</div>

            </div>
            <div className='w-full h-[150px] flex items-start gap-[20px] lg:gap-[50px] pt-[20px] px-[10px] justify-center'>

                <div className='w-[80px] h-[80px] md:w-[140px] md:h-[140px] border-2 border-black rounded-full cursor-pointer overflow-hidden'>
                    <img src={profileData?.profileImage || user} alt="" className='w-full h-full object-cover' />
                </div>
                <div>
                    <div className='font-semibold text-[22px] text-white'>{profileData?.name}</div>
                    <div className=' text-[17px] text-[#ffffffe8]'>{profileData?.profession || "New User"}</div>
                    <div className='text-[17px] text-[#ffffffe8]'>{profileData?.bio}</div>
                </div>
            </div>

            <div className='w-full h-[100px] flex items-center justify-center gap-[40px] md:gap-[60px] px-[20%] pt-[30px] text-white'>
                <div>
                    <div className='text-white text-[22px] md:text-[30px] font-semibold'>{profileData?.posts?.length || 0}</div>
                    <div className='text-[18px] md:text-[22px] text-[#ffffffc7]'>Posts</div>
                </div>
                <div>
                    <div className='flex items-center justify-center gap-[20px]'>
                        <div className='flex relative'>
                            {profileData?.followers?.slice(0, 3).map((user, index) => (
                                <div className={`w-[40px] h-[40px] border-2 border-black rounded-full cursor-pointer overflow-hidden ${index > 0 ? ` absolute left-[${index * 10}px]` : ""}  `}>
                                    <img src={user?.profileImage || user} alt="" className='w-full h-full object-cover' />

                                </div>
                            ))}

                        </div>
                        <div className='text-white text-[22px] md:text-[30px] font-semibold'>{profileData?.followers?.length || 0}</div>
                    </div>
                    <div className='text-[18px] md:text-[22px] text-[#ffffffc7]'>Followers</div>
                </div>
                <div>
                    <div className='flex items-center justify-center gap-[20px]'>
                        <div className='flex relative'>
                            {profileData?.following?.slice(0, 3).map((user, index) => (
                                <div className={`w-[40px] h-[40px] border-2 border-black rounded-full cursor-pointer overflow-hidden ${index > 0 ? ` absolute left-[${index * 10}px]` : ""}  `}>
                                    <img src={user?.profileImage || user} alt="" className='w-full h-full object-cover' />

                                </div>
                            ))}

                        </div>
                        <div className='text-white text-[22px] md:text-[30px] font-semibold'>{profileData?.following?.length || 0}</div>
                    </div>
                    <div className='text-[18px] md:text-[22px] text-[#ffffffc7]'>Following</div>
                </div>
            </div>

            <div className='w-full h-[80px] flex justify-center items-center gap-[20px] mt-[10px]'>
                {profileData?._id == userData?._id && (
                    <button onClick={() => navigate('/edit-profile')} className='px-[10px] min-w-[150px] py-[5px] h-[40px] bg-white cursor-pointer rounded-2xl'>Edit Profile</button>
                )}
                {profileData?._id != userData?._id && (
                    <>
                        <FollowButton tailwind={'px-[10px] min-w-[150px] py-[5px] h-[40px] bg-white cursor-pointer rounded-2xl'} targetUserId={profileData?._id} onFollowChange={handleProfile} data={profileData} />
                        <button onClick={()=>{
                            dispatch(setSelectedUser(profileData));
                            navigate("/message-area")}} className='px-[10px] min-w-[150px] py-[5px] h-[40px] bg-white cursor-pointer rounded-2xl'>Message</button>
                    </>
                )}


            </div>



            <div className='w-full min-h-[100vh] flex justify-center'>
                <div className='w-full max-w-[900px] flex flex-col items-center rounded-t-[30px] bg-white relative gap-[20px] pt-[30px] pb-[100px]' >


                    {profileData?._id == userData?._id && (
                        <div className='w-[90%]  md:w-[60%] max-w-[400px] h-[80px] bg-white rounded-full flex justify-center items-center gap-[10px]'>

                            <div onClick={() => setPostType("posts")} className={`
                ${postType == "posts" ? "bg-black shadow-2xl shadow-black text-white" : ""}
                w-[28%] h-[80%] flex justify-center items-center text-[19px] hover:bg-black font-semibold rounded-full hover:text-white cursor-pointer hover:shadow-2xl hover:shadow-black`}>Post</div>
                            <div onClick={() => setPostType("saved")} className={`
                ${postType == "saved" ? "bg-black shadow-2xl shadow-black text-white" : ""}
                w-[28%] h-[80%] flex justify-center items-center text-[19px] hover:bg-black font-semibold rounded-full hover:text-white cursor-pointer hover:shadow-2xl hover:shadow-black`}>Saved</div>

                        </div>)}



                    {profileData?._id == userData?._id && <>
                        {

                            postType == "posts" && postData?.map((post, index) => (


                                post?.author?._id === profileData?._id ? (<Post post={post} key={index} />) : (<></>)

                            )


                            )}

                        {postType == "posts" && profileData?.posts?.length == 0 && (<div className='text-[25px] text-black text-center'>No Posts Yet</div>)}

                        {postType == "saved" && userData?.saved?.map((post, index) => (


                            (<Post post={post} key={index} />)

                        ))}

                        {postType == "saved" && userData?.saved?.length == 0 && (<div className='text-[25px] text-black text-center'>No Posts Yet</div>)}





                    </>}

                    {profileData?._id != userData?._id &&



                        postData?.map((post, index) => (


                            post?.author?._id === profileData?._id ? (<Post post={post} key={index} />) : (<></>)

                        ))

                    }

                    {profileData?._id != userData?._id &&


                        
                         profileData?.posts?.length == 0 && (<div className='pt-[150px] text-[25px] text-black text-center'>No Posts Yet</div>)
                    }


                    <Nav />
                </div>

            </div>

        </div>
    )
}

export default Profile