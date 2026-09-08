import { useDispatch, useSelector } from "react-redux";
import { addError, removeError } from "../redux/errorSlice";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect } from "react";
import { addRequests, removeRequestHaving_id } from "../redux/requestsSlice";

const Requests = () => {
    const dispatch = useDispatch();
    const requests = useSelector(store => store.requests);

    const handleClick = async (status, _id) => {
        try {
            await axios.post(BASE_URL + "/request/review/" + status + "/" + _id, {}, { withCredentials: true });
            dispatch(removeRequestHaving_id(_id));
            dispatch(removeError());
        } catch (err) {
            dispatch(addError(err.response.data));
        }
    }

    const fetchRequests = async () => {
        try {
            const res = await axios.get(BASE_URL + "/user/recievedRequests", {
                withCredentials: true,
            },);
            dispatch(removeError());
            dispatch(addRequests(res.data));
        } catch (err) {
            dispatch(addError(err?.response?.data));
        }
    }
    useEffect(() => {
        fetchRequests();
    }, [])

    if (!requests) return;
    if (requests.length === 0) return (<h1 className="flex my-4 text-2xl fnt-bold justify-center">No Request Found</h1>)

    return (
        <div className="">
            <div className="text-3xl font-semibold justify-center flex my-4">Received Requests</div>
            <div className="w-1/2 m-auto my-2 flex flex-col gap-2">
                {requests.map(request => {
                    const { _id, firstName, lastName, age, gender, about, skills, photoURL } = request.fromUserId;
                    return (
                        <div className="flex bg-base-300 rounded-2xl gap-6 p-2 items-center" key={_id}>
                            {/* img */}
                            <div className="shrink-0">
                                <img src={photoURL} alt="user-img" className="w-48 h-48 object-cover p-2 rounded-3xl" />
                            </div>

                            {/* details */}
                            <div className="p-2 flex flex-1 flex-col text-left">
                                <h2 className="text-xl font-bold">{firstName + " " + lastName}</h2>
                                {age && gender && <h3> {age + "y " + gender} </h3>}
                                {about && <p>{about}</p>}
                                {skills && (skills.length > 0) && <div className="flex">
                                    <h4 className="bg-primary badge mr-2">{"skills" + " : "}</h4>
                                    <p className="badge bg-secondary overflow-x-auto"> {skills.join(" , ")} </p>
                                </div>}
                            </div>

                            {/* buttons */}
                            <div className="flex flex-col mr-2">
                                <button className="btn btn-neutral mt-4 bg-primary"
                                    onClick={() => { handleClick("accepted",_id) }}
                                >accept</button>
                                <button className="btn btn-neutral mt-4 bg-secondary"
                                    onClick={()=>{handleClick("rejected",_id)}}
                                >reject</button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
export default Requests;