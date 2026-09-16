# DevConnect Backend --- AWS EC2 Deployment

> **Backend:** `~/DevConnect-backend`\
> **Port:** `7777`\
> **PM2 name:** `DevTinder-backend`\
> **NGINX:** port `80`

------------------------------------------------------------------------

# 1. Connect to EC2

From Windows PowerShell:

``` powershell
cd Downloads
ssh -i "devConnect-secret.pem" ubuntu@YOUR_SERVER_IP
```

If Windows complains about PEM permissions:

``` powershell
icacls "devConnect-secret.pem" /inheritance:r
icacls "devConnect-secret.pem" /grant:r "$($env:USERNAME):(R)"
```

Linux/macOS:

``` bash
chmod 400 devConnect-secret.pem
```

------------------------------------------------------------------------

# 2. Install Node.js (First Time Only)

If Node/NVM is not already installed:

``` bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.7/install.sh | bash
. "$HOME/.nvm/nvm.sh"
nvm install 24
node -v
npm -v
```

`NVM` = **Node Version Manager**.

------------------------------------------------------------------------

# 3. Clone Backend Repository (First Time Only)

``` bash
cd ~
git clone https://github.com/YOUR_USERNAME/YOUR_BACKEND_REPO.git
cd ~/DevConnect-backend
```

**Do not clone again when updating an existing deployment.**

------------------------------------------------------------------------

# 4. Install Dependencies

Inside the backend:

``` bash
cd ~/DevConnect-backend
npm install
```

------------------------------------------------------------------------

# 5. Test Backend

Run:

``` bash
npm start
```

Expected:

``` text
database connection successfull 👍
backend server started at port no 7777
```

Stop it with:

``` text
Ctrl + C
```

------------------------------------------------------------------------

# 6. PM2 Setup (First Time)

Install PM2 globally:

``` bash
npm install pm2 -g
```

> I initially tried `sudo npm install pm2 -g` and got
> `sudo: 'npm': command not found`. With NVM, use `npm install pm2 -g`.

Start the backend:

``` bash
cd ~/DevConnect-backend
pm2 start npm --name DevTinder-backend -- start
```

Check:

``` bash
pm2 status
```

It should show:

``` text
DevTinder-backend   online
```

Check logs:

``` bash
pm2 logs DevTinder-backend --lines 50
```

Exit logs with:

``` text
Ctrl + C
```

### Important PM2 mistake I made

**Wrong:**

``` bash
pm2 start npm --name DevTinder-backend -- save
```

This caused:

``` text
Unknown command: "save"
```

**Correct:**

``` bash
pm2 start npm --name DevTinder-backend -- start
```

`pm2 save` is a separate command.

------------------------------------------------------------------------

# 7. Make PM2 Start After EC2 Reboot

First:

``` bash
pm2 startup
```

PM2 will print a command. **Run the exact command it gives you.**

Then:

``` bash
pm2 save
```

Remember:

``` text
pm2 start  = start application
pm2 save   = save PM2 process list
pm2 startup = configure startup after reboot
```

------------------------------------------------------------------------

# 8. Check Backend Port

Backend should listen on:

``` text
7777
```

Check:

``` bash
sudo ss -ltnp | grep :7777
```

If you see an old/unwanted process using the port, inspect its PID:

``` bash
ps -fp PID
```

If it is definitely the unwanted old Node process:

``` bash
kill PID
```

**Do not blindly use an old PID such as `42304`; PIDs change.**

------------------------------------------------------------------------

# 9. NGINX Setup (First Time Only)

Install:

