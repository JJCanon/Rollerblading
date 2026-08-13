# Rollerblading Website's Data models
each microservice is an owner of its own tables/collections. There are no foreign keys between services: the cross references (like ´user_id´) were saved as simple UUID and it is validated against the Auth Service through API or the JWT, never without a direct JOIN to other database.

## 1. Auth Service (Node.js + Express) - PostgreSQL
Here just it registers 'Roller' and'Admin'. 'Invited' is the default role: there no have row in this table, simply it doesn't send token.

### "users"
| Field         | Type                    | description                               | Notes             |
| ------------- | ----------------------- | ----------------------------------------- | ----------------- |
| id            | UUID (PK)               | Unique identifier for the user            |                   |
| email         | varchar, unique         | User's email address                      |                   |
| password_hash | varchar                 | bcrypt/argon2 hash of the user's password |                   |
| name          | varchar                 | User's name                               |                   |
| lastname      | varchar                 | User's last name                          |                   |
| cellphone     | varchar                 | User's cell phone number                  | optional          |
| avatar_url    | varchar                 | URL to the user's avatar image            | optional          |
| role          | enum('roller', 'admin') | User's role in the system                 | default: 'roller' |
| active        | boolean                 | Whether the user is active or not         | default: true     |
| registered_at | timestamp               | Timestamp when the user registered        | default: now()    |

### 'refresh_tokens'
| Field      | Type                  | description                                  | Notes          |
| ---------- | --------------------- | -------------------------------------------- | -------------- |
| id         | UUID (PK)             | Unique identifier for the refresh token      |                |
| user_id    | UUID (FK -> users.id) | The ID of the user associated with the token |                |
| token_hash | varchar               | Hash of the refresh token                    |                |
| expires_at | timestamp             | Expiration timestamp of the refresh token    |                |
| revoked    | boolean               | Whether the token has been revoked           | default: false |

---

## 2. Content Service (Java + Spring Boot) - MongoDB
cover the sections 1, 2, 6, 7 and 8: History, Instagram posts, colaborators, entrepreneurship, Social Media / Contact.

### `history` (singleton type unique document)
```json
{
    "_id": "history",
    "title": "string",
    "contentMarkdown": "string",
    "images": ["url"],
    "updatedBy": "UUID (user_id)",
    "updatedAt": "datetime"
}
```

### `instagram_posts` (feed's cache, it synchronized with Instagram Graph API)
```json
{
    "_id": "objectId",
    "instagramPostId": "string",
    "mediaURL": "string",
    "mediaType": "IMAGE | VIDEO | CAROUSEL",
    "caption": "string",
    "permalink": "string",
    "publishedAt": "datetime",
    "syncronizedAt": "datetime"
}
```

### `social_media_contact`
```json
{
    "_id": "objectId",
    "platform": "INSTAGRAM | FACEBOOK | TIKTOK | WHATSAPP | EMAIL | OTHER",
    "value": "string (url or number)",
    "visible": "boolean",
    "order": "integer",
}
```

### `colaborators`
```json
{
    "_id": "objectId",
    "name": "string",
    "logoURL": "string",
    "websiteURL": "string",
    "Type": "SPONSOR | PARTNER | INSTITUTION | OTHER",
    "socialMedia": {
        "instagram": "string",
        "facebook": "string",
        "tiktok": "string",
        "whatsapp": "string",
        "email": "string"
    },
    "active": "boolean",
    "order": "integer"
}
```

### `entrepreneurship`
```json
{
    "_id": "objectId",
    "name": "string",
    "description": "string",
    "category": "PRODUCT | SERVICE",
    "memberUserId": "UUID (referenced to Auth Service)",
    "contact":"{
                "cellphone": "string",
                "whatsapp": "string",
                "instagram": "string"
                }",
    "images": ["url"],
    "state": "APPROVED | PENDING | REJECTED",
    "createdAt": "datetime"
}
```
publish by a 'roller' user, it could be approved or rejected by an 'admin' user (change 'state').

---

## 3. Events Service (Python + FastAPI) - PostgreSQL
cover the sections 3 and 4: Events and Schedule.

### `events`
| Field            | Type                                                 | description                            | Notes                          |
| ---------------- | ---------------------------------------------------- | -------------------------------------- | ------------------------------ |
| id               | UUID (PK)                                            | Unique identifier for the event        |                                |
| title            | varchar                                              | Title of the event                     |                                |
| description      | text                                                 | Detailed description of the event      |                                |
| type             | enum('ROLLING', 'COMPETITION', 'SOCIAL', 'LEARNING') | Type of event                          |                                |
| start_date       | timestamp                                            | Start date and time of the event       |                                |
| end_date         | timestamp                                            | End date and time of the event         |                                |
| location         | varchar                                              | Location of the event                  |                                |
| image_url        | varchar                                              | URL to the event's image               |                                |
| max_participants | integer                                              | Maximum number of participants         | nullable = no limit            |
| state            | enum("DRAFT", "ACTIVE", "CANCELLED", "COMPLETED")    | Current state of the event             | default: "DRAFT"               |
| created_by       | UUID                                                 | referenced to users.id in Auth Service | the user who created the event |

