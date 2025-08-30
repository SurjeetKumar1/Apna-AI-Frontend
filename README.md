# **Frontend CI/CD Pipeline: AWS EC2 & GitHub Actions 🎨**

<p align="center">
  <img src="https://github.com/SurjeetKumar1/Apna-AI-Frontend/blob/main/public/assets/frontend-live-chat.png" alt="Application Screenshot" width="75%"/>
</p>

This repository contains the complete setup for an automated **CI/CD** (Continuous Integration/Continuous Deployment) pipeline for a modern JavaScript frontend (React, Vue, Angular, etc.). The pipeline uses **GitHub Actions** to automatically build and deploy the project to an **AWS EC2 instance**, where it is served to users by **Nginx**.

---

## **Table of Contents**

- [Features](#features-)
- [Architecture Overview](#architecture-overview-)
- [Setup Instructions](#setup-instructions-)
  - [1. AWS EC2 Instance Setup](#1-aws-ec2-instance-setup-)
  - [2. GitHub Actions Self-Hosted Runner](#2-github-actions-self-hosted-runner-setup-)
  - [3. GitHub Actions Workflow](#3-github-actions-workflow-configuration-)
  - [4. Nginx Configuration](#4-nginx-configuration-for-serving-the-site-)
- [Verification](#verification-)
- [Technology Stack](#technology-stack-)

---

## **Features ✨**

- **Automated Deployments:** Every push to the `main` branch automatically builds and deploys the latest version of the frontend.
- **High Availability:** Nginx is a robust, high-performance web server perfect for serving static production builds.
- **Scalable Foundation:** Built on AWS EC2, providing a reliable and scalable hosting environment.
- **Dedicated Runners:** Uses a separate self-hosted runner for the frontend to ensure isolation from backend processes.
- **Secure:** Leverages SSH keys for server access and a self-hosted runner for a secure link between GitHub and AWS.

---

## **Architecture Overview 🏗️**

The pipeline follows a simple and effective flow:
1.  A developer pushes code to the `main` branch on GitHub.
2.  This push event triggers the GitHub Actions workflow.
3.  GitHub assigns the job to the dedicated frontend self-hosted runner on the AWS EC2 instance.
4.  The runner checks out the code, installs dependencies (`npm ci`), and runs the production build script (`npm run build`).
5.  Nginx, which is already configured to point to the build output directory, automatically serves the newly built files to users.



---

## **Setup Instructions 🛠️**

Follow these steps to configure your frontend CI/CD pipeline.

### **1. AWS EC2 Instance Setup ☁️**

You can use the same EC2 instance you set up for your backend.

<br><br>
![Successful Workflow Run in GitHub Actions](https://github.com/SurjeetKumar1/Apna-AI-Frontend/blob/main/public/assets/ec2-machine.png)
<br><br>
<br><br>
![Successful Workflow Run in GitHub Actions](https://github.com/SurjeetKumar1/Apna-AI-Frontend/blob/main/public/assets/portopen.png)
<br><br>

1.  **Prerequisites:** Ensure your EC2 instance is running and you can connect to it via SSH.
2.  **Required Software:** Confirm that **Node.js**, **npm**, and **Nginx** are installed.
    ```bash
    node -v
    npm -v
    nginx -v
    ```
3.  **Security Group:** Verify that your instance's security group has an inbound rule to **allow HTTP traffic on Port 80** from `Anywhere` (0.0.0.0/0). This is crucial for Nginx to serve your website to the public.

   

### **2. GitHub Actions Self-Hosted Runner Setup 🏃‍♀️**

Create a dedicated runner for the frontend repository to avoid conflicts.

1.  In your frontend GitHub repo, go to **Settings > Actions > Runners**.
2.  Click **"New self-hosted runner"** and select **Linux**.
3.  On your EC2 instance, create a **separate directory** for this new runner and follow the commands provided by GitHub.

    ```bash
    # Create a separate folder to avoid conflicts
    mkdir frontend-runner && cd frontend-runner

    # Download, configure, and install the runner
    # (Follow the commands exactly as shown on your GitHub settings page)
    curl -o actions-runner.tar.gz -L "URL_FROM_GITHUB"
    tar xzf ./actions-runner.tar.gz
    ./config.sh --url "REPO_URL" --token "YOUR_TOKEN"
    sudo ./svc.sh install
    sudo ./svc.sh start
    ```

        <br><br>
![Successful Workflow Run in GitHub Actions](https://github.com/SurjeetKumar1/Apna-AI-Frontend/blob/main/public/assets/frontend-runner.png)
<br><br>

### **3. GitHub Actions Workflow Configuration ⚙️**

This workflow automates the build process on the server.

1.  In your repository, create the file `.github/workflows/cicd.yml`.
2.  Paste the following configuration. This script checks out the code, installs dependencies securely, and runs the build command.

    ```yaml
    name: Frontend CI/CD Build

    on:
      push:
        branches: [ "main" ]

    jobs:
      build:
        runs-on: self-hosted

        strategy:
          matrix:
            node-version: [20.x] # Choose a specific LTS version

        steps:
        - name: Checkout repository
          uses: actions/checkout@v4

        - name: Use Node.js ${{ matrix.node-version }}
          uses: actions/setup-node@v4
          with:
            node-version: ${{ matrix.node-version }}
            cache: 'npm'

        - name: Install Dependencies
          run: npm ci

        - name: Build Project
          run: npm run build --if-present
    ```


<br><br>
![Successful Workflow Run in GitHub Actions](https://github.com/SurjeetKumar1/Apna-AI-Frontend/blob/main/public/assets/frontendworkflow.png)
<br><br>

### **4. Nginx Configuration for Serving the Site 🌐**

Configure Nginx to serve the static files generated by your build process.

1.  SSH into your EC2 instance.
2.  Edit the default Nginx configuration file:
    ```bash
    sudo nano /etc/nginx/sites-available/default
    ```
3.  Modify the file to point to your frontend's build output directory.
    -   Change the `root` directive to the path of your build folder (e.g., `.../dist` or `.../build`).
    -   Update the `server_name` to your EC2 instance's public DNS or IP address.
    -   Add a `try_files` directive to properly handle routing for Single Page Applications (SPAs).

    ```nginx
    # Example Nginx configuration
    server {
        listen 80 default_server;
        listen [::]:80 default_server;

        # IMPORTANT: Change this path to your project's build directory
        root /home/ubuntu/frontend-runner/_work/YOUR_REPO/YOUR_REPO/dist;

        index index.html index.htm;

        # IMPORTANT: Change this to your server's public DNS name or IP
        server_name your_ec2_dns_or_ip_address;

        location / {
            # This is crucial for single-page applications like React/Vue
            try_files $uri $uri/ /index.html;
        }
    }
    ```
4.  Save the file, then test and restart Nginx:
    ```bash
    sudo nginx -t
    sudo systemctl restart nginx
    ```

---


## **Verification ✅**

After pushing a change to the `main` branch, the GitHub Action will run and build your files. Since Nginx is already pointing to the build directory, the new version of your site will be live immediately.

To see your deployed frontend, simply navigate to your EC2 instance's public DNS in your browser.

**Example URL:** `http://your-ec2-public-dns.com`

<p align="center">
  <img src="https://github.com/SurjeetKumar1/Apna-AI-Frontend/blob/main/public/assets/frontend-live-login.png" alt="Login Page" width="75%"/>
</p>

---

## **Technology Stack 💻**

-   **Cloud Provider:** [Amazon Web Services (AWS)](https://aws.amazon.com/)
-   **CI/CD:** [GitHub Actions](https://github.com/features/actions)
-   **Compute:** [AWS EC2](https://aws.amazon.com/ec2/)
-   **JavaScript Framework:** [React](https://reactjs.org/) / [Vue](https://vuejs.org/) / [Angular](https://angular.io/) (or any framework that builds static files)
-   **Web Server:** [Nginx](https://www.nginx.com/)
-   **Operating System:** [Ubuntu](https://ubuntu.com/)

---
