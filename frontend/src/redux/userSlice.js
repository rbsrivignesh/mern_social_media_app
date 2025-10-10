import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name : "user",
    initialState : {
        userData : null,
        suggestedUsers : null,
        profileData : null,
        following : [],
        searchData : null,
        notificationData : []
    },
    reducers : {
        setUserData :(state,action)=>{
            state.userData = action.payload;
        },
        setProfileData :(state,action)=>{
            state.profileData = action.payload;
        },
        setSuggestedUsers :(state,action)=>{
            state.suggestedUsers = action.payload;
        },
        setFollowing : (state, action)=>{
            state.following = action.payload
        },
        setSearchData : (state, action)=>{
            state.searchData = action.payload
        },
        setNotifcationData : (state, action)=>{
            state.notificationData = action.payload
        },
        toggleFollow : (state, action)=>{
            const {targetUserId,data} = action.payload;
            // if(state.following?.includes(targetUserId)){
            //     state.following = state.following.filter(id => id != targetUserId);
             
                

            // }
            // else{
            //     state.following.push(targetUserId);
              
            
            // } 
            if(state.following.some(f => f._id == targetUserId)){
               state.following = state.following.filter(f => f._id != targetUserId);
            }
            else{
                // console.log(data);
state.following.push(data)
            }
        }
    }
})

export const {setUserData,setSuggestedUsers,setProfileData,setFollowing,toggleFollow,setSearchData,setNotifcationData} = userSlice.actions;

export default userSlice.reducer;