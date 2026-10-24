# 10. Operations

## Routine care

| Task | Frequency |
| --- | --- |
| Server health (CPU, memory, disk) | Daily or weekly |
| Traccar log size | Weekly |
| Back up PostgreSQL and MongoDB | Daily or weekly |
| Back up code and configuration | Weekly |
| Check SSL certificates | Monthly |
| Review expiring subscriptions | Weekly |
| Clean old positions and events | As needed (no scheduled clean-up exists) |

There are no built-in alerts for server-down or disk-full. Set up your own monitoring (for example UptimeRobot or your host's alerts).

## Restart services

**Traccar** (adjust port; 8083 in the white-label setup)

```bash
sudo netstat -tulpn | grep :8083
sudo kill -9 <PID>
sudo netstat -tulpn | grep :8083        # nothing should be listed
cd /opt/traccar
nohup java -jar target/tracker-server.jar > traccar.log 2>&1 &
tail -f traccar.log
```

If you use the systemd unit: `sudo systemctl restart traccar`.

**Backend (PM2)**

```bash
pm2 list
pm2 restart <PROJECT_NAME>
pm2 status
pm2 logs <PROJECT_NAME>
```

**PostgreSQL**

```bash
sudo systemctl status postgresql
sudo systemctl start postgresql
```

**MongoDB (Docker)**

```bash
cd <PROJECT_FOLDER>/mongodb-docker
sudo docker ps
sudo docker-compose down && sudo docker-compose up -d
```

**Nginx**

```bash
sudo nginx -t
sudo systemctl status nginx
sudo systemctl restart nginx
```

## Disk space

The Traccar log can grow **25-30 GB in two to three days** and fill the disk. Rotate or delete it regularly, or start Traccar without a log file:

```bash
nohup java -jar target/tracker-server.jar > /dev/null 2>&1 &
```

The trade-off is that no log is available for troubleshooting. Alternatively, use `logrotate` on `traccar.log`.

Check database sizes:

```bash
sudo -u postgres psql -c "SELECT datname, pg_size_pretty(pg_database_size(datname)) FROM pg_database ORDER BY pg_database_size(datname) DESC;"
```

## Backups

| What | How |
| --- | --- |
| Server snapshot | Your host's snapshot feature, weekly |
| Backend code and config (`config/default.json`, `.env`) | Weekly copy to secure, **encrypted** storage |
| MongoDB | `mongodump` |
| Traccar PostgreSQL | `pg_dump` |

```bash
# PostgreSQL backup
pg_dump -U traccar -h localhost -p 5432 -F c -v -f backup.dump traccar

# PostgreSQL restore
pg_restore -U traccar -h <DB_HOST> -d <DB_NAME> backup.dump

# MongoDB backup (@ in passwords must be URL-encoded as %40)
mongodump --uri="mongodb://<MONGO_USER>:<ENCODED_PASSWORD>@localhost:27017/?authSource=admin" --out=./mongo-backup

# MongoDB restore
mongorestore --uri="mongodb://<MONGO_USER>:<ENCODED_PASSWORD>@localhost:27017/?authSource=admin" ./mongo-backup
```

> PostgreSQL client tools used for backup and restore must be the **same version** as the server.

Example daily cron (as the backup user):

```cron
0 2 * * * pg_dump -U traccar -F c -f /backups/pg-$(date +\%F).dump traccar
```

## Updates

- Traccar: see [Upgrading Traccar](04-traccar.md#46-upgrading-traccar).
- Backend: pull, `npm install`, `npx tsc`, `pm2 restart <PROJECT_NAME>`.
- Changing the backend address requires updating the app's base URLs and publishing a new app version.
