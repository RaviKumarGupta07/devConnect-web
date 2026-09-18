# Deployment

## 1. AWS Setup

### Create an AWS account

Create an account on AWS, then open:

**AWS → EC2 → Launch instance**

### Launch an EC2 instance

Choose:

-   **Name:** any name you want
-   **Application and OS Images:** Ubuntu
-   **Instance type:** `t2.micro` (if available in your AWS
    free-tier/eligibility)
-   **Key pair:** Create/select a key pair

![Key Pair](screenshots/key-pair-aws1.png)

The key pair downloads a `.pem` file, for example:

``` text
APP-secret.pem
```

**Keep this file safe.** It is used to SSH into your EC2 server.

Click **Launch instance**.

After the instance starts:

![EC2 Instance](screenshots/instance-page-aws2.png)

------------------------------------------------------------------------

## 2. Connect to EC2 Using SSH

Open **EC2 → Your Instance → Connect → SSH client**.

![SSH Client](screenshots/sshclient-connectaws3.png)

### Windows PowerShell

First go to the folder containing your `.pem` file:

``` powershell
cd C:\Users\Ravi\Downloads
```

`cd` = Change Directory.

Then fix the private-key permissions:

``` powershell
icacls "APP-secret.pem" /inheritance:r
icacls "APP-secret.pem" /grant:r "$($env:USERNAME):(R)"
```

-   `icacls` = Windows access-control command.
-   `/inheritance:r` = removes inherited permissions.
-   `/grant:r` = gives/replaces permissions for the specified user.
-   `$env:USERNAME` = your Windows username.
-   `(R)` = Read permission.

### Linux / macOS

Skip the Windows `icacls` commands and run:

``` bash
chmod 400 APP-secret.pem
```

-   `chmod` = Change Mode (file permissions).
-   `400` = owner can read; group and others have no permissions.

### SSH into EC2

Use the command shown in **EC2 → Connect → SSH client**:

``` bash
ssh -i "APP-secret.pem" ubuntu@YOUR_SERVER_IP
```

-   `ssh` = Secure Shell.
-   `-i` = specifies the identity/private-key file.
-   `ubuntu` = Ubuntu EC2 username.
-   `YOUR_SERVER_IP` = your EC2 public IPv4 address.

Example:

``` bash
ssh -i "APP-secret.pem" ubuntu@13.60.99.134
```

![PowerShell SSH](screenshots/connect-powershell-aws4.png)

------------------------------------------------------------------------

## 3. Allow HTTP Port 80

Go to:

**EC2 → Security Groups → Inbound rules → Edit inbound rules**

Add:

``` text
Type: HTTP
Port: 80
Source: 0.0.0.0/0
```

![Security Group](screenshots/aws4.png)

`0.0.0.0/0` = allows connections from any IPv4 address.

Then your frontend can be opened at:

``` text
http://YOUR_SERVER_IP
```

**Important:** use `http://`, not `https://`, unless you have configured
SSL/HTTPS.

------------------------------------------------------------------------

## 4. If SSH Disconnects

If your terminal is disconnected/logged out, connect again:

``` powershell
cd C:\Users\Ravi\Downloads
ssh -i "APP-secret.pem" ubuntu@YOUR_SERVER_IP
```

You do **not** need to create another EC2 instance.

------------------------------------------------------------------------

# Frontend Deployment

## 5. Install NVM and Node.js on EC2

You need Node.js to build/run your project.

### Install NVM

``` bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.7/install.sh | bash
```

`curl` downloads data from a URL; `-o-` sends the downloaded output to
the terminal, which is then passed to `bash`.

Load NVM without restarting the terminal:

``` bash
\. "$HOME/.nvm/nvm.sh"
```

Install Node.js:

``` bash
nvm install 24.12.2
```

Check versions:

``` bash
node -v
npm -v
```

-   `node -v` = Node.js version.
-   `npm -v` = npm version.

> If your project requires a different Node version, use that version
> instead of `24`.

------------------------------------------------------------------------

## 6. Clone Your Project

Clone your GitHub repository on the EC2 server:

``` bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
```

Then enter the project:

``` bash
cd YOUR_PROJECT_FOLDER
```

Install dependencies:

``` bash
npm install
```

For a React + Vite frontend, create the production build:

``` bash
npm run build
```

This creates:

``` text
dist/
```

The `dist` folder contains the production frontend files that NGINX will
serve.

------------------------------------------------------------------------

# NGINX

## 7. Install NGINX

On Ubuntu EC2:

``` bash
sudo apt update
sudo apt install nginx -y
```

-   `sudo` = run the command with administrator privileges.
-   `apt update` = refresh available package information.
-   `apt install nginx -y` = install NGINX and automatically answer yes.

Start NGINX:

``` bash
sudo systemctl start nginx
```

Enable it at system boot:

``` bash
sudo systemctl enable nginx
```

Check its status:

``` bash
sudo systemctl status nginx
```

NGINX's default web directory is:

``` text
/var/www/html/
```

You can check it with:

``` bash
cd /var/www/html
ls
```

You may initially see:

