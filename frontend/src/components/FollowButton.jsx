import axios from 'axios';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { serverUrl } from '../App';
import { toggleFollow } from '../redux/userSlice';

const FollowButton = ({targetUserId, tailwind,onFollowChange, data}) => {
  
    const {following} = useSelector(state => state.user);
    // console.log(following)
    // const isFollowing = following?.includes(targetUserId) ;
     const isFollowing = following?.some(f => f._id == targetUserId);
    // console.log(isFollowing)
    const {userData} = useSelector(state=> state.user);

    // console.log(following);
    const dispatch  = useDispatch();
    const handleFollowButton = async()=>{
        try {
            const result = await axios.get(`${serverUrl}/api/user/follow/${targetUserId}`,{withCredentials : true});
          

           
            if(onFollowChange){
              
                onFollowChange();
            
            }
            dispatch(toggleFollow({data,targetUserId}));

            
        } catch (error) {
            console.log(error);
        }
    }

  return (
   <button onClick={handleFollowButton} className={tailwind}>
    {isFollowing ? "Following":"Follow"}
 
   </button>
  )
}

export default FollowButton