``` bash
sudo apt update
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

NGINX web root:

``` text
/var/www/html/
```

------------------------------------------------------------------------

# 10. NGINX Reverse Proxy

Edit:

``` bash
sudo nano /etc/nginx/sites-available/default
```

Backend proxy:

``` nginx
location /api/ {
    proxy_pass http://localhost:7777/;

    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

A typical server block:

``` nginx
server {
    listen 80;
    listen [::]:80;

    server_name YOUR_SERVER_IP;

    root /var/www/html;
    index index.html index.htm;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:7777/;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Save Nano

``` text
Ctrl + O
Enter
Ctrl + X
```

Test configuration:

``` bash
sudo nginx -t
```

If successful:

``` bash
sudo systemctl reload nginx
```

If you get the systemd `daemon-reload` warning:

``` bash
sudo systemctl daemon-reload
sudo systemctl reload nginx
```

------------------------------------------------------------------------

# 11. Understand the URLs

### Direct backend

``` text
http://YOUR_SERVER_IP:7777/user/feed
```

### Through NGINX

``` text
http://YOUR_SERVER_IP/api/user/feed
```

**Wrong:**

``` text
http://YOUR_SERVER_IP/7777
```

`/7777` is a **path**, not port `7777`.

The correct port syntax is:

``` text
IP:7777
```

------------------------------------------------------------------------

# 12. Why NGINX Uses `/api/`

With:

``` nginx
location /api/ {
    proxy_pass http://localhost:7777/;
}
```

this:

``` text
/api/user/feed
```

is sent to the backend as:

``` text
/user/feed
```

So if Express has:

``` text
/user/feed
```

the route matches.

------------------------------------------------------------------------

# 13. If You Get 502 Bad Gateway

A `502` usually means NGINX cannot reach the backend.

Check in this order:

### 1. PM2

``` bash
pm2 status
```

Should be:

``` text
online
```

### 2. Port

``` bash
sudo ss -ltnp | grep :7777
```

### 3. Backend directly

``` bash
curl http://localhost:7777/user/feed
```

If the backend is not running, fix PM2/backend first.

------------------------------------------------------------------------

# 14. If You Get 404

If you used:

``` text
http://YOUR_SERVER_IP/7777
```

remember:

``` text
/7777 = URL path
:7777 = port
```

Use:

``` text
http://YOUR_SERVER_IP:7777/...
```

or, through NGINX:

``` text
http://YOUR_SERVER_IP/api/...
```

------------------------------------------------------------------------

# 15. Updating Backend After `git push`

This is the **main section to follow every time**.

First SSH into EC2, then:

``` bash
cd ~/DevConnect-backend
git pull
npm install
pm2 restart DevTinder-backend
pm2 status
```

Then check logs if needed:

``` bash
pm2 logs DevTinder-backend --lines 50
```

### Do I always need `npm install`?

**No.**

If only backend source files changed:

``` bash
git pull
pm2 restart DevTinder-backend
```

is normally enough.

If `package.json` / dependencies changed:

``` bash
git pull
npm install
pm2 restart DevTinder-backend
```

### Simple safe workflow

If you don't want to think about whether dependencies changed:

``` bash
cd ~/DevConnect-backend
git pull
npm install
pm2 restart DevTinder-backend
```

------------------------------------------------------------------------

# 16. If `.env` Changed

Make sure the new environment values exist on EC2.

Then:

``` bash
pm2 restart DevTinder-backend
```

Do **not** put secrets such as `.env`, passwords, JWT secrets, or API
keys into a public Git repository.

------------------------------------------------------------------------

# 17. Do I Need to Configure NGINX After Every `git pull`?

**No.**

For normal backend code updates:

``` bash
git pull
npm install       # only if needed
pm2 restart DevTinder-backend
```

You do **not** need:

``` bash
sudo nano /etc/nginx/sites-available/default
sudo nginx -t
sudo systemctl reload nginx
```

unless you actually changed the NGINX configuration.

------------------------------------------------------------------------

# 18. If PM2 Process Is Missing

Check:

``` bash
pm2 status
```

If `DevTinder-backend` does not exist:

``` bash
cd ~/DevConnect-backend
pm2 start npm --name DevTinder-backend -- start
```

Then:

``` bash
pm2 status
```

------------------------------------------------------------------------

# 19. If PM2 Shows `errored`

Run:

``` bash
pm2 logs DevTinder-backend --lines 50
```

Then:

``` bash
sudo ss -ltnp | grep :7777
```

If the PM2 process was created incorrectly, recreate it:

``` bash
pm2 delete DevTinder-backend
pm2 start npm --name DevTinder-backend -- start
```

Then:

``` bash
pm2 status
```

------------------------------------------------------------------------

# 20. Quick Command Cheat Sheet

### Backend update

``` bash
cd ~/DevConnect-backend
git pull
npm install
pm2 restart DevTinder-backend
pm2 status
```

### Logs

``` bash
pm2 logs DevTinder-backend --lines 50
```

Exit:

``` text
Ctrl + C
```

### PM2

``` bash
pm2 status
pm2 restart DevTinder-backend
pm2 stop DevTinder-backend
pm2 delete DevTinder-backend
pm2 startup
pm2 save
```

### Backend/port check

``` bash
sudo ss -ltnp | grep :7777
curl http://localhost:7777/user/feed
```

### NGINX

``` bash
sudo nginx -t
sudo systemctl reload nginx
```

------------------------------------------------------------------------

# 21. FINAL --- What I Actually Need to Remember

## First-time setup

``` text
SSH
  ↓
Node/NVM
  ↓
git clone
  ↓
npm install
  ↓
npm start (test)
  ↓
PM2
  ↓
NGINX
  ↓
Test /api/...
```

## Every future backend update

``` text
git push (local)
      ↓
SSH into EC2
      ↓
cd ~/DevConnect-backend
      ↓
git pull
      ↓
npm install (if dependencies changed)
      ↓
pm2 restart DevTinder-backend
      ↓
pm2 status
      ↓
test API
```

**You do NOT clone again, reinstall PM2, or reconfigure NGINX for every
code update.**
