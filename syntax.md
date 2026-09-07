## joining array elements based on delemeter by array.join(" ") method
    const skills = ["c++","py","js"];
    console.log(skills.join(" ")); // c++ py js

## converting text (string) to array based on delemeter using str.split(" ") method
    const skills = ["c++", "py", "js"];
    console.log(skills) // [ 'c++', 'py', 'js' ]
    console.log(skills.join(" ")); // c++ py js
    console.log(skills.join(" ").split(" ")) // [ 'c++', 'py', 'js' ]

## axios syntax
### Most important instruction

While making an Axios request, always handle errors using **try...catch** when using **async/await**

    //ie.
    try{
        const res = await axios.get(BASE_URL + "/profile", 
        { withCredentials: true });
        console.log(res.data);
    }catch(err){
        // Useful properties:
        console.log(err.response); // object
        console.log(err.response.status);
        console.log(err.response.data);
    }

### syntax
    POST
    axios.post(url, data, config)

    PUT
    axios.put(url, data, config)

    PATCH
    axios.patch(url, data, config)

    DELETE
    axios.delete(url, config)

-  get

        const res = await axios.get(BASE_URL + "/profile", 
        { withCredentials: true });
        console.log(res.data);

- post 

        const res = await axios.post(BASE_URL ,{
            // payload body
            emailId: email,
            password: password
        },{
            withCredentials: true,
        })

        // or both will work same

        const res = await axios({
                    method: "post",
                    url: BASE_URL + "/login",
                    data: {
                        emailId: email,
                        password: password
                    },
                    withCredentials: true,
                });
        console.log(res.data);

## cors syntax
- first install npm cors package

        $ npm i cors
- import it

        const cors = require("cors");
- then add app.use(cors()) middleware

        app.use(cors({
        origin:"http://localhost:5173",
        credentials:true,
        }));
- You can pass additional options such as allowed HTTP methods:

        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],

## toast show feature

    <!-- ie.  -->
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

            setShowToast(true); // assign showToast=true
            setTimeout(() => { // after 3 sec , call back func executes
                setShowToast(false);
            }, 3000)

        } catch (err) {
            setError(err.response.data);
        }
    }
    ........some code......
    ........some code......
    // jsx part
    return(
        {showToast && (<div className="toast toast-top toast-center z-10">
                <div className="alert alert-success">
                    <span>Dear {firstName} , your profile updated successfully</span>
                </div>
            </div>)}
    )