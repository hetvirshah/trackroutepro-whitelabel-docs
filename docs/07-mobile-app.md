# 7. Mobile App (Flutter)

| Item | Detail |
| --- | --- |
| Flutter / Dart | Flutter 3.38.4 (stable) |
| State management | GetX |
| Networking | Dio |
| Maps | `google_maps_flutter` |
| Flavors | `staging` (standard) and **`label`** (white-label) |
| Languages | English, Hindi, Gujarati, Marathi and others |

## 7.1 Set up

```bash
flutter doctor
git clone <YOUR_APP_REPO_URL>
cd <APP_FOLDER>
flutter pub get
```

## 7.2 Point the app at your servers

URLs live in `lib/constants/project_urls.dart`. The `ProjectUrls.isStaging` flag selects the environment. For white-label builds set it to **`false`** and put **your** URLs in the white-label values:

| Setting | Set to |
| --- | --- |
| `baseUrl` (backend) | `https://api.<YOUR_DOMAIN>` |
| `basebackUrl` (Traccar) | `https://track.<YOUR_DOMAIN>` |

> **Important:** the Traccar URL (`basebackUrl`) must **also** be changed in `track_device.dart`. If you update only one, some screens will point to the wrong server.

After any backend URL change, publish a new app version.

## 7.3 Google Maps

| Platform | Location |
| --- | --- |
| Android | `android/app/src/main/AndroidManifest.xml`, `meta-data` entry `com.google.android.geo.API_KEY` |
| iOS | `ios/Runner/AppDelegate.swift`, `GMSServices.provideAPIKey("...")` |

Enable Maps SDK (Android and iOS), Places and Geocoding APIs. **Restrict the keys** to your app's package name / bundle ID.

## 7.4 Firebase (push notifications)

Create your own Firebase project and register the Android and iOS apps, then replace:

| File | Replace with |
| --- | --- |
| `lib/firebase_options.dart` | Your project's generated options (`flutterfire configure`) |
| `android/app/src/label/google-services.json` | Your Android config |
| iOS `GoogleService-Info.plist` | Your iOS config (and upload your APNs key in Firebase) |

Use the **same** Firebase project's service account in the backend and in `traccar.xml`.

How tokens flow: the app obtains the FCM token and sends `POST /Auth/UpdateToken` with `{ "id": userId, "firebaseToken": token, "isLogout": false }`. Tapping a notification opens the Alerts screen.

## 7.5 App identity

Change the application ID / bundle ID, app name, icons and splash screen to your own (see [Branding](08-branding.md)). The reference app uses a Track Route Pro bundle ID; do not publish under it.

## 7.6 Run

```bash
flutter run --flavor label
```

## 7.7 Build and release

```bash
flutter clean
flutter pub get

# Android
flutter build appbundle --flavor label --release   # Google Play
flutter build apk --flavor label --release         # APK

# iOS
flutter build ipa --flavor label --release
# then open Runner.xcworkspace in Xcode, archive, submit to App Store Connect / TestFlight
```

### Signing

| Item | Location |
| --- | --- |
| Android keystore | `android/app/upload-keystore.jks` (**generate your own**) |
| Keystore settings | `android/key.properties` (`storeFile`, `keyAlias`, passwords) |
| iOS | Xcode, Signing and Capabilities: your Apple Developer team certificate and provisioning profile |

```bash
keytool -genkey -v -keystore android/app/upload-keystore.jks -keyalg RSA -keysize 2048 -validity 10000 -alias upload
```

> Back up the keystore and its passwords somewhere safe. Losing them prevents you from updating the app on Google Play.

## 7.8 Screens and the backend APIs they call

| Screen | Main APIs |
| --- | --- |
| Login | `/Auth/checkUser`, `/Auth/send_otp`, `/Auth/verifyOtp`, `/Auth/login`, `/Auth/demoLogin`, `/Auth/getDemoUser`, `/api/session/token` (Traccar), `/Auth/UpdateToken` |
| Live map | Traccar positions + backend WebSocket |
| History | `/positions` and `/reports/stops` (Traccar), `/trackVehicle/rootHistory` |
| Geofences | `/vehicle/getAllgeofence`, `/vehicle/geofence`, `/vehicle/updategeofence`, `/vehicle/removegeofence`, `/vehicle/subgeoFence` |
| Alerts | `/notification/alerts`, `/Auth/updateUser`, `/notification/notificationByID` |
| Vehicles | `/trackVehicle/getByVehicleID`, `/vehicle/update`, `/vehicleType/get` |
| Speed alerts | `/alert/updateSpeed` |
| Parking mode | `/alert/updateParking` |
| Reports | `/SummaryReport/*`, `/trackVehicle/summary` |
| Subscriptions | `/vehicle/renewDevice`, `/ecomm/razorpay/createorder`, `/ecomm/razorpay/verifysignature`, `/ecomm/razorpay/getKeys` |
| Profile / settings | `/Auth/profile`, `/Auth/UserDetails`, `/FaQtopic/get`, `/FaQlist/get`, `/about/get`, `/privacyPolicy/get` |

Address lookup (reverse geocoding) goes through the backend (`POST /common/jioCode`) with Google Geocoding as fallback.
