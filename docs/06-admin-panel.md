# 6. Admin Panel

A web application for your own team. Only users with the **superadmin** role can sign in. Customers use the mobile app only.

| Item | Detail |
| --- | --- |
| Talks to | The Node.js backend |
| Hosting | Any static web hosting (AWS Amplify, Netlify, Nginx, etc.) |
| Web address | `admin.<YOUR_DOMAIN>` |

## Deploy

1. Set the backend API base URL in the admin panel's configuration to `https://api.<YOUR_DOMAIN>`.
2. Build the front-end using the project's build command.
3. Publish the build output to your static host.
4. Point `admin.<YOUR_DOMAIN>` at the host and enable HTTPS.

## Create the first superadmin

Create a user in MongoDB (or via your handover seed data) with role `superadmin`. Sign in at the admin URL to confirm.

## Branding

Name, logo and colours: see [Branding](08-branding.md).

## Features

<!-- Fill in from your admin panel: one row per feature -->

| Feature | What it does |
| --- | --- |
| <FEATURE> | <DESCRIPTION> |
