# 🛡️ Sentinel IAM Service

**A Production-Grade Identity & Access Management Microservice.**

> **Sentinel** is a hardened authentication backend designed to provide secure, scalable, and compliant user management for modern distributed applications. It completely abstracts the complexity of JWT rotation, protection against brute-force attacks, and strict input validation.

---

## 🚀 Key Features

- **🔐 Industrial-Grade Security**:

  - **Dual Token Architecture**: Implements Short-lived Access Tokens (15m) and Long-lived Refresh Tokens (7d) with automatic rotation.
  - **HttpOnly Cookies**: Prevents XSS attacks by keeping tokens inaccessible to client-side JavaScript.
  - **Brute-Force Protection**: Integrated Rate Limiting blocks repeated failed login attempts (Max 20/15min).
  - **Security Headers**: Full `Helmet` integration to mitigate common headers vulnerabilities.

- **🛡️ Robust Integrety**:

  - **Schema Validation**: Powered by **Zod**, complying with strict types for all inputs.
  - **Sanitization**: Automatic request body limits (16kb) to prevent payload bloat denial-of-service.

- **⚡ Developer Experience**:
  - **Modular Architecture**: Clean separation of concerns (Controllers, Services, Middlewares).
  - **Standardized Responses**: Unified `ApiResponse` and `ApiError` utilities for consistent frontend parsing.

---

## 🛠️ Tech Stack

- **Runtime**: Node.js (v20+)
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Validation**: Zod
- **Security**: Helmet, Express-Rate-Limit, BCrypt, JSONWebToken (JWT)
- **File Storage**: Cloudinary (via Multer)
- **Email Service**: Resend

---

## 📚 API Reference

### Base URL

`http://localhost:8001/api/v1`

### Authentication Endpoints

| Method | Endpoint                       | Description                             | Access           |
| :----- | :----------------------------- | :-------------------------------------- | :--------------- |
| `POST` | `/users/register`              | Register a new user with Avatar/Cover   | Public           |
| `POST` | `/users/login`                 | Login and receive Secure Cookies        | **Rate Limited** |
| `POST` | `/users/logout`                | Clear session cookies                   | Partial          |
| `POST` | `/users/refresh-token`         | Rotate Access Token using Refresh Token | Public           |
| `POST` | `/users/change-password`       | Update account password                 | **Protected**    |
| `POST` | `/users/forgot-password`       | Send password reset email               | Public           |
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
    ACCESS_TOKEN_SECRET=
    ACCESS_TOKEN_EXPIRY=15m
    REFRESH_TOKEN_SECRET=
    REFRESH_TOKEN_EXPIRY=7d
    CLOUDINARY_NAME=
    CLOUDINARY_API_KEY=
    CLOUDINARY_API_SECRET=
    RESEND_API_KEY=
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
