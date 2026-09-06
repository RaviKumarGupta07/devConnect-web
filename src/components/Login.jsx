import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../redux/userSlice";
import { Navigate, useNavigate } from "react-router";
import { BASE_URL } from "../utils/constants";
import { FaEye } from "react-icons/fa";
import { IoEyeOff } from "react-icons/io5";

const Login = () => {
    const [email, setEmail] = useState("ravi@gmail.com");
    const [password, setPassword] = useState("Ravi@1234");
    const [type, setType] = useState('password');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const user = useSelector(store=>store.user);
    if(user) return <Navigate to="/" />

    const handleClick = async () => {
        try {
            if (email.trim() === "") return setError("Email cannot be empty");
            if (password.trim() === "") return setError("password cannot be empty");
            const res = await axios({
                method: "post",
                url: BASE_URL + "/login",
                data: {
                    emailId: email,
                    password: password
                },
                withCredentials: true,
            });
            dispatch(addUser(res.data));
            navigate("/");

        } catch (err) {
            setError(err?.response?.data);
            console.log(err?.response?.data);
        }
    }


    const handleToggle = () => {
        if (type === 'password') {
            setType('text')
        } else {
            setType('password')
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
                <div className="relative">
                    <input
                        type={type}
                        name="password"
                        placeholder="Password"
                        value={password}
                        className="input pr-16"
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <span
                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                        onClick={handleToggle}
                    >
                        {type === "password" ? <FaEye /> : <IoEyeOff />}
                    </span>
                </div>

                <button className="btn btn-neutral mt-4 bg-primary"
                    onClick={handleClick}
                >Login</button>
                <p className="text-red-600">{error}</p>
            </fieldset>
        </div>
    )
}

export default Login;