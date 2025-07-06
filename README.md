# User API Documentation

Welcome to the User API documentation. This guide provides clear, professional, and easy-to-read information for all user-related endpoints, including registration, login, profile retrieval, and logout. Each section includes an overview, endpoint details, request/response formats, and status codes.

---

## User Object Structure

The `user` object returned by the API contains the following fields:

| Field          | Type   | Description                                 |
| -------------- | ------ | ------------------------------------------- |
| `_id`          | String | Unique identifier for the user (MongoDB ID) |
| `fullname`     | Object | User's full name                            |
| └─ `firstname` | String | First name (min 3 chars, required)          |
| └─ `lastname`  | String | Last name (min 3 chars, optional)           |
| `email`        | String | User's email address (unique, required)     |
| `socketId`     | String | (Optional) Socket.io session ID             |
| `createdAt`    | Date   | (If enabled) User creation timestamp        |
| `updatedAt`    | Date   | (If enabled) Last update timestamp          |

> **Note:** Password is never returned in API responses.

---

## 1. Register a New User

### Endpoint

`POST /users/register`

### Overview

Create a new user account by providing your name, email, and password. On success, you receive a JWT token and user details.

### Request Body

```
{
  "fullname": {
    "firstname": "string (min 3 chars, required)",
    "lastname": "string (min 3 chars, optional)"
  },
  "email": "string (valid email, required)",
  "password": "string (min 6 chars, required)"
}
```

#### Example

```
{
  "fullname": { "firstname": "John", "lastname": "Doe" },
  "email": "john.doe@example.com",
  "password": "secret123"
}
```

### Responses

- **201 Created**: Registration successful.
  ```json
  {
    "token": "<jwt_token>",
    "user": {
      "_id": "<user_id>",
      "fullname": { "firstname": "John", "lastname": "Doe" },
      "email": "john.doe@example.com",
      "socketId": null
    }
  }
  ```
- **400 Bad Request**: Validation error.
- **500 Internal Server Error**: Server error.

---

## 2. User Login

### Endpoint

`POST /users/login`

### Overview

Authenticate an existing user using email and password. On success, a JWT token is returned in both the response and as an HTTP-only cookie.

### Request Body

```
{
  "email": "string (valid email, required)",
  "password": "string (min 6 chars, required)"
}
```

#### Example

```
{
  "email": "john.doe@example.com",
  "password": "secret123"
}
```

### Responses

- **200 OK**: Login successful.
  ```json
  {
    "token": "<jwt_token>",
    "user": {
      "_id": "<user_id>",
      "fullname": { "firstname": "John", "lastname": "Doe" },
      "email": "john.doe@example.com",
      "socketId": null
    }
  }
  ```
- **400 Bad Request**: Validation error.
- **401 Unauthorized**: User not found or invalid credentials.
- **500 Internal Server Error**: Server error.

---

## 3. Get User Profile

### Endpoint

`GET /users/profile`

### Overview

Retrieve the authenticated user's profile information. Requires a valid JWT token (sent as a cookie or Bearer token in the `Authorization` header).

### Headers

- `Authorization: Bearer <jwt_token>` (if not using cookies)

### Responses

- **200 OK**: Returns user profile.
  ```json
  {
    "user": {
      "_id": "<user_id>",
      "fullname": { "firstname": "John", "lastname": "Doe" },
      "email": "john.doe@example.com",
      "socketId": null
    }
  }
  ```
- **401 Unauthorized**: Missing, invalid, or blacklisted token.
- **404 Not Found**: User not found.
- **500 Internal Server Error**: Server error.

---

## 4. Logout User

### Endpoint

`GET /users/logout`

### Overview

Logs out the authenticated user by blacklisting the current JWT token and clearing the authentication cookie. Requires a valid JWT token.

### Headers

- `Authorization: Bearer <jwt_token>` (if not using cookies)

### Responses

- **200 OK**: Logout successful.
  ```json
  {
    "message": "Logged out successfully"
  }
  ```
- **401 Unauthorized**: Missing, invalid, or blacklisted token.
- **500 Internal Server Error**: Server error.

---

## General Notes

- All endpoints return JSON responses.
- Use HTTPS in production for security.
- JWT tokens are required for protected routes (`/users/profile`, `/users/logout`).
- Tokens can be sent as HTTP-only cookies or in the `Authorization` header as `Bearer <token>`.
- Blacklisted tokens cannot be used for authentication.
- Passwords are securely hashed before storage.

For any questions or issues, please contact the API maintainer.
