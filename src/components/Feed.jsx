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

    return (feed && (
        <div className="flex justify-center mt-8">
            <UserCard user={feed[1]} />
        </div>
    ))
}
export default Feed;