import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../redux/connectionsSlice";

const Connections = () => {
    const dispatch = useDispatch();
    const connections = useSelector(store => store.connections);

    const fetchConnections = async () => {
        try {
            const res = await axios.get(BASE_URL + "/user/connections", { withCredentials: true });
            dispatch(addConnections(res?.data));
        } catch (err) {
            console.error(err?.response);
        }
    }
    useEffect(() => {
        fetchConnections();
    }, []);

    if (!connections) return;
    if (connections.length === 0) return (<h1 className="flex my-4 text-2xl fnt-bold justify-center"> No connection found </h1>)
    

    return (
        <div className="">
            <div className="text-3xl font-semibold justify-center flex my-4">Connections</div>
            <div className="w-1/2 m-auto my-2 flex flex-col gap-2">
                {connections.map(user => {
                    const {_id,firstName,lastName,age,gender,about,skills,photoURL} = user ;
                    return (
                        <div className="flex bg-base-300 rounded-2xl " key={_id}>
                            {/* img */}
                            <div className="shrink-0">
                                <img src={photoURL} alt="user-img" className="w-48 h-48 object-cover p-2 rounded-3xl" />
                            </div>
                            {/* details */}
                            <div className="p-2 flex-1">
                                <h2 className="text-xl font-bold">{firstName + " " + lastName}</h2>
                                {age&&gender&&<h3> {age + "y " + gender } </h3>}
                                {about&&<p>{about}</p>}
                                {skills&&(skills.length>0)&&<div className="flex">
                                        <h4 className="bg-primary badge mr-2">{"skills"+" : "}</h4>
                                        <p className="badge bg-secondary overflow-x-auto"> {skills.join(" , ")} </p>
                                    </div>}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
export default Connections;