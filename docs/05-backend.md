# 5. Backend (Node.js)

TypeScript + Express, compiled to JavaScript in `dist/`. Default port **3100**.

| Item | Detail |
| --- | --- |
| Entry point | `src/index.ts` |
| WebSocket | `src/socket.ts` |
| Runtime | Node.js v24.x (development version v24.18.0), Express 4.x, MongoDB |
| API docs | Swagger at `/api-docs` (password protected) |

## 5.1 Project structure

| Path | Purpose |
| --- | --- |
| `config/default.json` | Database credentials, JWT secret, Firebase, Razorpay and other settings |
| `.env` | Environment configuration |
| `dist/` | Compiled output |
| `locales/`, `src/locales/` | Translation files |
| `public/` | Static files served publicly |
| `src/helper/` | Utilities |
| `src/MailBody/` | Email templates and layout generators |
| `src/middleware/` | Authentication, validation |
| `src/models/` | Database schemas |
| `src/services/` | Business logic and integrations |
| `src/startup/` | Start-up scripts such as DB connection |

> `src/ssssss.ts` is a temporary test file and can be removed. There are no automated tests and no `.env.example` in the repository.

## 5.2 Configuration

Set these in `config/default.json` and `.env`. Check your copy of the files for the exact key names.

| Setting | Purpose |
| --- | --- |
| `PORT` | Listening port (3100) |
| MongoDB URL | Application database |
| Traccar base URL | Traccar REST API of **your** Traccar instance |
| Traccar authorisation | Basic-auth token of a Traccar service user that the backend uses |
| Traccar PostgreSQL | Direct connection for some queries (host, user, password, database) |
| JWT secret | Signs user tokens. **Generate a new long random value** |
| Firebase service account | Sends push notifications from **your** Firebase project |
| Razorpay key id / secret | Payments, plus the webhook secret |
| Swagger username / password | Protects `/api-docs`. **Set your own** |
| SMS provider | Delivers login OTP messages |
| S3 (optional) | File storage bucket and credentials |

### Create the Traccar service token

1. In the Traccar panel, create an administrator user dedicated to the backend.
2. Build the header value: `Basic ` + base64(`email:password`).

```bash
echo -n 'service@<YOUR_DOMAIN>:<PASSWORD>' | base64
```

## 5.3 Run locally

```bash
npm install
npx tsc-watch     # terminal 1
npm start         # terminal 2
```

Requires Node.js, a MongoDB instance and access to a Traccar server (API and PostgreSQL).

## 5.4 Deploy

> **Before deploying**, comment out these two development-only lines in `src/router.ts`:
>
> ```ts
> // app.use(cors());
> // Response.header("Access-Control-Allow-Origin", "*");
> ```

```bash
npm install
npx tsc                        # build to dist/
pm2 start dist/index.js --name <PROJECT_NAME>
pm2 save
```

Confirm the start command against the `scripts` in `package.json`. Logs: `pm2 logs <PROJECT_NAME>` (no dedicated log files).

## 5.5 API conventions

| Topic | Detail |
| --- | --- |
| Date and time | UTC |
| Speed | **Knots**, as Traccar returns it. The app shows km/h; speed-alert limits are set in km/h |
| Distance | Not converted (Traccar default is metres) |
| Auth header | `Authorization: Bearer <token>` |
| Rate limiting | None |
| Caching | None |

## 5.6 Authentication

1. App requests an OTP for a mobile number; the server generates and stores it.
2. User submits the OTP; the server verifies it with the number.
3. Server returns a JWT.

| Item | Detail |
| --- | --- |
| Roles | `user` (customer), `superadmin` (admin panel access) |
| Token expiry | **Tokens do not expire** and there is no refresh token. See [Security](12-security.md) |
| Traccar link | Each app user is created in Traccar via `/api/users`; the app gets a Traccar session token from `/api/session/token` |

## 5.7 Traccar endpoints the backend uses

`/api/session`, `/api/users`, `/api/devices`, `/api/geofences`, `/api/permissions`, `/api/positions`, `/api/reports/route`, `/api/reports/trips`, `/api/reports/stops`, `/api/reports/summary`, `/api/reports/events`

## 5.8 Push notifications, jobs, payments

- **Push:** Firebase FCM. The app registers its token via `POST /Auth/UpdateToken`. If a push fails, the alert is still stored and appears in the app.
- **Scheduled job:** `sendExpiryNotifications` runs daily, checking vehicle document and subscription expiry dates and sending reminders.
- **Webhook:** the only webhook is the Razorpay payment verification webhook.
- **Payments:** order creation and signature verification via `/ecomm/razorpay/*`.
