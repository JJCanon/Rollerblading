# Auth Service — API Reference

Authentication microservice for the Rollerblading project. Handles registration, login, JWT, refresh tokens, and roles (`roller`, `admin`).

**Base URL (local):** `http://localhost:3001`
**Base URL (via API Gateway, future):** `https://api.rollerblading.com/auth`

## Authentication

Protected routes require an **access token** JWT in the header:

```
Authorization: Bearer <accessToken>
```

The access token expires after **15 minutes**. When it expires, use `POST /api/auth/refresh` with the refresh token to get a new pair — don't make the user log in again every 15 minutes.

## Rate limiting

`POST /api/auth/register` and `POST /api/auth/login` are limited to **5 attempts per 15 minutes per IP**. When exceeded:

```json
// 429 Too Many Requests
{ "error": "Too many attempts. Please try again later." }
```

---

## `POST /api/auth/register`

Creates a new user with the `roller` role (default role — it's not possible to register as `admin` directly).

**Body:**

| Field       | Type   | Required | Notes                         |
| ----------- | ------ | -------- | ----------------------------- |
| `email`     | string | yes      | must be a valid, unique email |
| `password`  | string | yes      | minimum 8 characters          |
| `name`      | string | yes      |                               |
| `lastname`  | string | yes      |                               |
| `cellphone` | string | no       |                               |
| `avatarUrl` | string | no       | must be a valid URL           |

**Example request:**

```json
{
  "email": "test@example.com",
  "password": "password123",
  "name": "Juan",
  "lastname": "Perez"
}
```

**201 Created:**

```json
{
  "user": {
    "id": "db25b467-ab17-44c1-909f-8c13a8a1dabb",
    "email": "test@example.com",
    "name": "Juan",
    "lastname": "Perez",
    "cellphone": null,
    "avatar_url": null,
    "role": "roller",
    "active": true,
    "registered_at": "2026-08-24T22:14:03.079Z"
  }
}
```

**Errors:**

| Status | Cause                                                       | Body                                                         |
| ------ | ----------------------------------------------------------- | ------------------------------------------------------------ |
| 400    | validation failed (invalid email, password too short, etc.) | `{ "error": "Invalid data", "details": { "email": [...] } }` |
| 409    | a user with that email already exists                       | `{ "error": "A user with that email already exists" }`       |
| 429    | rate limit exceeded                                         | `{ "error": "Too many attempts..." }`                        |

---

## `POST /api/auth/login`

**Body:**

| Field      | Type   | Required |
| ---------- | ------ | -------- |
| `email`    | string | yes      |
| `password` | string | yes      |

**Example request:**

```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

**200 OK:**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "4732c817f390f94338d5bef049ac9f88c8...",
  "user": {
    "id": "db25b467-ab17-44c1-909f-8c13a8a1dabb",
    "email": "test@example.com",
    "name": "Juan",
    "lastname": "Perez",
    "role": "roller"
  }
}
```

**Errors:**

| Status | Cause                                                 | Body                                            |
| ------ | ----------------------------------------------------- | ----------------------------------------------- |
| 400    | validation failed                                     | `{ "error": "Invalid data", "details": {...} }` |
| 401    | email doesn't exist, wrong password, or inactive user | `{ "error": "Invalid credentials" }`            |
| 429    | rate limit exceeded                                   | `{ "error": "Too many attempts..." }`           |

> The `401` message is intentionally the same for all three cases (nonexistent email, wrong password, inactive user) — never reveal which one failed, to avoid enabling registered-email enumeration.

---

## `POST /api/auth/refresh`

Rotates the refresh token: the one you send is **revoked** immediately, and a new pair is issued. Use this when the `accessToken` expires.

**Body:**

| Field          | Type   | Required |
| -------------- | ------ | -------- |
| `refreshToken` | string | yes      |

**Example request:**

```json
{
  "refreshToken": "4732c817f390f94338d5bef049ac9f88c8..."
}
```

**200 OK:**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "007068596d708caf110be9f0f8825fd0a4..."
}
```

**Errors:**

| Status | Cause                                                      | Body                                              |
| ------ | ---------------------------------------------------------- | ------------------------------------------------- |
| 400    | `refreshToken` missing from body                           | `{ "error": "Invalid data", "details": {...} }`   |
| 401    | token invalid, expired, already used (rotated), or revoked | `{ "error": "Invalid or expired refresh token" }` |

> A refresh token can only be used **once**. If the client retries with an already-used token, that signals either a frontend bug or a possible stolen token being reused elsewhere.

---

## `POST /api/auth/logout`

Revokes a specific refresh token (ends that session). It's **idempotent**: calling it with an already-revoked, expired, or nonexistent token still returns success.

**Body:**

| Field          | Type   | Required |
| -------------- | ------ | -------- |
| `refreshToken` | string | yes      |

**204 No Content** — no body.

**Errors:**

| Status | Cause                            | Body                                            |
| ------ | -------------------------------- | ----------------------------------------------- |
| 400    | `refreshToken` missing from body | `{ "error": "Invalid data", "details": {...} }` |

---

## `POST /api/auth/logout-all`

Revokes **all** active refresh tokens for the authenticated user at once — useful for "log out on all devices" or in response to suspicious activity. Unlike `/logout`, it doesn't take a `refreshToken` in the body: it identifies the user through the `accessToken`.

**Headers:**

```
Authorization: Bearer <accessToken>
```

**Body:** none.

**204 No Content** — no body.

**Errors:**

| Status | Cause                                | Body                                             |
| ------ | ------------------------------------ | ------------------------------------------------ |
| 401    | missing `Authorization` header       | `{ "error": "Access token required" }`           |
| 401    | invalid, corrupted, or expired token | `{ "error": "Invalid or expired access token" }` |

> After calling this endpoint, **all** of the user's refresh tokens (across every device or session) are revoked — not just the one from the current session. Each of those devices will need to log in again the next time its `accessToken` expires and its app tries to call `/refresh`.

---

## `GET /api/auth/me`

Returns the authenticated user's data. Requires a valid `accessToken`.

**Headers:**

```
Authorization: Bearer <accessToken>
```

**200 OK:**

```json
{
  "user": {
    "id": "db25b467-ab17-44c1-909f-8c13a8a1dabb",
    "email": "test@example.com",
    "name": "Juan",
    "lastname": "Perez",
    "cellphone": null,
    "avatar_url": null,
    "role": "roller",
    "active": true,
    "registered_at": "2026-08-24T22:14:03.079Z"
  }
}
```

**Errors:**

| Status | Cause                                              | Body                                             |
| ------ | -------------------------------------------------- | ------------------------------------------------ |
| 401    | missing `Authorization` header                     | `{ "error": "Access token required" }`           |
| 401    | invalid, corrupted, or expired token               | `{ "error": "Invalid or expired access token" }` |
| 404    | the user from the token no longer exists in the DB | `{ "error": "User not found" }`                  |

---

## `GET /health`

Simple health check, no authentication required. Doesn't depend on the database.

**200 OK:**

```json
{ "status": "ok", "service": "auth-service" }
```

---

## Typical frontend flow

1. `POST /register` or `POST /login` → store `accessToken` in memory and `refreshToken` in secure storage (ideally an httpOnly cookie).
2. On every request to protected routes: `Authorization: Bearer <accessToken>`.
3. When a protected route responds `401` due to an expired token: call `POST /refresh` with the stored `refreshToken`, replace both tokens, retry the original request.
4. If `/refresh` also returns `401`: the refresh token expired or was revoked — redirect the user to log in again.
5. On logout: `POST /logout` with the current `refreshToken`, clear both tokens from the client.
6. For "log out on all devices" (e.g. from account settings, or after detecting suspicious activity): `POST /logout-all` with the current `accessToken` — no `refreshToken` needed.

## Role model

| Role      | How it's obtained                        | Routes it can use                                                                               |
| --------- | ---------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `invited` | unauthenticated user (no row in `users`) | public sections, doesn't go through this service                                                |
| `roller`  | default role on registration             | `/register`, `/login`, `/refresh`, `/logout`, `/me`                                             |
| `admin`   | promoted manually (not via public API)   | everything above + routes protected with `requireRole('admin')` in this and other microservices |

Each microservice (Content, Events, Store) validates the role independently using the JWT signature — it never trusts what the frontend or API Gateway already filtered.