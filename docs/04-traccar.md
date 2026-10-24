# 4. Traccar Server

The package includes a **customised Traccar 6.0** (source changes, configuration and a restyled web interface). Use the supplied build, not stock Traccar.

| Item | Detail |
| --- | --- |
| Version | Traccar 6.0, customised |
| Run command | `java -jar target/tracker-server.jar` |
| Web UI | `./traccar-web/simple` (customised CSS, logo, branding) |
| Config file | `traccar.xml` |
| Notification templates | `templates/short/` inside the Traccar folder |

## 4.1 Install

1. Copy the supplied Traccar folder to the server (for example `/opt/traccar`).
2. Edit `traccar.xml` (section 4.3): database connection, ports, Firebase service account.
3. Start it:

```bash
cd /opt/traccar
nohup java -jar target/tracker-server.jar > traccar.log 2>&1 &
tail -f traccar.log
```

> **Disk warning:** the Traccar log can grow 25-30 GB in a few days. See [Operations: disk space](10-operations.md#disk-space).

### Recommended: run as a systemd service

```ini
# /etc/systemd/system/traccar.service
[Unit]
Description=Traccar (Track Route Pro)
After=network.target postgresql.service

[Service]
WorkingDirectory=/opt/traccar
ExecStart=/usr/bin/java -jar target/tracker-server.jar
Restart=always
StandardOutput=null
StandardError=journal

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now traccar
```

## 4.2 Device ports

| Protocol | Config key | Port | Default |
| --- | --- | --- | --- |
| GT06 / Concox | `gt06.port` | 5023 | Enabled |
| UPro | `upro.port` | 5095 | Enabled |

Add other protocols by adding their `<protocol>.port` entry and opening the port in the firewall.

## 4.3 Configuration reference

Active settings from the reference `traccar.xml`. Replace every `<...>` value.

```xml
<!-- Web / API -->
<entry key='web.path'>./traccar-web/simple</entry>
<entry key='web.port'>8083</entry>

<!-- Logging -->
<entry key='logger.console'>true</entry>

<!-- Database -->
<entry key='database.driver'>org.postgresql.Driver</entry>
<entry key='database.url'>jdbc:postgresql://localhost:5432/traccar</entry>
<entry key='database.user'>traccar</entry>
<entry key='database.password'><DB_PASSWORD></entry>
<entry key='database.connectionTimeout'>30000</entry>
<entry key='database.idleTimeout'>600000</entry>
<entry key='database.maxLifetime'>1800000</entry>

<!-- Device ports -->
<entry key='gt06.port'>5023</entry>
<entry key='upro.port'>5095</entry>

<!-- Device status -->
<entry key='status.timeout'>300</entry>

<!-- Filters -->
<entry key='filter.enable'>true</entry>
<entry key='filter.invalid'>true</entry>
<entry key='filter.zero'>true</entry>
<entry key='filter.future'>600</entry>
<entry key='filter.past'>300</entry>
<entry key='filter.minPeriod'>10</entry>
<entry key='filter.duplicate'>true</entry>
<entry key='filter.static'>true</entry>
<entry key='filter.stationaryPeriod'>300</entry>
<entry key='filter.stationaryDistance'>20</entry>
<entry key='filter.distance'>0</entry>
<entry key='filter.skipLimit'>300</entry>
<entry key='filter.skipAttributes.enable'>true</entry>
<entry key='filter.skipAttributes'>ignition</entry>
<entry key='filter.maxSpeed'>200</entry>
<entry key='filter.accuracy'>30</entry>
<entry key='filter.skipOld'>false</entry>
<entry key='filter.period'>0</entry>
<entry key='coordinates.filter'>true</entry>

<!-- Motion and ignition events -->
<entry key='event.motion'>true</entry>
<entry key='event.motion.start'>true</entry>
<entry key='event.motion.stop'>true</entry>
<entry key='motion.inactive.timeout'>600</entry>
<entry key='event.ignition.on'>true</entry>
<entry key='event.ignition.off'>true</entry>
<entry key='event.motion.speedThreshold'>4</entry>
<entry key='event.fuelIncrease.threshold'>5</entry>
<entry key='event.fuelDrop.threshold'>5</entry>

<!-- Trips -->
<entry key='report.trip.useIgnition'>true</entry>
<entry key='report.trip.minimalTripDuration'>60</entry>
<entry key='report.trip.minimalTripDistance'>50</entry>
<entry key='report.trip.minimalParkingDuration'>120</entry>
<entry key='report.trip.minimalNoDataDuration'>600</entry>

<!-- Geocoding -->
<entry key='geolocation.enable'>false</entry>
<entry key='geocoder.type'>pluscodes</entry>
<entry key='geocoder.cacheSize'>100000</entry>

<!-- Notifications -->
<entry key='notificator.types'>command,web,mail,sms,firebase,traccar,telegram,pushover</entry>
<entry key='notificator.firebase.serviceAccount'><YOUR_FIREBASE_SERVICE_ACCOUNT_JSON></entry>

<!-- Misc -->
<entry key='atrack.custom'>true</entry>
<entry key='media.path'>./target/media</entry>
```

> `web.port` is shown for clarity. Confirm how your supplied build sets its web port; the reference white-label instance uses 8083.

### What the key settings do

| Setting | Value | Purpose |
| --- | --- | --- |
| `filter.static` | true | Keep stationary packets so ignition and stops are recorded |
| `filter.stationaryPeriod` | 300 | One saved position every 5 minutes while parked |
| `filter.stationaryDistance` | 20 | Ignore GPS drift up to 20 m while parked |
| `filter.minPeriod` | 10 | At least 10 s between saved positions |
| `filter.accuracy` | 30 | Drop poor-accuracy points |
| `filter.maxSpeed` | 200 | Discard spikes above 200 km/h |
| `filter.past` / `filter.future` | 300 / 600 | Drop packets too old or too far in the future |
| `filter.skipAttributes` | ignition | Never skip a position when ignition changes |
| `motion.inactive.timeout` | 600 | Stopped after 600 s without movement |
| `event.motion.speedThreshold` | 4 | Speeds below 4 km/h count as stationary |
| `status.timeout` | 300 | Device offline after 5 minutes of silence |
| `report.trip.useIgnition` | true | Trips follow ignition state |
| `geolocation.enable` / `geocoder.type` | false / pluscodes | No external geocoding (avoids blocking); the app and backend resolve addresses |

### Deliberately disabled

Position forwarding (`forward.url`), the custom scheduler, event start/stop delays and connection-pool size settings are disabled because they caused thread blocking or were unnecessary. Enable the **connection-pool settings** when your fleet grows beyond roughly 200-300 devices.

## 4.4 Notifications

- Firebase service account: set in `notificator.firebase.serviceAccount`, or point to a JSON file on disk.
- Message templates: `templates/short/` in the Traccar folder.
- An SMS HTTP gateway (`sms.http.url`, `sms.http.authorization`, `sms.http.template`) is supported but disabled by default.

## 4.5 Everyday tasks

**Add a device:** Traccar panel, Settings, Devices, Add; enter name and device identifier (IMEI), Save.

**Geofences and users:** created by the backend through Traccar's `/api/geofences`, `/api/permissions` and `/api/users`. Customers normally manage geofences from the mobile app.

## 4.6 Upgrading Traccar

Both the Traccar source and its web front-end are customised, so an upgrade is **not** a version bump. Re-apply the customisations on top of the new release (backend code and front-end), then re-test the backend and the app. Back up PostgreSQL first, using client tools matching the server version.
