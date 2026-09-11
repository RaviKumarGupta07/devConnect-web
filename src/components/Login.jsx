import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../redux/userSlice";
import { Navigate, useNavigate } from "react-router";
import { BASE_URL } from "../utils/constants";
import { FaEye } from "react-icons/fa";
import { IoEyeOff } from "react-icons/io5";
import validator from 'validator';

const Login = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [type, setType] = useState('password');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [isSignUpForm, setIsSignupForm] = useState(false);

    const user = useSelector(store => store.user);
    if (user && !isSignUpForm) return <Navigate to="/" />

    const handleSignupClick = async () => {
        try {
            if (firstName.trim() === "" || firstName.length < 3 || firstName.length > 20) throw new Error("first name must have atleast 3 character and maximum 20 characters");
            if (lastName && lastName.length > 20) throw new Error("lastname must have maximum 20 characters");
            if (!validator.isEmail(email)) throw new Error("email is not valid , please write a valid email");
            if (!validator.isStrongPassword(password)) throw new Error("please enter a strong password hanving => minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1")

            const res = await axios.post(BASE_URL + "/signup", { firstName, lastName, emailId: email, password },
                { withCredentials: true })
            dispatch(addUser(res.data));
            setError("");
            navigate("/profile");
        } catch (err) {
            setError(err?.response?.data || err.message);
        }
    }

    const handleLoginClick = async () => {
        try {
            if (email.trim() === "") return setError("Email cannot be empty");
            if (password.trim() === "") return setError("password cannot be empty");
            const res = await axios.post(BASE_URL + "/login", {
                emailId: email,
                password: password
            }, { withCredentials: true, })

            dispatch(addUser(res.data));
            navigate("/");

        } catch (err) {
            setError(err?.response?.data);
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
        <div className="flex justify-center my-12" >
            <fieldset className="fieldset bg-base-300 border-base-300 rounded-box w-xs border p-8 pb-12">
                <div className="text-xl font-semibold mb-4 p-2 "
                > {isSignUpForm ? "Signup" : "Login"} </div>

                {isSignUpForm && (<>
                    <label className="label">First Name*</label>
                    <input type="text" value={firstName} className="input"
                        onChange={(e) => {
                            setFirstName(e.target.value);
                        }}
                    />

                    <label className="label">Last Name</label>
                    <input type="text" value={lastName} className="input"
                        onChange={(e) => {
                            setLastName(e.target.value);
                        }}
                    />
                </>)}

                <label className="label">Email*</label>
                <input type="email" value={email} className="input"
                    onChange={(e) => {
                        setEmail(e.target.value);
                    }}
                />

                <label className="label">Password*</label>
                <div className="relative">
                    <input
                        type={type}
                        name="password"
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
                    onClick={isSignUpForm ? handleSignupClick : handleLoginClick}
                >{isSignUpForm ? "Signup" : "Login"}</button>

                <p className="text-red-600">{error}</p>

                <p className="cursor-pointer to-primary-content underline mt-2"
                    onClick={() => { setIsSignupForm(!isSignUpForm) }}
                >{isSignUpForm ? "Already have an account ? login now " : "Dont have any account ? signup now"}</p>
            </fieldset>
        </div>
    )
}

export default Login;