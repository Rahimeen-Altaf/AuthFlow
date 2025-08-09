# AuthFlow

This is a Next.js application demonstrating a complete authentication flow using an external API.

## Features

- User Login with an external API (`https://os-project-server.vercel.app/`)
- JWT (JSON Web Token) handling for session management
- Securely stored token in `localStorage`
- A dashboard (welcome screen) that displays user-specific data decoded from the token
- Logout functionality to clear the session
- Clean, responsive UI

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Setup and Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```
    or
    ```bash
    yarn install
    ```

3.  (Optional) Configure API base URL (defaults to `https://os-project-server.vercel.app/auth`):
    ```bash
    # .env.local
    NEXT_PUBLIC_API_URL=https://os-project-server.vercel.app/auth
    ```

4.  Run the development server:
    ```bash
    npm run dev
    ```
    or
    ```bash
    yarn dev
    ```

The application will be available at `http://localhost:9002`.

## Authentication Flow

1. The user enters their credentials on the login page.
2. The application sends a `POST` request to `https://os-project-server.vercel.app/auth/existinguser` with:
   ```json
   { "username": "string", "password": "string" }
   ```
3. Upon successful authentication, the API returns a JWT in the response body as `{ "token": "<jwt>" }`.
4. The frontend stores the token in `localStorage` (key: `authToken`), decodes it on the dashboard, and shows a personalized welcome (based on `username` or `name`/`email` from the token).
5. Clicking "Log Out" removes the token from `localStorage` and redirects back to the login page.

### Registration
- Create an account via `POST https://os-project-server.vercel.app/auth/newuser` with:
  ```json
  { "username": "string", "email": "string", "password": "string" }
  ```
  You can use the app's Sign Up page, then log in with the same username/password.

### Password Reset (OTP)
- Send OTP: `POST https://os-project-server.vercel.app/auth/send-otp` with:
  ```json
  { "email": "string" }
  ```
- Reset Password: `POST https://os-project-server.vercel.app/auth/reset-password` with:
  ```json
  { "email": "string", "otp": "string", "newPassword": "string" }
  ```
- In the app, use "Forgot Password" or the dashboard's change password flow to request an OTP and update the password.

## How to Test

- Start the app: `npm run dev` and visit `http://localhost:9002`.
- Register a new user via the Sign Up link, then log in using the same username and password.
- After login, you'll be redirected to the dashboard where the token is decoded and user info is displayed.
- Click "Log Out" to clear the session and return to the login screen.
- To test password reset, use "Forgot Password" or "Change Password": request an OTP to your email and then submit it with your new password.

## Scripts
- `npm run dev` - Start the dev server on port 9002
- `npm run build` - Build the production bundle
- `npm run start` - Start the production server
- `npm run lint` - Run lints
