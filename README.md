## 1

- Created a Vite + React application.
- Removed unnecessary code and created a Hello World application.
- Installed Tailwind CSS.
- Installed DaisyUI.
- Added the `Navbar` component to `App.jsx`.
- Created a separate `Navbar` component file.
- Installed `react-router-dom`.
- Created `BrowserRouter > Routes > Route`, i.e.:

      <Route path="/" element={<Body />} />

- Created an `Outlet` in the component.
- Created a custom `Footer` component using DaisyUI.


## 2

- Created a Login page using DaisyUI.
- Installed Axios.

### BACKEND — CORS

- Installed CORS in the backend.
- Added CORS middleware with the following configuration:

      origin: "http://localhost:5173",
      credentials: true

### FRONTEND — API Calls

- Whenever making an API call, pass:

      { withCredentials: true }

- This allows the browser to store the cookie for HTTP URLs in our case.
- **GYAN:** In production, our requests will be over HTTPS, so the cookie will be stored after login automatically.

### Redux Toolkit

- Installed Redux Toolkit and set it up:
    - Configured the store.
    - Provided the store to the root-level component.
    - Created `userSlice`.
    - Added the reducer to the Store.
    - Added Redux DevTools in Chrome (if not already installed).

- Logged in and checked whether the user data was coming properly into the Redux store.
- Navbar should update as soon as the user logs in.
- Refactored the code:
    - Added a constants file.
    - Created a `components` folder.


## 3

- Users should not be able to access other routes without login.

      if (!user) return;

- If the token is not present, redirect the user to the login page.

### Approach

- When making a `/profile` request, it will automatically give an error response with status `401`.
- Use that `401` status:

      catch (err) {
          if (err?.response?.status === 401) {
              return navigate("/login");
          }
      }

- Made an `axios.get` request for the user Feed and added the feed to the store.

### UserCard

- Built `UserCard.jsx`.
- For now:

      <UserCard user={feed[0]} />

- We will add some features later.

### Profile Page

- Built the Profile page.
- Profile page has:
    - `<EditProfile />`
- The `EditProfile` component:
    - Has the feature of editing the user profile.
    - Shows a preview `UserCard` along with profile editing.
- When the user clicks **Update Profile**, an `axios.patch` request is made.

- After saving the profile, it shows a toast:

      Dear {firstName}, your profile updated successfully

- Gender is a dropdown in the editing form.


## 4

### Connections Page

- Created the Connections page.
- Created a card like this:

      [Image + Details]

### Requests Page

- Created the Requests page.
- Created a card like this:

      [Image + Details + Accept/Reject Buttons]

- Built the **Accept / Reject** button handler function.
    - Made an API call to handle this.
- Also updated the Redux store after sending the request.

      removeRequestHaving_id: (state, action) => {
          const newArr = state.filter(
              request => request.fromUserId._id !== action.payload
          );
          return newArr;
      },

### Feed Page

- Built the **Ignore / Interested** button handler function.
    - Made an API call to handle this.
- Also updated the Redux store after sending the request.

      removeFeedHavingId: (state, action) => {
          const newArr = state.filter(
              feed => feed._id !== action.payload
          );
          return newArr;
      }


## 5

- Built the Signup form by converting the Login form into a Signup form.

### BACKEND

When a user signs up:

- Generate a token.
- Send that token as `res.cookies`.
- Send the saved user in the response.

- After the user signs up, navigate the user to:

      /profile


# AWS Deployment

- First, created an AWS account.
- Launched an EC2 instance.

### For Mac or Linux

      chmod 400 APP-secret.pem

### For Windows

      icacls "APP-secret.pem" /inheritance:r

      icacls "APP-secret.pem" /grant:r "$($env:USERNAME):(R)"

### Connect to EC2

      ssh -i "APP-secret.pem" ubuntu@13.60.99.134

- Installed NVM (Node Version Manager) and Node.js.


## Frontend Deployment

- Clone the repository:

      git clone https://githubRepoURL

- Navigate to the frontend folder.

- Install dependencies:

      npm install

- Create the production build:

      npm run build

- Update packages:

      sudo apt update

- Install Nginx:

      sudo apt install nginx -y

- Start Nginx:

      sudo systemctl start nginx

- Enable Nginx:

      sudo systemctl enable nginx

- Copy the frontend build to the Nginx directory:

      sudo scp -r dist/* /var/www/html/

- Enable **Port 80** of your EC2 instance.


## Backend Deployment

- Clone the repository:

      git clone https://githubRepoURL

- Navigate to the backend folder:

      cd DevConnect-backend

- Install dependencies:

      npm install

- Start the backend:

      npm start

- Install PM2 globally:

      npm install pm2 -g

- Start the backend using PM2:

      pm2 start npm --name DevTinder-backend -- start

- Check PM2 status:

      pm2 status


## NGINX

- Open the Nginx configuration:

      sudo nano /etc/nginx/sites-available/default

- Add:

      location /api/ {
          proxy_pass http://localhost:7777/;
      }

- Test the Nginx configuration:

      sudo nginx -t

- Reload Nginx:

      sudo systemctl reload nginx


# Live Chat Feature

- Built `Chat.jsx`.

### Frontend

- Installed and set up the `socket.io-client` npm package.
- Added:
    - Chat heading.
    - Chats.
    - New message alert popup for 3 seconds.
    - `<input>`.
    - Send button.

### Backend

- Installed and set up the `socket.io` npm package.
- Added:
    - Event emitting and handling logic.
    - Created the Chat model.
    - When the `messageSend` event is emitted, chats are saved inside the database.
    - Created `GET /chats/:receiverId` API to get all the chats of the user.

- The complete setup is inside:

      socketIo_setup_guide.md


# Added `.env` File in Remote Machine

- Opened the backend folder in the remote machine.
- Ran:

      nano .env

- This creates a new `.env` file at the root of the backend folder.
- Paste all your environment variables into the `.env` file.


# NGINX Path Configuration

- Open the AWS remote machine server.
- Open the Nginx configuration:

      sudo nano /etc/nginx/sites-available/default

- Updated the code so that all routes are handled:

      location /api/ {
          proxy_pass http://localhost:7777/;
          proxy_set_header Host $host;
          proxy_set_header X-Real-IP $remote_addr;
          proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
          proxy_set_header X-Forwarded-Proto $scheme;
      }

      location / {
          try_files $uri $uri/ /index.html;
      }

- Test the Nginx configuration:

      sudo nginx -t

- Reload the Nginx server:

      sudo systemctl reload nginx