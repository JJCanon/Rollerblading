# Auth Service — API Reference

Microservicio de autenticación del proyecto Rollerblading. Maneja registro, login, JWT, refresh tokens y roles (`roller`, `admin`).

**Base URL (local):** `http://localhost:3001`
**Base URL (vía API Gateway, futuro):** `https://api.rollerblading.com/auth`

## Autenticación

Las rutas protegidas requieren un **access token** JWT en el header:

```
Authorization: Bearer <accessToken>
```

El access token expira en **15 minutos**. Cuando expire, usa `POST /api/auth/refresh` con el refresh token para obtener un par nuevo — no le pidas al usuario que haga login de nuevo cada 15 minutos.

## Rate limiting

`POST /api/auth/register` y `POST /api/auth/login` están limitados a **5 intentos cada 15 minutos por IP**. Al superarlo:

```json
// 429 Too Many Requests
{ "error": "Demasiados intentos. Intenta de nuevo más tarde." }
```

---

## `POST /api/auth/register`

Crea un nuevo usuario con rol `roller` (rol por defecto — no es posible registrarse como `admin` directamente).

**Body:**

| Campo       | Tipo   | Requerido | Notas                            |
| ----------- | ------ | --------- | -------------------------------- |
| `email`     | string | sí        | debe ser un email válido y único |
| `password`  | string | sí        | mínimo 8 caracteres              |
| `name`      | string | sí        |                                  |
| `lastname`  | string | sí        |                                  |
| `cellphone` | string | no        |                                  |
| `avatarUrl` | string | no        | debe ser una URL válida          |

**Ejemplo de request:**

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

**Errores:**

| Status | Causa                                                     | Body                                                            |
| ------ | --------------------------------------------------------- | --------------------------------------------------------------- |
| 400    | validación fallida (email inválido, password corta, etc.) | `{ "error": "Datos inválidos", "details": { "email": [...] } }` |
| 409    | ya existe un usuario con ese email                        | `{ "error": "Ya existe un usuario con ese email" }`             |
| 429    | rate limit excedido                                       | `{ "error": "Demasiados intentos..." }`                         |

---

## `POST /api/auth/login`

**Body:**

| Campo      | Tipo   | Requerido |
| ---------- | ------ | --------- |
| `email`    | string | sí        |
| `password` | string | sí        |

**Ejemplo de request:**

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

**Errores:**

| Status | Causa                                                    | Body                                               |
| ------ | -------------------------------------------------------- | -------------------------------------------------- |
| 400    | validación fallida                                       | `{ "error": "Datos inválidos", "details": {...} }` |
| 401    | email no existe, password incorrecta, o usuario inactivo | `{ "error": "Credenciales inválidas" }`            |
| 429    | rate limit excedido                                      | `{ "error": "Demasiados intentos..." }`            |

> El mensaje `401` es intencionalmente el mismo para los tres casos (email inexistente, password incorrecta, usuario inactivo) — no reveles cuál falló, para no facilitar enumeración de emails registrados.

---

## `POST /api/auth/refresh`

Rota el refresh token: el que envíes queda **revocado** de inmediato y se emite un par nuevo. Úsalo cuando el `accessToken` expire.

**Body:**

| Campo          | Tipo   | Requerido |
| -------------- | ------ | --------- |
| `refreshToken` | string | sí        |

**Ejemplo de request:**

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

**Errores:**

| Status | Causa                                                   | Body                                               |
| ------ | ------------------------------------------------------- | -------------------------------------------------- |
| 400    | falta `refreshToken` en el body                         | `{ "error": "Datos inválidos", "details": {...} }` |
| 401    | token inválido, expirado, ya usado (rotado), o revocado | `{ "error": "Refresh token inválido o expirado" }` |

> Un refresh token solo sirve **una vez**. Si el cliente reintenta con uno ya usado, es señal de un bug en el frontend o de un posible token robado y reutilizado por otra parte.

---

## `POST /api/auth/logout`

