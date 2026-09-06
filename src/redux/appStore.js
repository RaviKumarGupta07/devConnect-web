import { configureStore } from "@reduxjs/toolkit";
import userReducer  from "./userSlice"

const appStore = configureStore({
    reducer :{
        // name(portion) : reducer
        user : userReducer,
    }
})

export default appStore ;