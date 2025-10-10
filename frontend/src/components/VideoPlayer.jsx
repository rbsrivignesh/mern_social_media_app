import React, { useEffect } from 'react'
import { useRef } from 'react';
import { useState } from 'react';
import { FiVolume2, FiVolumeX } from 'react-icons/fi';


const VideoPlayer = ({media }) => {
    const videoTag = useRef();
    const [mute,setMute] = useState(true);
    const[isPlaying, setIsPlaying] = useState(true);
    const handleClick = ()=>{
        if(isPlaying){
            videoTag.current.pause();
            setIsPlaying(false);
        }
        else{
             videoTag.current.play();
             setIsPlaying(true);
        }
    }

      useEffect(()=>{
            const observer = new IntersectionObserver(([entry])=>{
               const video = videoTag.current;
               if(entry.isIntersecting){
                video?.play();
                setIsPlaying(true);
               }
               else{
                video?.pause();
                setIsPlaying(false);
               }
            },{threshold : 0.6});
    
            if(videoTag.current){
    
    
                
                observer.observe(videoTag.current);
            }
    
            return()=>{
                if(videoTag.current){
    
    
                
                observer.unobserve(videoTag.current);
            }
            }
        },[])

  return (
    <div className='h-[100%] relative cursor-pointer max-w-full  rounded-2xl overflow-hidden'>
        <video onClick={handleClick} ref={videoTag} className='h-[100%] cursor-pointer w-full object-cover rounded-2xl' src={media} autoPlay loop muted={mute}/>
        <div className='absolute bottom-[10px] right-[10px]' onClick={()=> setMute(prev => !prev)}>
            {!mute ? <FiVolume2 size={20} color='white'/> : <FiVolumeX color='white'  size={20}/>}
        </div>
    </div>
  )
}

export default VideoPlayer