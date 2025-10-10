import React from 'react'
import { FaArrowLeft } from 'react-icons/fa6'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import LoopCard from '../components/LoopCard';

const Loops = () => {
    const navigate = useNavigate();
    const { loopData } = useSelector(state => state.loop);
    return (
        <div className='w-screen h-screen bg-black overflow-hidden flex justify-center items-center'>
            <div className='w-[200px] z-[100] h-[80px] flex items-center gap-[20px] px-[20px] fixed top-[10px] left-[10px]'  ><FaArrowLeft className='cursor-pointer' size={25} onClick={() => navigate("/")} color='white' />
                <h1 className='text-white text-[20px] font-semibold'>Loops</h1></div>

<div className='h-[100vh] overflow-y-auto snap-y snap-mandatory scrollbar-hide'>
    {loopData?.map((loop,index)=>(
       <div className='h-screen snap-start '>
         <LoopCard key={index} loop={loop}/>
       </div>
    ))}
</div>
        </div>
    )
}

export default Loops