import axios from "axios";
import { useState } from "react";
import {useDispatch} from "react-redux";
import {addUser} from "../redux/userSlice";
import {useNavigate} from "react-router";
import {BASE_URL} from "../utils/constants"

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleClick = async () => {
        try {
            const res = await axios({
                method: "post",
                url: BASE_URL+"/login",
                data: {
                    emailId: email,
                    password: password
                },
                withCredentials:true,
            });
            dispatch(addUser(res.data));
            navigate("/");

        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="flex justify-center mt-12" >
            <fieldset className="fieldset bg-base-300 border-base-300 rounded-box w-xs border p-8 pb-12">
                <div className="text-xl font-semibold"> Login </div>

                <label className="label">Email</label>
                <input type="email" value={email} className="input" placeholder="Email"
                    onChange={(e) => {
                        setEmail(e.target.value);
                    }}
                />

                <label className="label">Password</label>
                <input type="password" value={password} className="input" placeholder="Password"
                    onChange={(e) => {
                        setPassword(e.target.value);
                    }}
                />

                <button className="btn btn-neutral mt-4 bg-primary"
                    onClick={handleClick}
                >Login</button>
            </fieldset>
        </div>
    )
}

export default Login;