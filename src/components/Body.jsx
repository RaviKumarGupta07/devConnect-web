import { Outlet } from "react-router";
import Navbar from "./Navbar";

const Body = () => {
    return (
        <>
            <Navbar />
            <Outlet/>
        </>
    )
}

export default Body;