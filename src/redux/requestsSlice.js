import { createSlice } from "@reduxjs/toolkit";

const requestsSlice = createSlice({
    name: "requests",
    initialState: null,
    reducers:{
        addRequests : (state,action) => action.payload ,
        removeAllRequests: ()=>null,
        removeRequestHaving_id:(state,action)=>{
            const newArr = state.filter(request=>request.fromUserId._id!==action.payload);
            return newArr;
        },
    }
})

export const {addRequests ,removeAllRequests,removeRequestHaving_id} = requestsSlice.actions ;
export default requestsSlice.reducer ;