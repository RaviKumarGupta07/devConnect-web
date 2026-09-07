import Navbar from "./Navbar";
import Footer from "./Footer";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../redux/userSlice";
import {Outlet, useNavigate} from "react-router";

const Body = () => {
    const user = useSelector(store => store.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const fetchUser = async () => {
        try {
            if (user) return;
            const res = await axios.get(BASE_URL + "/profile", { withCredentials: true });
            dispatch(addUser(res.data));
        } catch (err) {
            if(err?.response?.status === 401){
                return navigate("/login");
            }
        }
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