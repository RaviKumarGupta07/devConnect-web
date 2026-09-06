# devConnect

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
- FRONTEND : whenever you are making API call so pass with {withCredentials : true}
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