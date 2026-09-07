import { useSelector } from "react-redux";
import { Navigate } from "react-router";
import EditProfile from "./EditProfile";

const Profile = ()=>{
    const user = useSelector(store=>store.user);
    if(!user) return <Navigate to="/" />;
    return(
        <div>
            <EditProfile user={user}/>
        </div>
    )
}
export default Profile ;