import { useDispatch } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { addError } from "../redux/errorSlice";
import axios from "axios";
import { removeFeedHavingId } from "../redux/feedSlice";

const UserCard = ({ user }) => {
    const dispatch = useDispatch();
    if (!user) return;
    const { _id ,firstName, lastName, photoURL, age, about, gender, skills } = user;
    
    const handleClick = async(_id,status)=>{
        try{
            await axios.post(BASE_URL+"/request/send/"+status+"/"+_id , {} , {withCredentials:true});
            dispatch(removeFeedHavingId(_id));
        }catch(err){
            dispatch(addError(err.response.data));
        }
    }

    return (
        <>
            <div className="card bg-base-300 my-4 w-96 shadow-sm">
                <figure>
                    <img
                        src={photoURL}
                        alt="Shoes" />
                </figure>
                <div className="card-body">
                    <h2 className="card-title">{firstName} {lastName}</h2>
                    <h3>
                        {age&&<span>{age}y </span>}
                        <span>{gender}</span>
                    </h3>
                    <div className="flex flex-row gap-3">
                        <h3 className="badge badge-secondary shrink-0">skills : </h3>
                        <ul className="flex flex-wrap gap-2">{skills.map(skill => {
                            return <li key={skill} className="badge badge-accent">{skill} </li>
                        })}
                        </ul>
                    </div>
                    <p>{about}</p>
                    <div className="card-actions justify-between">
                        <button className="btn btn-secondary"
                        onClick={()=>{handleClick(_id,"ignored")}}
                        >Ignore</button>
                        <button className="btn btn-primary"
                        onClick={()=>{handleClick(_id,"interested")}}
                        >Interested</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UserCard;