import { createSlice } from "@reduxjs/toolkit";

const connectionsSlice = createSlice({
    name: "connections",
    initialState: null,
    reducers: {
        addConnections: (state, action) => {
            return action.payload;
        },
        clearConnections: () => null,
    }
});

export const { addConnections, clearConnections } = connectionsSlice.actions;
export default connectionsSlice.reducer;