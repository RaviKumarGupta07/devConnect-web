import { Outlet } from "react-router";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import {useDispatch} from "react-redux";
import {addUser} from "../redux/userSlice";

const Body = () => {
    const user = useSelector(store => store.user);
    const dispatch = useDispatch();

    const fetchUser = async () => {
        if (user) return;
        const res = await axios.get(BASE_URL+"/profile",{withCredentials:true});
        dispatch(addUser(res.data));
        console.log(res.data);
    }
    useEffect(() => {
        fetchUser();
    }, [])
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}

export default Body;