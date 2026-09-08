import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { addFeed } from "../redux/feedSlice";
import UserCard from "./UserCard";

const Feed = () => {
    const feed = useSelector(store => store.feed);
    const dispatch = useDispatch();

    const fetchUserFeed = async () => {
        if (feed) return;
        try {
            const res = await axios.get(BASE_URL + '/user/feed', { withCredentials: true });
            dispatch(addFeed(res?.data?.data));
        } catch (err) {
            console.error(err.response);
        }
    }

    useEffect(() => {
        fetchUserFeed();
    }, [])

    if(!feed) return;
    if(feed.length===0) return (<h1 className="flex justify-center text-3xl font-semibold my-8">No User Found</h1>)

    return (feed && (
        <div className="flex justify-center mt-8">
            <UserCard user={feed[0]} />
        </div>
    ))
}
export default Feed;