``` text
index.nginx-debian.html
```

------------------------------------------------------------------------

## 8. Copy the Frontend Build to NGINX

Go back to your frontend project:

``` bash
cd ~/devConnect-web
```

Copy everything inside `dist` into NGINX's web directory:

``` bash
sudo cp -r dist/* /var/www/html/
```

-   `cp` = Copy.
-   `-r` = recursively copy folders and their contents.
-   `sudo` = required because `/var/www/html` is owned/protected by the
    system.

Check:

``` bash
cd /var/www/html
ls
```

You should see something similar to:

``` text
assets
index.html
```

------------------------------------------------------------------------

## 9. Open Your Frontend

Find the EC2 public IP:

``` bash
curl ifconfig.me
```

Example:

``` text
13.60.99.134
```

Open:

``` text
http://13.60.99.134
```

Your React/Vite frontend should now load.

**Remember:** `http://` is correct unless SSL/HTTPS has been configured.

------------------------------------------------------------------------

# Backend Deployment

## 10. Clone the Backend

From your EC2 home directory:

``` bash
cd ~
git clone https://github.com/YOUR_USERNAME/YOUR_BACKEND_REPO.git
cd DevConnect-backend
```

`~` means your home directory, for example:

``` text
/home/ubuntu
```

So:

``` bash
cd ~/DevConnect-backend
```

works from anywhere and takes you directly to the backend folder.

Install dependencies:

``` bash
npm install
```

Make sure your `package.json` has a start script similar to:

``` json
"scripts": {
  "start": "node src/app.js"
}
```

Test the backend:

``` bash
npm start
```

If it starts successfully, you should see your database connection and
server running on your backend port, for example:

``` text
backend server started at port no 7777
```

Stop the manually running server with:

``` text
Ctrl + C
```

------------------------------------------------------------------------

# PM2

## 11. Run Backend Continuously with PM2

Install PM2:

``` bash
npm install pm2 -g
```

-   `npm install` = installs a package.
-   `pm2` = process manager for Node.js applications.
-   `-g` = installs it globally.

Start your backend:

``` bash
pm2 start npm --name DevTinder-backend -- start
```

**Important:** `-- start` passes `start` to npm.

Do **not** write:

``` bash
pm2 start npm --name DevTinder-backend -- save
```

`save` is not the npm script you want here. The correct command is:

``` bash
pm2 start npm --name DevTinder-backend -- start
```

Check PM2:

``` bash
pm2 status
```

View logs:

``` bash
pm2 logs DevTinder-backend
```

Exit the live log view with:

``` text
Ctrl + C
```

Useful commands:

``` bash
pm2 restart DevTinder-backend
pm2 stop DevTinder-backend
pm2 delete DevTinder-backend
pm2 status
```

------------------------------------------------------------------------

## 12. Make PM2 Start After Server Reboot

Run:

``` bash
pm2 startup
```

PM2 will print another command.

**Copy and run the exact command PM2 prints.**

Then run:

``` bash
pm2 save
```

This saves the current PM2 process list.

------------------------------------------------------------------------

# NGINX Reverse Proxy for Backend

## 13. Why NGINX Proxy Is Needed

Without NGINX, your backend can be accessed directly using its port:

``` text
http://YOUR_SERVER_IP:7777/user/feed
```

With NGINX, the browser can use:

``` text
http://YOUR_SERVER_IP/api/user/feed
```

The flow becomes:

``` text
Browser
   ↓
NGINX :80
   ↓
Node/Express :7777
```

------------------------------------------------------------------------

## 14. Configure NGINX

Open the default NGINX configuration:

``` bash
sudo nano /etc/nginx/sites-available/default
```

Inside the `server { ... }` block, add:

