import { createSlice } from "@reduxjs/toolkit";

const errorSlice = createSlice({
    name:"error",
    initialState:null,
    reducers :{
        addError:(state,action)=>{
            return action.payload;
        },
        removeError:()=>null,
    }
})

export const {addError,removeError} = errorSlice.actions;
export default errorSlice.reducer;