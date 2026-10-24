# 12. Security Hardening

Complete this **before** accepting customers.

## Secrets

- Generate **new** values for everything: JWT secret, Swagger login, database passwords, Traccar service user, MongoDB credentials. Do not reuse any sample or default value.
- Keep `config/default.json`, `.env`, `traccar.xml`, `key.properties`, keystores and Firebase service-account files **out of Git** (add to `.gitignore`).
- Store backups encrypted and off the server.
- If a secret was ever committed, rotate it. Removing it from history is not enough.

## Network

- Open only 22, 80, 443 and the device port range. Keep 5432, 27017, 3100 and 8083 closed to the internet (see [Requirements](02-requirements.md#network-ports)).
- Restrict SSH to key-based login; disable password login; limit by IP if you can.
- Bind MongoDB to `127.0.0.1` in Docker.
- Serve everything over HTTPS only.

## Known behaviours to be aware of

| Behaviour | Risk | Suggested mitigation |
| --- | --- | --- |
| JWT tokens never expire and there is no refresh token | A leaked token works indefinitely | Add expiry and refresh, or rotate the JWT secret to invalidate all tokens |
| No rate limiting | OTP and login endpoints can be abused (SMS cost, brute force) | Rate-limit at Nginx (`limit_req`) or in Express |
| CORS wide open in development code | Any origin can call the API | Comment out the two lines in `src/router.ts` before deploying |
| Swagger exposed on the backend domain | API surface is discoverable | Keep it password protected, or restrict by IP in Nginx |
| Backend uses a Traccar admin token | Compromise gives full Traccar access | Dedicated service user, strong password, never ship it in the app |
| Plain-text DB passwords in `traccar.xml` and `default.json` | File read gives DB access | Restrict file permissions (`chmod 600`), run services as non-root |
| Traccar run as `root` in some setups | Process compromise is full compromise | Run as a dedicated unprivileged user |

## Accounts

- Enable two-factor authentication on your domain registrar, DNS, cloud, Firebase, Google Cloud, Razorpay, Play Console and Apple accounts.
- Restrict Google Maps keys by app identity.
