import React from 'react'
import user from '../assets/user.jpg'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa6'
import { useDispatch, useSelector } from 'react-redux'
import NotificationCard from '../components/NotificationCard'
import axios from 'axios'
import { serverUrl } from '../App'
import { useEffect } from 'react'
import getAllNotifications from '../hooks/getAllNotifications'
import { setNotifcationData } from '../redux/userSlice'

const Notifications = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const { notificationData } = useSelector(state => state.user);

    const ids = notificationData.map((n) => n._id);

    const markAsRead = async () => {
        try {
            const result = await axios.post(serverUrl + "/api/user/mark-as-read", { notificationId: ids }, { withCredentials: true })
            await fetchNotifications();
        } catch (error) {
            console.log(error)
        }
    }
    const fetchNotifications = async () => {
        try {
            const result = await axios.get(serverUrl + "/api/user/get-notifications", { withCredentials: true });
            // console.log(result.data)
            dispatch(setNotifcationData(result.data))


        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        markAsRead();


    }, []);
    return (
        <div className='w-full h-[100vh] bg-black pb-[120px] '>
            <div className='w-[200px] h-[80px] flex justify-start items-center gap-[30px] px-[30px] lg:hidden' >

                <FaArrowLeft className='cursor-pointer absolute left-[20px] ' size={25} onClick={() => navigate(`/`)} color='white' />

                <h1 className='text-white text-[20px] px-[20px] font-semibold'>Notifications</h1>


            </div>
            <div className='w-full flex flex-col gap-[20px] h-[100%] overflow-auto '>
                {notificationData?.map((noti, index) => (
                    <NotificationCard noti={noti} key={index} />
                ))}
            </div>

        </div>
    )
}

export default Notifications