``` nginx
location /api/ {
    proxy_pass http://localhost:7777/;

    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

### Important

Keep the `/` at the end of:

``` nginx
proxy_pass http://localhost:7777/;
```

This makes:

``` text
/api/user/feed
```

forward to:

``` text
/user/feed
```

on your Node/Express backend.

Save in nano:

``` text
Ctrl + O
Enter
Ctrl + X
```

------------------------------------------------------------------------

## 15. Test and Reload NGINX

Always test the configuration first:

``` bash
sudo nginx -t
```

If successful, reload:

``` bash
sudo systemctl reload nginx
```

If systemd asks for a daemon reload because the unit file changed:

``` bash
sudo systemctl daemon-reload
sudo systemctl reload nginx
```

------------------------------------------------------------------------

# Testing the Backend

## 16. Test Backend Directly

Check whether anything is listening on port `7777`:

``` bash
sudo ss -ltnp | grep :7777
```

Test Node/Express locally:

``` bash
curl http://localhost:7777/user/feed
```

If this works, your backend is running.

------------------------------------------------------------------------

## 17. Test Through NGINX

Now test:

``` text
http://YOUR_SERVER_IP/api/user/feed
```

Example:

``` text
http://13.60.99.134/api/user/feed
```

### Do not make this mistake

``` text
http://13.60.99.134/7777
```

This means:

``` text
Port 80 + path /7777
```

It does **not** mean port `7777`.

To access port `7777` directly, use:

``` text
http://13.60.99.134:7777/user/feed
```

Through NGINX, use:

``` text
http://13.60.99.134/api/user/feed
```

------------------------------------------------------------------------

# Future Updates

## 18. When You Change Backend Code

After making changes locally:

``` bash
git add .
git commit -m "your message"
git push
```

Then SSH into EC2:

``` bash
cd ~/DevConnect-backend
git pull
npm install
pm2 restart DevTinder-backend
pm2 status
```

### If only JavaScript/source code changed

You can normally use:

``` bash
cd ~/DevConnect-backend
git pull
pm2 restart DevTinder-backend
```

### If `package.json` changed

Use:

``` bash
cd ~/DevConnect-backend
git pull
npm install
pm2 restart DevTinder-backend
```

You do **not** need to reinstall PM2 or NGINX after every code update.

------------------------------------------------------------------------

## 19. When You Change Frontend Code

After pushing the frontend changes:

``` bash
cd ~/devConnect-web
git pull
npm install
npm run build
sudo cp -r dist/* /var/www/html/
```

Then open:

``` text
http://YOUR_SERVER_IP
```

No NGINX reconfiguration is needed just because frontend files changed.

------------------------------------------------------------------------

# Troubleshooting

## Backend is not running

``` bash
pm2 status
pm2 logs DevTinder-backend --lines 50
```

Check port:

``` bash
sudo ss -ltnp | grep :7777
```

Test directly:

``` bash
curl http://localhost:7777/user/feed
```

If the PM2 process is missing:

``` bash
cd ~/DevConnect-backend
pm2 start npm --name DevTinder-backend -- start
```

If the PM2 process is broken:

``` bash
pm2 delete DevTinder-backend
pm2 start npm --name DevTinder-backend -- start
```

------------------------------------------------------------------------

## NGINX gives `502 Bad Gateway`

A `502` usually means NGINX cannot successfully reach the backend.

Check:

``` bash
pm2 status
sudo ss -ltnp | grep :7777
curl http://localhost:7777/user/feed
```

If `curl localhost:7777` fails, fix the backend/PM2 first.

If the backend works but NGINX still fails:

``` bash
sudo nginx -t
sudo systemctl reload nginx
```

------------------------------------------------------------------------

## NGINX gives `404`

Check that your request uses the correct URL.

Backend directly:

``` text
http://YOUR_SERVER_IP:7777/user/feed
```

Through NGINX:

``` text
http://YOUR_SERVER_IP/api/user/feed
```

Check the NGINX location:

``` nginx
location /api/ {
    proxy_pass http://localhost:7777/;
}
```

------------------------------------------------------------------------

# Quick Cheat Sheet

## First-time EC2 setup

``` bash
# SSH
ssh -i "APP-secret.pem" ubuntu@YOUR_SERVER_IP

# Node
nvm install 24
node -v
npm -v

# Clone project
git clone YOUR_REPO_URL
cd YOUR_PROJECT_FOLDER
npm install
```

## Frontend

``` bash
npm run build
sudo cp -r dist/* /var/www/html/
```

Open:

``` text
http://YOUR_SERVER_IP
```

## Backend

``` bash
cd ~/DevConnect-backend
npm install
pm2 start npm --name DevTinder-backend -- start
pm2 status
```

## PM2 after reboot

``` bash
pm2 startup
# run the command PM2 prints
pm2 save
```

## Backend update

``` bash
cd ~/DevConnect-backend
git pull
npm install
pm2 restart DevTinder-backend
```

## Frontend update

``` bash
cd ~/devConnect-web
git pull
npm install
npm run build
sudo cp -r dist/* /var/www/html/
```

## NGINX

``` bash
sudo nginx -t
sudo systemctl reload nginx
```

## Useful checks

``` bash
pm2 status
pm2 logs DevTinder-backend --lines 50
sudo ss -ltnp | grep :7777
curl http://localhost:7777/user/feed
```

## URLs

Frontend:

``` text
http://YOUR_SERVER_IP
```

Backend directly:

``` text
http://YOUR_SERVER_IP:7777/user/feed
```

Backend through NGINX:

``` text
http://YOUR_SERVER_IP/api/user/feed
```

**Remember:**

``` text
/7777       ❌
:7777       ✅
http://     ✅
https://    ❌ unless SSL is configured
```
## Added `.env` File in Remote Machine

- Opened the backend folder in the remote EC2 machine.
- Created a new `.env` file:

      nano .env

- This creates a new `.env` file at the root of the backend folder. Paste all the required environment variables into this file.

## Nginx Path Configuration

- Opened the Nginx configuration file on the AWS remote machine:

      sudo nano /etc/nginx/sites-available/default

- Updated the configuration so that `/api/` requests are forwarded to the backend running on port `7777` and all other routes are handled by the React frontend:

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

- Test the Nginx configuration before reloading:

      sudo nginx -t

- If the configuration test is successful, reload the Nginx server:

      sudo systemctl reload nginx

- Check Nginx status if required:

      sudo systemctl status nginx