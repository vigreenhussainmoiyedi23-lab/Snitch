# 🔐 Authentication API

Complete authentication system for the application with JWT Access Tokens, Refresh Token Rotation, Google OAuth, Email Verification, Session Management, and Password Recovery.

---

## Authentication Routes

| Method | Route | Body / Params | Description | Auth Required |
|--------|-------|---------------|-------------|---------------|
| POST | `/api/auth/register` | `{ username, email, password }` | Register a new account and send verification OTP | ❌ |
| POST | `/api/auth/login` | `{ email, password }` | Login using email & password | ❌ |
| GET | `/api/auth/google` | - | Redirect to Google OAuth | ❌ |
| GET | `/api/auth/google/callback` | OAuth Callback | Google OAuth callback | ❌ |
| POST | `/api/auth/verify-otp` | `{ otp }` | Verify email OTP | ❌ |
| POST | `/api/auth/resend-otp` | - | Resend verification OTP | ❌ |
| GET | `/api/auth/me` | Authorization Header | Get currently authenticated user | ✅ |
| POST | `/api/auth/refresh-token` | Refresh Token Cookie | Rotate Access Token & Refresh Token | ❌ |
| POST | `/api/auth/logout` | Refresh Token Cookie | Logout current session | ✅ |
| POST | `/api/auth/logout-all` | Refresh Token Cookie | Logout current session | ✅ |
| POST | `/api/auth/forget-password` | `{ email }` | Send password reset link | ❌ |
| POST | `/api/auth/reset-password/:token` | `{ password }` | Reset password using reset token | ❌ |
| POST | `/api/auth/change-password` | `{ oldPassword, newPassword }` | Change password | ✅ |

---


# Features

- ✅ JWT Authentication
- ✅ Access Token + Refresh Token Rotation
- ✅ Refresh Token stored in Secure HttpOnly Cookies
- ✅ Session Management
- ✅ Refresh Token Revocation
- ✅ Redis Token Blacklisting
- ✅ Email Verification with OTP
- ✅ Password Hashing (bcrypt)
- ✅ Forgot Password
- ✅ Password Reset via Secure Token
- ✅ Change Password
- ✅ Google OAuth 2.0
- ✅ Rate Limiting
- ✅ Input Validation
- ✅ Device Management
- ✅ Login History
- ✅ Multi-device Authentication
- ✅ Role-based Authorization
- ✅ Secure Cookies
- ✅ Session Revocation
---

# Authentication Flow

```text
Register
    │
    ▼
Email OTP Verification
    │
    ▼
Login
    │
    ▼
Access Token (Frontend Memory)
Refresh Token (HttpOnly Cookie)
    │
    ▼
Authenticated Requests
    │
    ▼
Access Token Expired
    │
    ▼
Refresh Token Rotation
    │
    ▼
New Access Token + New Refresh Token
```

---

# Security Highlights

- Refresh Token Rotation
- Refresh Token Hashing
- JWT Blacklisting
- Secure HttpOnly Cookies
- Password Hashing using bcrypt
- Email Verification
- Session Revocation
- Multi-device Login Support
- Google OAuth Integration
- Password Reset Protection
- Rate Limiting
- Role-Based Authorization
- Session Tracking
```