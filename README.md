# 08a [Individual] WebRTC Example

**Type**: Individual

Have a WebRTC example where you can explain the overall parts.



---

## Prerequisites

Before starting, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or later recommended)
- npm (comes with Node.js)
- A Firebase account with a project already created

---


## Initial Setup

1. **Create a new Vite project**  
   Use the following command to scaffold a new Vite project:
   ```sh
   npm create vite@latest
   ```

2. **Follow the prompts**  
   During the setup, provide the following details:
   - **Project name**: `08a._WebRTC_Example`
   - **Package name**: `webrtc-video-chat`
   - **Framework**: `Vanilla`
   - **Variant**: `JavaScript`

3. **Navigate to the project directory**  
   ```sh
   cd 08a._WebRTC_Example
   ```

4. **Install dependencies**  
   ```sh
   npm install
   npm install firebase
   ```

5. **Start the development server**  
   ```sh
   npm run dev
   ```
   This will open the project in your default browser at `http://localhost:5173`.

---

## Creating Firebase Hosting

### 1. Install Firebase CLI

Before proceeding, check if the Firebase CLI is already installed globally:
```sh
firebase --version
```

- If the command returns a version number, skip the next step.
- If the command is not recognized, install the Firebase CLI globally:
  ```sh
  npm install -g firebase-tools
  ```

### 2. Log in to Firebase

Log in to your Firebase account using your Google credentials:
```sh
firebase login
```

### 3. Initialize Firebase Hosting

Set up Firebase Hosting for your project:
```sh
firebase init hosting
```

During the setup:
- Select **"Use an existing project"** and choose your Firebase project (`webrtc-video-chat-c70ec`).
- Set the **public directory** to `dist`.
- Choose **"Yes"** for single-page app configuration.
- Skip setting up automatic builds and deploys with GitHub for now.

---

## Build and Deploy

1. **Build the project**  
   Run the following command to create a production-ready build of the project:
   ```sh
   npm run build
   ```
   This will generate a `dist` folder containing all the files needed to run the project.

2. **Deploy to Firebase Hosting**  
   Deploy the project to Firebase Hosting using:
   ```sh
   firebase deploy
   ```
   After deployment, your project will be live at the hosting URL provided by Firebase.

---

## Firebase Project Links

- Firebase Project Console:  
  [https://console.firebase.google.com/project/webrtc-video-chat-c70ec/overview](https://console.firebase.google.com/project/webrtc-video-chat-c70ec/overview)

- Firebase Project Hosting:  
  [https://webrtc-video-chat-c70ec.web.app/](https://webrtc-video-chat-c70ec.web.app/)

---

## Resources

- [Vite Documentation](https://vitejs.dev/guide/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [WebRTC Overview](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API)