### `schedules`
| Field         | Type                                                                               | description                               | Notes          |
| ------------- | ---------------------------------------------------------------------------------- | ----------------------------------------- | -------------- |
| id            | UUID (PK)                                                                          | Unique identifier for the schedule        |                |
| weekday       | enum('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY') | Day of the week for the schedule          |                |
| specific_date | date                                                                               | Specific date for the schedule (optional) | nullable       |
| start_time    | time                                                                               | Start time of the schedule                |                |
| end_time      | time                                                                               | End time of the schedule                  |                |
| location      | varchar                                                                            | Location of the schedule                  |                |
| activity      | varchar                                                                            | Description of the activity               |                |
| level         | enum('BEGINNER', 'INTERMEDIATE', 'ADVANCED')                                       | Skill level for the activity              |                |
| recurring     | boolean                                                                            | Whether the schedule is recurring         | default: false |

---

## 4. Store Service (Go + Gin) - PostgreSQL
cover the section 5: sale of skating products.

### `products`
| Field       | Type                                                | Description                                               | Notes                                   |
| ----------- | --------------------------------------------------- | --------------------------------------------------------- | --------------------------------------- |
| id          | UUID (PK)                                           | Unique identifier for the product                         |                                         |
| name        | varchar                                             | Product name to sell                                      |                                         |
| description | text                                                | Product description to sell                               |                                         |
| price       | numeric(10,2)                                       | Product price per unit                                    |                                         |
| stock       | int                                                 | Quantity available to sell                                |                                         |
| category    | enum('SKATES','PROTECTIONS','ACCESORIES','CLOTHES') | Product category to sell                                  |                                         |
| variants    | jsonb                                               | Product details                                           | Example: [{"size": "38/L", "stock": 5}] |
| images      | text[]                                              | product images                                            |                                         |
| active      | boolean                                             | if the product is still available to sell                 |                                         |
| created_by  | UUID                                                | Foreign key of the user                                   | reference to users                      |
| state       | enum("APPROVED","PENDING","REJECTED","CANCELED")    | If the product is approved or not by the admin to publish |                                         |


### `orders`
| Field           | Type                                        | Description                              | Notes                                           |
| --------------- | ------------------------------------------- | ---------------------------------------- | ----------------------------------------------- |
| id              | UUID (PK)                                   | Unique identifier for the order          |                                                 |
| user_id         | UUID                                        | User who has bought the product          | reference to users, just 'roller/admin' can buy |
| total_amount    | numeric(10,2)                               | amount to pay for the product(s)         |                                                 |
| state           | enum('PENDING','PAID','DELIVERED','CANCEL') | Order state                              |                                                 |
| mailing_address | text                                        | address where the product will be mailed |                                                 |
| order_date      | timestamp                                   | order date                               |                                                 |

### `order_items`
| Field         | Type                  | Description                          | Notes |
| ------------- | --------------------- | ------------------------------------ | ----- |
| id            | UUID (PK)             | Unique identifier for the order item |       |
| order_id      | UUID (FK -> orders)   | Foreign key from orders (id)         |       |
| product_id    | UUID (FK -> products) | Foreign key from products (id)       |       |
| quantity      | Integer               | quantity of item order               |       |
| unitary_price | numeric(10,2)         | price at the shopping moment         |       |

### `payments`
| Field    | Type                                 | Description                        | Notes                                               |
| -------- | ------------------------------------ | ---------------------------------- | --------------------------------------------------- |
| id       | UUID (PK)                            | Unique identifier for the payments |                                                     |
| id_order | UUID (FK -> orders)                  | Foreign key from orders (id)       |                                                     |
| supplier | enum('WOMPI', 'MERCADOPAGO', 'CASH') | payment method                     |                                                     |
| state    | varchar                              | state of the payment               | webhook mirror of supplier or manually in cash case |
| amount   | numeric(10,2)                        | amount of payment paid             |                                                     |

---

## Summary of who can do what
| Entity                        | Guest     | Skater                  | admin                               |
| ----------------------------- | --------- | ----------------------- | ----------------------------------- |
| history, social_media_contact | read-only | read-only               | read and write                      |
| instagram_posts               | read-only | read-only               | synced only; no manual write access |
| collaborators                 | read-only | read-only               | read and write                      |
| entrepreneurship              | read-only | creates their own       | approves or rejects any entry       |
| events, schedules             | read-only | read-only               | read and write                      |
| products                      | read-only | creates their own       | approves or rejects any entry       |
| orders, order_items, payments | —         | creates/views their own | views and manages all               |
