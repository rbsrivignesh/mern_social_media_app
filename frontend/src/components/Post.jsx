import React, { useState } from 'react'
import user from '../assets/user.jpg'
import { useNavigate } from 'react-router-dom'
import VideoPlayer from './VideoPlayer';
import { MdOutlineBookmark, MdOutlineBookmarkAdd, MdOutlineBookmarkBorder, MdOutlineComment } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux';
import { GoHeart, GoHeartFill } from 'react-icons/go';
import { IoSendSharp } from 'react-icons/io5'
import axios from 'axios';
import { serverUrl } from '../App';
import { setPostData } from '../redux/postSlice';
import { setUserData } from '../redux/userSlice';
import FollowButton from './FollowButton';
import { useEffect } from 'react';

const Post = ({ post }) => {
  const navigate = useNavigate();
  const { userData } = useSelector(state => state.user);
  const { postData } = useSelector(state => state.post);
  const [showComment, setShowComment] = useState(false);
  const [message, setMessage] = useState("");
  const { socket } = useSelector(state => state.socket);
  const dispatch = useDispatch();

  const handleLike = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/post/like/${post?._id}`, { withCredentials: true });

      const updatedPost = result.data;

      const updatedPosts = postData?.map(p => p._id == post._id ? updatedPost : p);
      dispatch(setPostData(updatedPosts));




    } catch (error) {
      console.log(error);
    }
  }
  const handleComment = async () => {
    try {
      const result = await axios.post(`${serverUrl}/api/post/comment/${post?._id}`, { message }, { withCredentials: true });

      const updatedPost = result.data;

      const updatedPosts = postData?.map(p => p._id == post._id ? updatedPost : p);
      dispatch(setPostData(updatedPosts));

      setMessage("");




    } catch (error) {
      setMessage("");
      console.log(error)
    }
  }
  const handleSave = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/post/save/${post?._id}`, { withCredentials: true });

      dispatch(setUserData(result.data));






    } catch (error) {

      console.log(error)
    }
  }

  useEffect(() => {
    socket?.on("likedPost", (updatedData) => {

      const updatedPosts = postData?.map(p => p._id == updatedData.postId ? { ...p, likes: updatedData.likes } : p);
      dispatch(setPostData(updatedPosts));
    })
    socket?.on("commentedPost", (updatedData) => {

      const updatedPosts = postData?.map(p => p._id == updatedData.postId ? { ...p, comments: updatedData.comments } : p);
      dispatch(setPostData(updatedPosts));
    })

    return () => {
      socket?.off("likedPost");
      socket?.off("commentedPost");
    }
  }, [socket, postData, dispatch])
  return (
    <div className='w-[90%]  flex flex-col gap-[10px] bg-white items-center shadow-2xl shadow-[#00000058] rounded-2xl pb-[20px]'>

      <div className='w-full h-[80px] flex justify-between items-center px-[10px]'>
        <div className='flex justify-center items-center md:gap-[20px] gap-[10px]' >
          <div onClick={() => navigate(`/profile/${post?.author?.userName}`)} className='w-[40px] h-[40px] lg:w-[60px]  lg:h-[60px]  border-2 border-black rounded-full cursor-pointer overflow-hidden'>
            <img src={post?.author?.profileImage || user} alt="" className='w-full h-full object-cover' />
          </div>

          <div className='w-[150px] font-semibold truncate'>
            {post?.author?.userName}

          </div>
        </div>
        {userData?._id != post?.author?._id && (<FollowButton tailwind={'px-[10px] w-[80px]  md:w-[100px] py-[5px] h-[30px] md:h-[40px] bg-black text-white rounded-2xl text-[14px] md:text-[16px]'} targetUserId={post?.author?._id} data={post?.author} />
        )}


      </div>
      <div className='w-[90%]  flex  items-center justify-center'>        {post?.mediaType == "image" && (
        <div onDoubleClick={handleLike} className='w-[90%]  flex items-center justify-center'>
          <img src={post?.media} alt="" className='w-[80%] rounded-2xl object-cover' />

        </div>


      )}
        {post?.mediaType == "video" && (
          <div className='w-[80%]  flex  flex-col items-center justify-center '>
            <VideoPlayer media={post?.media} />

          </div>


        )}

      </div>

      <div className='w-full h-[60px] flex justify-between items-center px-[20px] mt-[10px]'>
        <div className='flex items-center justify-center gap-[10px]'>
          <div onClick={handleLike} className='flex items-center justify-center gap-[5px]'>
            {post?.likes?.includes(userData?._id) && <GoHeartFill className='cursor-pointer h-[25px] w-[25px] text-red-600' />}
            {!post?.likes?.includes(userData?._id) && <GoHeart className='cursor-pointer h-[25px] w-[25px]' />}
            <span>{post?.likes?.length}</span>
          </div>
          <div onClick={() => setShowComment(prev => !prev)} className='flex items-center justify-center gap-[5px]'><MdOutlineComment className='cursor-pointer h-[25px] w-[25px]' />
            <span>{post?.comments?.length}</span></div>
        </div>
        <div onClick={handleSave}>

          {userData?.saved?.some(p => p?._id == post?._id) && (<MdOutlineBookmark className='cursor-pointer h-[25px] w-[25px]' />)}
          {!userData?.saved?.some(p => p?._id == post?._id) && (<MdOutlineBookmarkBorder className='cursor-pointer h-[25px] w-[25px]' />)}
          {/* {userData?.saved?.includes(post?._id) && (<MdOutlineBookmark className='cursor-pointer h-[25px] w-[25px]' />)}
          {!userData?.saved?.includes(post?._id) && (<MdOutlineBookmarkBorder className='cursor-pointer h-[25px] w-[25px]' />)} */}

        </div>
      </div>
      {
        post?.caption && (

          <div className='w-full px-[20px] gap-[10px] flex justify-start items-center'>
            <h1 className='font-semibold'>{post?.author?.userName}</h1>
            <div>{post?.caption}</div>
          </div>


        )
      }
      {showComment && (

        <div className='w-full flex-col flex gap-[30px] pb-[20px]'>
          <div className='w-full h-[80px] flex items-center justify-between px-[20px] relative'>
            <div className='w-[40px] h-[40px] lg:w-[60px]  lg:h-[60px]  border-2 border-black rounded-full cursor-pointer overflow-hidden'>
              <img src={userData?.profileImage || user} alt="" className='w-full h-full object-cover' />
            </div>
            <input onChange={(e) => setMessage(e.target.value)} value={message} type="text" className='px-[10px] border-b-2 border-b-gray-500 w-[90%] outline-none h-[40px] ' placeholder='Write comment..' />
            {message && (<button onClick={handleComment} className='absolute right-[20px] cursor-pointer'><IoSendSharp className='w-[25px] h-[25px]' /></button>)}
          </div>

          <div className='w-full max-h-[300px] overflow-auto'>
            {post?.comments?.map((com, index) => (
              <div key={index} className='w-full px-[20px] py-[20px] flex items-center gap-[20px] border-b-2 border-b-gray-200'>
                <div className='w-[40px] h-[40px] lg:w-[60px]  lg:h-[60px]  border-2 border-black rounded-full cursor-pointer overflow-hidden'>
                  <img src={com?.author?.profileImage || user} alt="" className='w-full h-full object-cover' />
                </div>
                <div>
                  {com?.message}
                </div>
              </div>

            ))}

          </div>
        </div>


      )}

    </div>
  )
}

export default Post