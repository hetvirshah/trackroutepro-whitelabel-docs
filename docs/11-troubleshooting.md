# 11. Troubleshooting

| Problem | First checks |
| --- | --- |
| Vehicles show offline | Device power and SIM data; Traccar running; the device's port open in the firewall; device configured with the right server and port |
| Location old or not updating | Device signal and placement; ignition cycle; Traccar log |
| No alerts on phones | Firebase config in app, backend and Traccar all from the **same** project; app notification permission; backend running; user logged in |
| App cannot log in | Backend running; SMS provider working for OTP; correct `baseUrl` in the app |
| Some screens load from the wrong server | `basebackUrl` differs between `project_urls.dart` and `track_device.dart` |
| Map is blank | Google Maps key missing, restricted incorrectly, or API not enabled |
| Admin panel will not open | Static hosting and domain; backend running; API base URL |
| Admin sign-in rejected | User must have the `superadmin` role |
| Payment fails | Razorpay keys (test vs live), webhook configured, signature verification |
| Speeds look too high | Backend returns **knots**; app converts to km/h |
| Geofence alert missing | Zone switched on, assigned to the vehicle, radius not too small |
| Route looks incomplete | Device offline or no GPS fix during part of the trip |
| Server disk full | Traccar log size (`ls -lh traccar.log`) and old data; clear space and restart |
| WebSocket / live updates fail | Nginx `Upgrade` headers present on API and Traccar sites |

## Useful commands

```bash
pm2 logs <PROJECT_NAME> --lines 100
sudo systemctl status nginx postgresql
sudo docker ps
sudo certbot certificates
df -h
tail -f /opt/traccar/traccar.log
```