Revoca un refresh token específico (cierra esa sesión). Es **idempotente**: llamarlo con un token ya revocado, expirado, o inexistente sigue devolviendo éxito.

**Body:**

| Campo          | Tipo   | Requerido |
| -------------- | ------ | --------- |
| `refreshToken` | string | sí        |

**204 No Content** — sin body.

**Errores:**

| Status | Causa                           | Body                                               |
| ------ | ------------------------------- | -------------------------------------------------- |
| 400    | falta `refreshToken` en el body | `{ "error": "Datos inválidos", "details": {...} }` |

---

## `POST /api/auth/logout-all`

Revoca **todos** los refresh tokens activos del usuario autenticado de una sola vez — útil para "cerrar sesión en todos los dispositivos" o ante actividad sospechosa. A diferencia de `/logout`, no recibe `refreshToken` en el body: identifica al usuario a través del `accessToken`.

**Headers:**

```
Authorization: Bearer <accessToken>
```

**Body:** ninguno.

**204 No Content** — sin body.

**Errores:**

| Status | Causa                               | Body                                                 |
| ------ | ----------------------------------- | ---------------------------------------------------- |
| 401    | falta el header `Authorization`     | `{ "error": "Token de acceso requerido" }`           |
| 401    | token inválido, corrupto o expirado | `{ "error": "Token de acceso inválido o expirado" }` |

> Después de llamar este endpoint, **todos** los refresh tokens del usuario (de cualquier dispositivo o sesión) quedan revocados — no solo el de la sesión actual. Cada uno de esos dispositivos necesitará hacer login de nuevo la próxima vez que su `accessToken` expire y su app intente usar `/refresh`.

---

## `GET /api/auth/me`

Devuelve los datos del usuario autenticado. Requiere `accessToken` válido.

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

**Errores:**

| Status | Causa                                      | Body                                                 |
| ------ | ------------------------------------------ | ---------------------------------------------------- |
| 401    | falta el header `Authorization`            | `{ "error": "Token de acceso requerido" }`           |
| 401    | token inválido, corrupto o expirado        | `{ "error": "Token de acceso inválido o expirado" }` |
| 404    | el usuario del token ya no existe en la DB | `{ "error": "Usuario no encontrado" }`               |

---

## `GET /health`

Health check simple, sin autenticación. No depende de la base de datos.

**200 OK:**

```json
{ "status": "ok", "service": "auth-service" }
```

---

## Flujo típico del frontend

1. `POST /register` o `POST /login` → guarda `accessToken` en memoria y `refreshToken` en almacenamiento seguro (idealmente cookie httpOnly).
2. En cada request a rutas protegidas: `Authorization: Bearer <accessToken>`.
3. Cuando una ruta protegida responda `401` por token expirado: llama `POST /refresh` con el `refreshToken` guardado, reemplaza ambos tokens, reintenta el request original.
4. Si `/refresh` también da `401`: el refresh token venció o fue revocado — manda al usuario a login de nuevo.
5. Al cerrar sesión: `POST /logout` con el `refreshToken` actual, borra ambos tokens del cliente.
6. Para "cerrar sesión en todos los dispositivos" (ej. desde configuración de cuenta, o tras detectar actividad sospechosa): `POST /logout-all` con el `accessToken` vigente — no necesitas el `refreshToken`.

## Modelo de roles

| Rol       | Cómo se obtiene                              | Rutas que puede usar                                                                          |
| --------- | -------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `invited` | usuario sin autenticar (sin fila en `users`) | secciones públicas, no pasa por este servicio                                                 |
| `roller`  | rol por defecto al registrarse               | `/register`, `/login`, `/refresh`, `/logout`, `/me`                                           |
| `admin`   | promovido manualmente (no vía API pública)   | todo lo anterior + rutas protegidas con `requireRole('admin')` en este y otros microservicios |

Cada microservicio (Content, Events, Store) valida el rol de forma independiente usando la firma del JWT — nunca confía solo en lo que el frontend o el API Gateway ya filtraron.