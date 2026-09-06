import { useSelector } from "react-redux";
import { Navigate } from "react-router";

const Profile = ()=>{
    const user = useSelector(store=>store.user);
    if(!user) return <Navigate to="/" />;
    return(
        <div>
            profile
        </div>
    )
}
export default Profile ;