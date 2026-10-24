# Track Route Pro: White-label Edition

A complete GPS vehicle tracking platform that you install on your own servers and sell under your own brand.

| Part | What it is | Who uses it |
| --- | --- | --- |
| **Customer mobile app** | Flutter app for Android and iOS (white-label flavor `label`) | Your customers |
| **Admin panel** | Web panel, superadmin role only | Your business team |
| **Traccar panel** | Customised Traccar 6.0 web interface | Your technical and support team |
| **Backend** | Node.js + TypeScript + Express, with Swagger API docs | Runs automatically |
| **Traccar server** | Customised Traccar 6.0 (Java) | Runs automatically |
| **Databases** | PostgreSQL (tracking data), MongoDB (application data) | Runs automatically |

## Features your customers get

- Live tracking on a map with status filters, follow mode, satellite and traffic layers
- Route history with replay, stops, idle time, distance and top speed
- Geofences with entry and exit alerts
- Push alerts: over-speed, ignition on/off, power cut, vibration, towing, parking
- Remote engine lock on supported installations
- PDF and Excel reports
- Subscription renewal and add-on devices with online payment (Razorpay)
- Multiple languages, light and dark mode

## Documentation

Read in this order for a first install.

| # | Guide | Covers |
| --- | --- | --- |
| 1 | [Architecture](docs/01-architecture.md) | Components, data flow, tech stack |
| 2 | [Requirements](docs/02-requirements.md) | Servers, software, third-party accounts, ports |
| 3 | [Server setup](docs/03-server-setup.md) | Ubuntu, Java, PostgreSQL, MongoDB, Node.js, Nginx, SSL, PM2 |
| 4 | [Traccar server](docs/04-traccar.md) | Install, configuration reference, device ports |
| 5 | [Backend](docs/05-backend.md) | Configuration, run, deploy, API conventions |
| 6 | [Admin panel](docs/06-admin-panel.md) | Hosting and connecting the web panel |
| 7 | [Mobile app](docs/07-mobile-app.md) | Build, configure, sign and publish |
| 8 | [Branding](docs/08-branding.md) | What to brand and where |
| 9 | [Go-live checklist](docs/09-go-live-checklist.md) | Test everything before launch |
| 10 | [Operations](docs/10-operations.md) | Restarts, logs, disk space, backups |
| 11 | [Troubleshooting](docs/11-troubleshooting.md) | Common problems and first checks |
| 12 | [Security hardening](docs/12-security.md) | Do this before going live |
| 13 | [Licences](docs/13-licences.md) | Third-party components and services |

## Placeholder convention

Values in `<ANGLE_BRACKETS>` are yours to supply, for example `<YOUR_DOMAIN>` or `<DB_PASSWORD>`. Never commit real secrets to a repository.

## Support

See [SUPPORT.md](SUPPORT.md).
