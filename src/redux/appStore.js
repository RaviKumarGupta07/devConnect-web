import { configureStore } from "@reduxjs/toolkit";

const appStore = configureStore({
    reducer :{
        // name(portion) : reducer
    }
})

export default appStore ;