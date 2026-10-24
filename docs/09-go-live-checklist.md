# 9. Go-live Checklist

## Order of work

1. Prepare the server ([Server setup](03-server-setup.md))
2. Domains and SSL
3. Deploy Traccar ([Traccar](04-traccar.md))
4. Deploy the backend ([Backend](05-backend.md))
5. Deploy the admin panel ([Admin panel](06-admin-panel.md))
6. Apply branding ([Branding](08-branding.md))
7. Build and publish the mobile app ([Mobile app](07-mobile-app.md))
8. Connect a test device and run the alert tests
9. Harden security ([Security](12-security.md))
10. Train your team and open to customers

## Checklist

- [ ] Servers installed and updated
- [ ] Domains and SSL working; `certbot renew --dry-run` passes
- [ ] Traccar running and receiving data from a test device
- [ ] Backend running under PM2 and survives a reboot (`pm2 startup` + `pm2 save`)
- [ ] CORS development lines commented out in `src/router.ts`
- [ ] Admin panel opens; a superadmin can sign in
- [ ] App installs; a customer can log in with OTP
- [ ] Push notifications arrive
- [ ] Payments tested end to end (test mode, then live)
- [ ] Backups scheduled and a restore tested
- [ ] Traccar log rotation or `/dev/null` setup in place
- [ ] All default and sample secrets replaced (JWT, Swagger, DB, Traccar service user)
- [ ] PostgreSQL and MongoDB not reachable from the internet
- [ ] Team trained; support contacts shared

## Alert tests

With a test device on the Live map, verify each of: over-speed, ignition on and off, geofence in and out, power cut (if supported), and a push notification arriving on a real phone.

## Device test

1. Configure the device with your server address and its protocol port (5023 for GT06/Concox, 5095 for UPro).
2. Add it in the Traccar panel with its IMEI.
3. Confirm it appears online in Traccar, then in the app after the vehicle is assigned to a customer.
