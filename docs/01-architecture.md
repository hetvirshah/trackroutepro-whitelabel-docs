# 1. Architecture

## Components

| Component | Role |
| --- | --- |
| **GPS device** | Fitted in the vehicle; reports position over the mobile network via TCP |
| **Traccar server** | Receives device data, filters it, stores positions and events in PostgreSQL, computes trips and stops |
| **Node.js backend** | Product logic: users, OTP login, vehicles, subscriptions, payments, alerts, push notifications, reports, admin APIs. Talks to Traccar on behalf of the app |
| **PostgreSQL** | Traccar's database |
| **MongoDB** | Backend application data |
| **Flutter app** | Customer app (Android/iOS) |
| **Admin panel** | Web front-end for superadmins; calls the backend |
| **Firebase Cloud Messaging** | Push notification delivery |
| **Razorpay** | Online payments |

## How a location reaches a customer

1. The device sends its position to Traccar (TCP, a port in the 5000-6000 range depending on protocol).
2. Traccar drops invalid, duplicate and drifting points, stores the rest, and calculates trips, stops and events.
3. The backend reads Traccar data, either through the Traccar REST API (using a service token) or, for some queries, directly from PostgreSQL.
4. The app calls the backend over REST and WebSocket.
5. Alerts are sent as push notifications through FCM and also stored, so they appear in the app's Alerts screen even if the push fails.

> **Note:** The app does not talk only to the backend. For vehicle positions and stop reports it calls the Traccar API directly, so the Traccar URL must also be reachable from phones and configured in the app (see [Mobile app](07-mobile-app.md)).

## Tech stack

| Layer | Technology |
| --- | --- |
| GPS server | Traccar 6.0 (customised build, `target/tracker-server.jar`) |
| Traccar DB | PostgreSQL 14+ |
| Backend | Node.js, Express, TypeScript |
| Backend DB | MongoDB (Docker Compose) |
| Mobile | Flutter 3.38.4, Dart, GetX, Dio, google_maps_flutter |
| Push | Firebase Cloud Messaging |
| Payments | Razorpay |
| Reverse proxy / TLS | Nginx + Certbot (Let's Encrypt) |
| Process manager | PM2 |
| Admin panel hosting | Any static hosting (AWS Amplify used in the reference setup) |
| Object storage (optional) | Amazon S3 |

## Reference deployment

One Ubuntu server running Traccar, PostgreSQL, MongoDB (Docker), the backend (PM2) and Nginx, with the admin panel on static hosting.

| Role | Example domain |
| --- | --- |
| Backend API | `api.<YOUR_DOMAIN>` (port 3100 behind Nginx) |
| Traccar web/API | `track.<YOUR_DOMAIN>` (port 8083 behind Nginx) |
| Admin panel | `admin.<YOUR_DOMAIN>` |
