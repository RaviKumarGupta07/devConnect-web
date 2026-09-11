
## 1
- created a vite + react application
- removed unnecessary code and created hello world
- installed tailwindcss
- then daisy ui
- add NavBar component to App.jsx
- created a Navbar separate component file
- install react-router-dom
- created BrowserRouter > Routes > Route ie. <Route path="/" element={<Body/>}>
- created an outlet in your component
- created your own foooter componnent(using daisy ui)

## 2
- created a login page (using daisy UI)
- install axios
- BACKEND : CORS - install CORS in backend => add middleware with configurations => 
        
        - origin :"http://localhost:5173" , credentials:true
- FRONTEND : whenever you are making API call so pass with 
        
        {withCredentials : true}

    - it will allow browser to store the cookie (for http url in our case)
    - GYAN : but in production our requests will be in https so cookie will be stored after login automatically  
- install redux toolkit then setup => 
    - configured store 
    - provided the store to your root level component
    - created userSlice
    - added reducer to Store
    - added redux devtools in chrome (if not)
- login and see if your data is coming properly in the store or not 
- Navbar should update as soon as user logs in
- refactor our code to add constants file + create a components/folder

## 3
- you should not be access other routes without login (simple : if(!user) return )
- if token is not present redirect user to login
    - approach - when you will make /profile req it will automatically give you error response and status(401)
    - use that status(401) :

            catch(err){
                if(err?.response?.status === 401){
                    return navigate("/login");
            }}

- made axios.get request for user Feed and add the feed in the store
- built the **UserCard.jsx**
    - for now lets make **< UserCard user={feed[0]}/>**
    - we will add some features later
- then we built profile page
    - profile page have 
        - < EditProfile/> 
        - this EditProfile component has feature of editing user profile as well as it shows preview User card along with profile editing
        - when user clicks update profile , axios.patch request is made
- after save profile it shows toast : 
    - toast message : **Dear {firstName} , your profile updated successfully**
- gender is dropdown in editing form

## 4
- connections page created
    - created card like this [img + details]
- requests page created
    - created card like this [img + details + buttons[accept/reject]]
    - built **accept / reject** button handle function
        - made an api call to handle this
    - also updated our redux store after sending reques

            removeRequestHaving_id:(state,action)=>{
                const newArr = state.filter(request=>request.fromUserId._id!==action.payload);
                return newArr;
            },

- feed page 
    - built **ignore / interested** button handle function
        - made an api call to handle this
    - also updated our redux store after sending reques
    
            removeFeedHavingId:(state,action)=>{
                const newArr = state.filter(feed=>feed._id!==action.payload);
                return newArr ;
            }

## 5
- built signup form (converting the login form into signup form)
- Backend : when user signs up then 
    - generate a token
    - send that token as res.cookies
    - send the saved user in response
- after user signs up navigate user to "/profile" path

## aws deployment
- first we created an account on aws
- launched instance
- for mac or linux
    -   chmod 400 APP-secret.pem
- for windows 
    -  icacls "APP-secret.pem" /inheritance:r
    -  icacls "APP-secret.pem" /grant:r "$($env:USERNAME):(R)"
-  ssh -i "APP-secret.pem" ubuntu@13.60.99.134
- installing nvm (node version manager ) and node
-   git clone https:://githubRepoURL
    - frontend 
        - npm install
        - npm run build
        -  sudo apt update
        -  sudo apt install nginx -y
        -  sudo systemctl start nginx
        -  sudo systemctl enable nginx
        -  sudo scp -r dist/* /var/www/html/
        - enable port 80 of your instance



