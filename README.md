# Frontend CI/CD Pipeline with AWS EC2 & GitHub Actions 🎨

This document outlines the complete process for setting up an automated CI/CD pipeline for our React/Vue/Angular frontend. The pipeline uses **GitHub Actions** to automatically build and deploy the project to an **AWS EC2 instance**, where it is served to users by **Nginx**.



---

## 1. AWS EC2 Instance Setup ☁️

**(Note:** You can use the same EC2 instance you set up for the backend.)*

### Step 1: Ensure Instance is Ready
1.  If you haven't already, follow the **AWS EC2 Instance Setup** guide from the backend README to create, connect to, and prepare your server.
2.  Make sure the following are installed: **Node.js**, **npm**, and **Nginx**.
3.  Ensure your **Security Group** has an inbound rule to **allow HTTP traffic on Port 80** from `Anywhere` (0.0.0.0/0). This is essential for Nginx to serve your website.



---
<br><br>
![Successful Workflow Run in GitHub Actions](https://github.com/SurjeetKumar1/Apna-AI-Frontend/blob/main/public/assets/ec2-machine.png)
<br><br>
<br><br>
![Successful Workflow Run in GitHub Actions](https://github.com/SurjeetKumar1/Apna-AI-Frontend/blob/main/public/assets/portopen.png)
<br><br>


## 2. GitHub Actions Self-Hosted Runner Setup 🏃‍♀️

We need a dedicated runner for our frontend repository on the EC2 instance.

1.  In your frontend GitHub repository, go to **Settings > Actions > Runners**.
2.  Click **"New self-hosted runner"** and choose the **Linux** image.
3.  On your EC2 instance, create a **separate directory** for this new runner to avoid conflicts with the backend runner. Then, run the commands provided by GitHub.
    ```bash
    # Create a separate folder for the frontend runner
    mkdir frontend-runner && cd frontend-runner

    # Download, configure, and install the runner
    # (Follow the commands exactly as shown on your GitHub settings page)
    curl -o actions-runner-linux-x64-2.328.0.tar.gz -L https://github.com/actions/runner/releases/download/v2.328.0/actions-runner-linux-x64-2.328.0.tar.gz
    echo "01066fad3a2893e63e6ca880ae3a1fad5bf9329d60e77ee15f2b97c148c3cd4e  actions-runner-linux-x64-2.328.0.tar.gz" | shasum -a 256 -c
    tar xzf ./actions-runner-linux-x64-2.328.0.tar.gz
    ./config.sh --url https://github.com/SurjeetKumar1/Apna-AI-Frontend --token BCKCEMVFABW4M3VVM6JWXNTIWLP4K
    sudo ./svc.sh install
    sudo ./svc.sh start
    ```
    Your EC2 instance is now also listening for jobs from your frontend repository!

---
<br><br>
![Successful Workflow Run in GitHub Actions](https://github.com/SurjeetKumar1/Apna-AI-Frontend/blob/main/public/assets/frontend-runner.png)
<br><br>

## 3. GitHub Actions Workflow Configuration ⚙️

This workflow will install dependencies and build your frontend project.

1.  In your repository, create a directory `.github/workflows`.
2.  Inside it, create a file named `cicd.yml`.
3.  Paste the following code into `cicd.yml`:

     ```yaml
  name: Node.js CI

  on:
   push:
    branches: [ "main" ]

jobs:
  build:

    runs-on: self-hosted

    strategy:
      matrix:
        node-version: [18.x, 20.x, 22.x]
        # See supported Node.js release schedule at https://nodejs.org/en/about/releases/

    steps:
    - uses: actions/checkout@v4
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v4
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    - run: npm ci
    - run: npm run build --if-present
    - run: npm run build 
    # - run: npm test
    ```

---

<br><br>
![Successful Workflow Run in GitHub Actions](https://github.com/SurjeetKumar1/Apna-AI-Frontend/blob/main/public/assets/frontendworkflow.png)
<br><br>

## 4. Nginx Configuration for Serving the Site 🌐

After the workflow builds your project, we need to tell Nginx where to find the static files (`index.html`, CSS, JS).

1.  SSH into your EC2 instance.
2.  Edit the default Nginx configuration file.
    ```bash
    sudo nano /etc/nginx/sites-available/default
    ```
3.  Inside the `server { ... }` block, find the `root` directive and change its path to point to your frontend's build output directory. The path will look something like this:
    `/home/ubuntu/frontend-runner/_work/YOUR_REPO_NAME/YOUR_REPO_NAME/dist`
    *(Note: Replace `dist` with `build` if your framework uses that name.)*

4.  Also, find the `server_name` directive and change it to your EC2 instance's public DNS name (or underscore `_` as a catch-all).

    ```nginx
    # Example snippet from the Nginx config file

    server {
        listen 80 default_server;
        listen [::]:80 default_server;

        # CHANGE THIS LINE
        root /home/ubuntu/frontend-runner/_work/Apna-AI-Frontend/Apna-AI-Frontend/dist;

        index index.html index.htm;

        # CHANGE THIS LINE
        server_name ec2-54-210-6-159.compute-1.amazonaws.com;

        location / {
            try_files $uri $uri/ /index.html;
        }
    }
    ```
5.  Save the file and exit the editor.
6.  Test the Nginx configuration for errors.
    ```bash
    sudo nginx -t
    ```
7.  If the test is successful, restart Nginx to apply the changes.
    ```bash
    sudo systemctl restart nginx
    ```

---

## 5. Verification ✅

After pushing a change to the `main` branch, the GitHub Action will run and build your files. Since Nginx is already pointing to the build directory, the new version of your site will be live immediately.

To see your deployed frontend, simply navigate to your EC2 instance's public DNS in your browser:

`http://ec2-54-210-6-159.compute-1.amazonaws.com`


<br><br>
![Successful Workflow Run in GitHub Actions](https://github.com/SurjeetKumar1/Apna-AI-Frontend/blob/main/public/assets/frontend-live-login.png)
<br><br>


<br><br>
![Successful Workflow Run in GitHub Actions](https://github.com/SurjeetKumar1/Apna-AI-Frontend/blob/main/public/assets/frontend-live-chat.png)
<br><br>

