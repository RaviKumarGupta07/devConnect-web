import { configureStore } from "@reduxjs/toolkit";
import userReducer  from "./userSlice";
import feedReducer from "./feedSlice";
import connectionsReducer from "./connectionsSlice";
import errorReducer from "./errorSlice";
import requestsReducer from "./requestsSlice";

const appStore = configureStore({
    reducer :{
        // name(portion) : reducer
        user : userReducer,
        feed : feedReducer ,
        connections : connectionsReducer ,
        error : errorReducer ,
        requests : requestsReducer ,
    }
})

export default appStore ;