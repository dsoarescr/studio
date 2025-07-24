# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## 🚀 Important: Firebase Setup

For user login and data storage to work, you MUST enable the necessary Firebase services for your project.

### Step 1: Enable Authentication Methods

1.  **Go to the Firebase Console**: Open your project in the [Firebase Console](https://console.firebase.google.com/).
2.  **Select Your Project**: Click on `pixel-universe-ub7uk`.
3.  **Navigate to Authentication**: In the left-hand menu, under the "Build" section, click on **Authentication**.
4.  **Get Started**: Click the **"Get started"** button.
5.  **Enable Sign-in Methods**:
    *   Go to the **"Sign-in method"** tab.
    *   Click on **"Email/Password"** from the list of providers.
    *   Enable the first toggle switch and click **"Save"**.
    *   (Optional) You can also enable other providers like Google, Facebook, etc.

**Without this, user registration and login will fail.**

### Step 2: Create a Firestore Database (CRITICAL)

The application requires a Firestore database to store user data and other information.

1.  **Navigate to Firestore**: In the left-hand menu, under the "Build" section, click on **Firestore Database**.
2.  **Create Database**: Click the **"Create database"** button.
3.  **Select Production Mode**: Choose **"Start in production mode"** and click **"Next"**.
4.  **Choose Location**: Select a Firestore location (e.g., `eur3 (europe-west)`). **This cannot be changed later.** Click **"Enable"**.

**The application will not start correctly without a Firestore database.**
