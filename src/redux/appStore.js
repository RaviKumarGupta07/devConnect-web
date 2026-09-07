import { configureStore } from "@reduxjs/toolkit";
import userReducer  from "./userSlice";
import feedReducer from "./feedSlice";

const appStore = configureStore({
    reducer :{
        // name(portion) : reducer
        user : userReducer,
        feed : feedReducer ,
    }
})

export default appStore ;