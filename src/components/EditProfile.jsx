import { useState } from "react";
import PreviewUserCard from "./PreviewUserCard";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../redux/userSlice";
const EditProfile = ({ user }) => {
    const [firstName, setFirstName] = useState(user?.firstName);
    const [lastName, setLastName] = useState(user?.lastName);
    const [about, setAbout] = useState(user?.about);
    const [photoURL, setPhotoURL] = useState(user?.photoURL);
    const [skills, setSkills] = useState(user?.skills);
    const [age, setAge] = useState(user?.age);
    const [gender, setGender] = useState(user?.gender);
    const [error, setError] = useState("");
    const [showToast, setShowToast] = useState(false);

    const dispatch = useDispatch();

    const handleClick = async () => {
        try {
            if (firstName.trim() === "") return setError("first name can't be empty");
            if (lastName.trim() === "") return setError("last name can't be empty");
            const res = await axios.patch(BASE_URL + "/profileEdit",
                { firstName, lastName, age, gender, skills, about, photoURL },
                { withCredentials: true },
            )
            setError("");
            dispatch(addUser(res?.data?.updatedProfile));
            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);
            }, 3000)
        } catch (err) {
            setError(err.response.data);
        }
    }

    return (user && (
        <div className="flex flex-row justify-center gap-4">
            {showToast && (<div className="toast toast-top toast-center z-10">
                <div className="alert alert-success">
                    <span>Dear {firstName} , your profile updated successfully</span>
                </div>
            </div>)}
            <div className="flex justify-center p-2 m-2">
                <fieldset className="fieldset bg-base-300 border-base-300 rounded-box w-96 border p-8 pb-12">
                    <div className="text-xl font-semibold "> Profile </div>

                    <label className="label">first name</label>
                    <input type="text" value={firstName} className="input"
                        onChange={(e) => {
                            setFirstName(e.target.value);
                        }}
                    />

                    <label className="label">last name</label>
                    <input type="text" value={lastName} className="input"
                        onChange={(e) => {
                            setLastName(e.target.value);
                        }}
                    />

                    <label className="label">photoURL</label>
                    <input type="text" value={photoURL} className="input"
                        onChange={(e) => {
                            setPhotoURL(e.target.value);
                        }}
                    />

                    <label className="label">age</label>
                    <input type="text" value={age} className="input"
                        onChange={(e) => {
                            setAge(e.target.value);
                        }}
                    />

                    <label className="label">about</label>
                    <input type="text" value={about} className="input"
                        onChange={(e) => {
                            setAbout(e.target.value);
                        }}
                    />

                    <label className="label">gender</label>
                    <select defaultValue={gender} className="select select-secondary"
                        onChange={(e) => { setGender(e.target.value) }}>
                        <option disabled={true}>select your gender</option>
                        <option>male</option>
                        <option>female</option>
                        <option>other</option>
                    </select>

                    <label className="label">skills</label>
                    <input type="text" value={skills.join(" ")} className="input"
                        onChange={(e) => {
                            setSkills(e.target.value.split(" "));
                        }}
                    />

                    <button className="btn btn-neutral mt-4 bg-primary"
                        onClick={handleClick}
                    >Update Profile</button>
                    <p className="text-red-600">{error}</p>
                </fieldset>
            </div>
            <div>
                <PreviewUserCard user={{ firstName, lastName, age, gender, skills, about, photoURL }} />
            </div>
        </div>
    ))
}

export default EditProfile;