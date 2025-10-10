import {configureStore} from '@reduxjs/toolkit';
import userSlice from './userSlice';
import loopSlice from './loopSlice'
import storySlice from './storySlice'
import postSlice from './postSlice'
import messageSlice from './messageSlice'
import socketSlice from './socketSlice'
const store = configureStore({
    reducer: {
        user: userSlice,
        post: postSlice,
        loop: loopSlice,
        story: storySlice,
        message: messageSlice,
        socket:socketSlice
    }
});

export default store;