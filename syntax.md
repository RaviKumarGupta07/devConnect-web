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

While making an Axios request, always handle errors using **try...catch**  using **async/await**

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

# deployment 

## AWS Setup
- first **create an account** in aws
- launch an ec2 instance => then it will show a page where you will find these
    - Application and OS images
        - it will ask you to select OS you want to use in your remote machine
            - (ie.amazon linux , ubuntu(in my case))
    - Istance Type  <= (leave it as by default it was)
        - t2 micro - free tier
    - key pair(login)
    - ![img](screenshots\key-pair-aws1.png)
    - this will download a file in your browser download ie. "APP-key.pem" file
        - this APP-key.pem file will be used as a key to access your server
    - then launch your instance (inside summary section see img for reference)
    - after 1-2 min it will create an instance
        ![instance](screenshots\instance-page-aws2.png)
    - click on ****Connect**** for connecting this remote machine through our system 
        - we will use ssh client (bcz we will connect our remote machine through our local system)
        - select **ssh client**
            - ![img](screenshots\sshclient-connectaws3.png)

## how will you login this remote machine in your terminal

1. Go to the folder containing your .pem file. For example:

        cd C:\Users\Ravi\Downloads

    - cd = Change Directory — moves you into the specified folder.

2. Remove inherited permissions

        icacls "APP-secret.pem" /inheritance:r

    - icacls = Windows access control list command.
    - "APP-secret.pem" = your private key file.
    - /inheritance:r = removes inherited permissions from the file.

3. Give only your Windows user read permission

        icacls "APP-secret.pem" /grant:r "$($env:USERNAME):(R)"

    - /grant:r = grant permission and replace existing permissions for that user.
    - $env:USERNAME = your current Windows username.
    - (R) = Read permission.

#### Note for ***linux and mac*** you will **skip step 2 and step3** and do paste this 
- Set the .pem permission

        chmod 400 APP-secret.pem

    - chmod = Change Mode — changes file permissions.
    - 400 means:
        - 4 → owner can read
        - 0 → group has no permissions
        - 0 → everyone else has no permissions
- go to step 4
4. Then connect to your AWS EC2 instance

        ssh -i "APP-secret.pem" ubuntu@13.60.99.134

    - ssh = Secure Shell, used to connect to your EC2 server.
    - -i = identity file, specifies your .pem private key.
    - ubuntu = the EC2 username.
    - 13.60.99.134 = your EC2 public IP.
 
- ![powershell](screenshots\connect-powershell-aws4.png)

#### If you have connected to your AWS EC2 Ubuntu server, the next step is usually to allow port 80 (HTTP) in the EC2 Security Group.

![img](screenshots\aws4.png)
    
- 0.0.0.0/0 means allow connections from any IPv4 address.
- If your EC2 public IP is: 13.60.99.134
          
        http://13.60.99.134
        // Note:Use http://, NOT https:// unless you've configured SSL/HTTPS.

###  If your remote machine disconnected or logged out from your system
- first connect with your remote machine
    - open your terminal (ie. windows powershell in your local system)
    - go to downloads folder
    - this ssh -i command you will get from: aws > ec2 instance > connect > ssh client

            PS C:\Users\Ravi> cd downloads
            PS C:\Users\Ravi\downloads> ssh -i "APP-secret.pem" ubuntu@YOUR_SERVER_IP
            ubuntu@ip-111-11-11-111:~$

## installing nvm (node version manager ) and node
- to run your project on remote machine you have to install the nvm and node in your remote machine 

        # Download and install nvm:
        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.7/install.sh | bash
        
        # in lieu of restarting the shell
        \. "$HOME/.nvm/nvm.sh"
        
        # Download and install Node.js:
        nvm install 24
        
        # Verify the Node.js version:
        node -v # Should print "v24.21.0".
        
        # Verify npm version:
        npm -v # Should print "11.19.0".


## how will you bring your project into remote machine-
- I will do it by cloning the repo 

- clone your repo in this remote machine
    - and npm install , and npm run build

            git clone https:://githubRepoURL

    - change directory to your frontend , ie.

            cd devConnect-frontend
            
    - then install dependencies
            
            npm install

    - then bundle your project(in my case frontend react-vite)
            
            npm run build
            // this will give you a dist folder which we will paste into nginx http server
now your project is successfull brought in your local machine

## Installing NGINX and Getting It Run
- The first step was to install NGINX. Since I was using an AWS EC2 instance running Ubuntu, I connected to my server using SSH and ran the following commands:

        sudo apt update
        sudo apt install nginx -y

- Once the installation was complete, I started the NGINX service:

        sudo systemctl start nginx

- To ensure NGINX would start automatically whenever the server rebooted, I also enabled it:

        sudo systemctl enable nginx

- go to /var/www/html/ 
    - this is the place where we will run aur app 

        
            cd /var/www/html/
    - you will see like

            ubuntu@ip-111-11-11-111:~$ cd /var/www/html/
            ubuntu@ip-111-11-11-111:/var/www/html$ ls
            index.nginx-debian.html
        

## pasting your frontend into nginx server
    
    ubuntu@ip-111-11-11-111:~$

- change directory to devConnect-web 
        
        ubuntu@ip-111-11-11-111:~$ cd devConnect-web

- secure copy recursively dist (and every files and folder inside dist ) and paste at the directory /var/www/html/
        
        sudo scp -r dist/* /var/www/html/
        
    ie. ubuntu@ip-111-11-11-111:~/devConnect-web$ sudo scp -r dist/* /var/www/html/

- If you want you can check , ie.
    
            ubuntu@ip-111-11-11-111:~/devConnect-web$ cd /var/www/html
            ubuntu@ip-111-11-11-111:/var/www/html$ ls
            assets  index.html  index.nginx-debian.html

- you can find your public ip address of your local system from here (also you can get from **aws > instance**)

        ubuntu@ip-111-11-11-111:/var/www/html$ curl ifconfig.me
        13.60.99.134

- run this on the browser you will see your app running 😍

        http://13.60.99.134
-  **Note** : Use http://, NOT https:// unless you've configured SSL/HTTPS.



## Backend deployment
    - 