import React from 'react'
import { useRef } from 'react';
import { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa6'
import { FiPlusSquare } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom'
import VideoPlayer from '../components/VideoPlayer';
import axios from 'axios';
import { serverUrl } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import { setPostData } from '../redux/postSlice';
import { setCurrentUserStory, setStoryData } from '../redux/storySlice';
import { setLoopData } from '../redux/loopSlice';
import { ClipLoader } from 'react-spinners';
import { setUserData } from '../redux/userSlice';

const Upload = () => {
    const navigate = useNavigate();
    const [uploadType, setUploadType] = useState("Post");
    const [frontEndMedia, setFrontEndMedia] = useState(null)
    const [backEndMedia, setBackEndMedia] = useState(null)
    const [mediaType, setMediaType] = useState("")
    const mediaInput = useRef();
    const [caption, setCaption] = useState("");
    const dispatch = useDispatch();
    const { postData } = useSelector(state => state.post);
    const { storyData } = useSelector(state => state.story);
    const { loopData } = useSelector(state => state.loop);
    const [loading, setLoading] = useState(false);
    const handleMedia = (e) => {
        const file = e.target.files[0];
        if (file.type.includes("image")) {
            setMediaType("image");
        }
        else {
            setMediaType("video");
        }
        console.log(file.type.includes("image"))
        setBackEndMedia(file);
        console.log(file)
        setFrontEndMedia(URL.createObjectURL(file));
    }

    const handleSubmit = async () => {
        if (uploadType == "Post") {
            uploadPost();
        }
        else if (uploadType == "Loop") {
            uploadLoop();
        }
        else {
            uploadStory();
        }
    }

    const uploadPost = async () => {
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("caption", caption);
            formData.append("media", backEndMedia);
            formData.append("mediaType", mediaType);
            const result = await axios.post(`${serverUrl}/api/post/upload`, formData, { withCredentials: true });
            console.log(result.data);
            dispatch(setPostData([result.data, ...postData]))
            setLoading(false)
            navigate("/")

        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }
    const uploadStory = async () => {
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("media", backEndMedia);
            formData.append("mediaType", mediaType);
            const result = await axios.post(`${serverUrl}/api/story/upload`, formData, { withCredentials: true });
         
            dispatch(setCurrentUserStory(result.data));
           
        setLoading(false)
        navigate("/")


    } catch (error) {
        console.log(error)
        setLoading(false)



    }
}
const uploadLoop = async () => {
    try {
        setLoading(true);

        const formData = new FormData();
        formData.append("caption", caption);
        formData.append("media", backEndMedia);

        const result = await axios.post(`${serverUrl}/api/loop/upload`, formData, { withCredentials: true });
        console.log(result.data);
        dispatch(setLoopData([...loopData, result.data]));
        setLoading(false)
        navigate("/")



    } catch (error) {
        console.log(error)
        setLoading(false)

    }
}
return (
    <div className='w-full h-[100vh] bg-black flex flex-col items-center'>
        <div className='w-full h-[80px] flex items-center gap-[20px] px-[20px] '  ><FaArrowLeft className='cursor-pointer' size={25} onClick={() => navigate("/")} color='white' />
            <h1 className='text-white text-[20px] font-semibold'>Upload Media</h1></div>

        <div className='w-[90%] max-w-[600px] h-[80px] bg-white rounded-full flex justify-around items-center gap-[10px]'>
            <input type='file' accept={uploadType == "Loop" ? "video/*" : ""} hidden ref={mediaInput} onChange={handleMedia} />
            <div onClick={() => setUploadType("Post")} className={`
                ${uploadType == "Post" ? "bg-black shadow-2xl shadow-black text-white" : ""}
                w-[28%] h-[80%] flex justify-center items-center text-[19px] hover:bg-black font-semibold rounded-full hover:text-white cursor-pointer hover:shadow-2xl hover:shadow-black`}>Post</div>
            <div onClick={() => setUploadType("Story")} className={`
                ${uploadType == "Story" ? "bg-black shadow-2xl shadow-black text-white" : ""}
                w-[28%] h-[80%] flex justify-center items-center text-[19px] hover:bg-black font-semibold rounded-full hover:text-white cursor-pointer hover:shadow-2xl hover:shadow-black`}>Story</div>
            <div onClick={() => setUploadType("Loop")} className={`
                ${uploadType == "Loop" ? "bg-black shadow-2xl shadow-black text-white" : ""}
                w-[28%] h-[80%] flex justify-center items-center text-[19px] hover:bg-black font-semibold rounded-full hover:text-white cursor-pointer hover:shadow-2xl hover:shadow-black`}>Loop</div>
        </div>

        {!frontEndMedia && (<div className='w-[80%] max-w-[500px] h-[250px] bg-[#0e1316] border-gray-800 border-2 flex flex-col items-center justify-center gap-[8px] mt-[15vh] rounded-2xl cursor-pointer hover:bg-[#353a3d]' onClick={() => mediaInput.current.click()}>
            <FiPlusSquare color='white' className='cursor-pointer' size={30} />
            <div className='text-white text-[19px] font-semibold'>
                Upload {uploadType}
            </div>
        </div>)}

        {frontEndMedia && (
            <div className='w-[80%] max-w-[500px] h-[250px] flex flex-col items-center justify-center mt-[15vh]'>
                {mediaType == "image" && (
                    <div className='w-[80%] max-w-[500px] h-[250px] flex flex-col items-center justify-center mt-[5vh]'>
                        <img src={frontEndMedia} alt="" className='h-[60%] rounded-2xl' />

                        {uploadType != "Story" && (<input onChange={(e) => setCaption(e.target.value)} value={caption} type="text" className='w-full border-b-gray-400 border-b-2 outline-none px-[10px] py-[5px] text-white mt-[20px] ' placeholder='Enter the caption' />)}
                    </div>


                )}
                {mediaType == "video" && (
                    <div className='w-[80%] max-w-[500px] h-[250px] flex flex-col items-center justify-center mt-[5vh]'>
                        <VideoPlayer media={frontEndMedia} />

                        {uploadType != "Story" && (<input onChange={(e) => setCaption(e.target.value)} value={caption} type="text" className='w-full border-b-gray-400 border-b-2 outline-none px-[10px] py-[5px] text-white mt-[20px] ' placeholder='Enter the caption' />)}
                    </div>


                )}



            </div>
        )}
        {frontEndMedia && (
            <button disabled={loading} onClick={handleSubmit} className='px-[10px] w-[60%] max-w-[400px] py-[5px] bg-white mt-[50px] cursor-pointer rounded-2xl'> {loading ? <ClipLoader size={30} color='black' /> : `Upload ${uploadType}`} </button>
        )}


    </div>
)
}

export default Upload