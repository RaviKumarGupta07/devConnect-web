import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
    name:"feed",
    initialState:null,
    reducers:{
        addFeed:(state,action)=>{
            return action.payload ;
        },
        clearFeed :()=>{
            return null;
        },
        removeFeedHavingId:(state,action)=>{
            const newArr = state.filter(feed=>feed._id!==action.payload);
            return newArr ;
        }
    }
})

export const {addFeed , clearFeed,removeFeedHavingId} = feedSlice.actions;
export default feedSlice.reducer;