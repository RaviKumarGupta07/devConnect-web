import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { removeUser } from "../redux/userSlice";
import { clearFeed } from "../redux/feedSlice";
import { clearConnections } from "../redux/connectionsSlice";

const Navbar = () => {
    const navigate = useNavigate();
    const user = useSelector((store) => store.user);
    const dispatch = useDispatch();
    // console.log(user);

    const handleLogout = async () => {
        try {
            await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
            dispatch(removeUser());
            dispatch(clearFeed());
            dispatch(clearConnections());
            navigate("/login");
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="navbar bg-base-300 shadow-sm pr-16">
            <div className="flex-1" >
                <a className="btn btn-ghost text-xl"
                    onClick={() => {
                        navigate("/")
                    }}
                >DevConnect</a>
            </div>
            {user && <div className="flex gap-2 items-center">

                <h1 className="mx-2">Hi , {user.firstName}</h1>
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full">
                            <img
                                alt="profile image"
                                src={user.photoURL} />
                        </div>
                    </div>
                    <ul
                        tabIndex={-1}
                        className="menu menu-sm dropdown-content bg-base-200 rounded-box z-1 mt-3 w-52 p-2 shadow">
                        <li>
                            <Link className="justify-between" to="/">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link className="justify-between" to="/profile">
                                Profile
                            </Link>
                        </li>
                        <li>
                            <Link className="justify-between" to="/connections">
                                connections
                            </Link>
                        </li>
                        <li>
                            <Link className="justify-between" to="/requests">
                                requests
                            </Link>
                        </li>

                        <li>
                            <span onClick={handleLogout}>Logout</span>
                        </li>
                    </ul>
                </div>
            </div>}
        </div>
    )
}
export default Navbar;