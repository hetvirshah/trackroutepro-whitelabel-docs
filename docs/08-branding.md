# 8. Branding

| Area | What can be branded | What you supply |
| --- | --- | --- |
| Mobile app | App name, icon, splash screen,  languages, store listing | Name, logo files, translations |
| Admin panel | Name, logo, colours | Logo files,  web address |
| Traccar panel | Logo, colours and layout (stylesheet), notification templates | Logo files, colours, message wording |
| Emails | Templates in `src/MailBody/` | Sender name, logo, wording |
| Push notifications | Sent from your Firebase project under your app | Your Firebase project |
| Domains | Backend, admin panel, Traccar panel | Domain names, DNS access |
| Legal pages | Privacy policy, terms, About, FAQs (served by backend: `/privacyPolicy/get`, `/about/get`, `/FaQtopic/get`, `/FaQlist/get`) | Your own text |

## Where to change things

| What | Where |
| --- | --- |
| Traccar look | `traccar-web/simple` (CSS, logo) |
| Traccar notification text | `templates/short/` |
| Email templates | `src/MailBody/` in the backend |
| App strings / languages | Flutter localisation files |
| Backend translations | `locales/` and `src/locales/` |

## Checklist

- [ ] App name and short description
- [ ] Logo (square and wide, PNG and SVG)
- [ ] App icon and splash screen artwork
- [ ] Brand colours (HEX) and fonts
- [ ] Domain names for backend, admin panel, Traccar panel
- [ ] Google Play Console and Apple Developer accounts
- [ ] Firebase project
- [ ] Google Maps API key
- [ ] Razorpay account
- [ ] Privacy policy and terms and conditions
- [ ] Support contact details
