# 2. Requirements

## Server

| Requirement | Notes |
| --- | --- |
| Ubuntu Linux | The reference white-label setup runs on 1 vCPU, 4 GB RAM, 50 GB storage. Use more for larger fleets. |
| Java | Required by Traccar 6.0 |
| PostgreSQL 14+ | Used by Traccar. Client and server versions must match for backup and restore. |
| Node.js | Version used in development: v24.18.0 |
| MongoDB | Run via Docker Compose |
| Docker + Docker Compose | For MongoDB |
| Nginx + Certbot | Reverse proxy and free SSL |
| PM2 | Keeps the backend running |

## Developer machine (for the mobile app)

- Flutter 3.38.4 (stable), Dart
- Android SDK; Xcode for iOS builds (macOS only)
- Run `flutter doctor` and fix everything it flags

## Accounts you must create

| Service | Used for | Cost type |
| --- | --- | --- |
| Domain + DNS | Web addresses | Yearly |
| Firebase project | Push notifications | Free tier, usage based |
| Google Cloud (Maps Platform) | Maps, Places search, Geocoding | Usage based |
| Razorpay | Renewal payments | Per transaction |
| SMS provider | Login OTP delivery | Per message |
| Google Play Console | Publishing Android | One-time fee |
| Apple Developer Program | Publishing iOS | Yearly |
| Amazon S3 (optional) | File storage | Usage based |

## Network ports

| Port | Purpose | Expose publicly? |
| --- | --- | --- |
| 22 | SSH | Yes, restrict by IP if possible |
| 80 / 443 | HTTP / HTTPS | Yes |
| 5000-6000 | GPS devices to Traccar (e.g. 5023 GT06/Concox, 5095 UPro) | Yes |
| 8083 | Traccar web/API | Only via Nginx; bind or firewall to localhost if possible |
| 3100 | Backend | Only via Nginx |
| 5432 | PostgreSQL | **No** |
| 27017 | MongoDB | **No** |

To support another device model, enable its port in `traccar.xml` and open that port in the firewall.
