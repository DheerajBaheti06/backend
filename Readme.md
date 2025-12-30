# 🛡️ Sentinel IAM Service

**A Production-Grade Identity & Access Management Microservice.**

> **Sentinel** is a hardened authentication backend designed to provide secure, scalable, and compliant user management for modern distributed applications. It completely abstracts the complexity of JWT rotation, protection against brute-force attacks, and strict input validation.
>
> **Designed to be used as a standalone auth service for microservice-based systems.**

---

## 🚀 Key Features

- **🔐 Industrial-Grade Security**:

  - **Dual Token Architecture**: Implements Short-lived Access Tokens (15m) and Long-lived Refresh Tokens (7d) with automatic rotation.
  - **HttpOnly Cookies**: Prevents XSS attacks by keeping tokens inaccessible to client-side JavaScript.
  - **Brute-Force Protection**: Integrated Rate Limiting blocks repeated failed login attempts (**Max 20 attempts per 15 minutes per IP**).
  - **Security Headers**: Full `Helmet` integration to mitigate common headers vulnerabilities.

- **⚡ Developer Experience & Architecture**:
  - **Service Layer Pattern**: Business logic is decoupled from Controllers. This ensures the codebase is **Testable**, **Reusable** (e.g. for CLI/Admin tools), and **Maintainable**.
  - **Centralized Configuration**: All environment variables are validated at startup in `src/conf/index.js`, preventing runtime crashes due to missing keys.
  - **Modular Structure**: Clean separation of concerns (Controllers -> Services -> Models).
  - **Standardized Responses**: Unified `ApiResponse` and `ApiError` utilities for consistent frontend parsing.

---

## 🛠️ Tech Stack

- **Runtime**: Node.js (v20+)
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Validation**: Zod
- **Security**: Helmet, Express-Rate-Limit, bcrypt, JSON Web Token (JWT)
- **File Storage**: Cloudinary (via Multer)
- **Email Service**: Resend

---

## 📚 API Reference

### Base URL

`http://localhost:8000/api/v1`

### Authentication Endpoints

| Method | Endpoint                       | Description                             | Access           |
| :----- | :----------------------------- | :-------------------------------------- | :--------------- |
| `POST` | `/users/register`              | Register a new user with Avatar/Cover   | Public           |
| `POST` | `/users/login`                 | Login and receive Secure Cookies        | **Rate Limited** |
| `POST` | `/users/logout`                | Clear session cookies                   | Partial          |
| `POST` | `/users/refresh-token`         | Rotate Access Token using Refresh Token | Public           |
| `POST` | `/users/change-password`       | Update account password                 | **Protected**    |
| `POST` | `/users/forgot-password`       | Send password reset email               | **Rate Limited** |
| `POST` | `/users/reset-password/:token` | Reset password using token              | Public           |

### User Management

| Method  | Endpoint                | Description                        | Access        |
| :------ | :---------------------- | :--------------------------------- | :------------ |
| `GET`   | `/users/current-user`   | Get full profile of logged-in user | **Protected** |
| `PATCH` | `/users/update-account` | Update Name/Email                  | **Protected** |
| `PATCH` | `/users/avatar`         | Update Avatar image                | **Protected** |
| `PATCH` | `/users/cover-image`    | Update Cover image                 | **Protected** |

---

## 🔧 Installation & Setup

1.  **Clone the Repository**

    ```bash
    git clone https://github.com/DheerajBaheti06/backend.git
    cd backend
    ```

2.  **Install Dependencies**

    ```bash
    npm install
    ```

3.  **Environment Configuration**
    Copy the `.env.sample` file to `.env` and fill in the values:

    ```bash
    cp .env.sample .env
    ```

    Or manually create a `.env` file with the following keys:

    ```env
    PORT=8000
    NODE_ENV=development
    MONGODB_URI=
    CORS_ORIGIN=*
    FRONTEND_URL=http://localhost:3000
    ACCESS_TOKEN_SECRET=
    ACCESS_TOKEN_EXPIRY=15m
    REFRESH_TOKEN_SECRET=
    REFRESH_TOKEN_EXPIRY=7d
    CLOUDINARY_NAME=
    CLOUDINARY_API_KEY=
    CLOUDINARY_API_SECRET=
    RESEND_API_KEY=
    ```

    > ⚠️ **IMPORTANT — Resend Domain Verification**
    >
    > By default, the app uses `onboarding@resend.dev` for testing, which **ONLY** allows sending emails to the address you signed up with on Resend.
    > To send emails to _anyone_ (production mode), you must:
    >
    > 1. Add your domain in the [Resend Dashboard](https://resend.com/domains).
    > 2. Verify DNS records.
    > 3. Update the `from` address in `src/utils/sendEmail.js`.

4.  **Run Development Server**
    ```bash
    npm run dev
    ```

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
