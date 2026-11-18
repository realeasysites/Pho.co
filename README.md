# Pho Co. Variety (Westbrook, ME)

Website for Pho Co. Variety, 158 Spring Street, Westbrook, ME 04092 · (207) 409-5822.
Built by Real Easy Sites.

- Online ordering runs on their existing **Clover** page. Every "Order Online" button links there.
- The catering / large-order form saves to SQLite and shows up in the admin dashboard at `/admin`.

## Run locally

```bash
npm install
ADMIN_PASSWORD=choose-one npm start
# http://localhost:3000   admin: http://localhost:3000/admin
```

## Deploy on Render (Web Service)

- Build command: `npm install`
- Start command: `npm start`
- Node 20 is pinned (`.node-version` + `engines`) because better-sqlite3 has no prebuilt binary for newer Node.
- Add a persistent disk and set `DATA_DIR` to its mount path (for example `/var/data`), or inquiries reset on each deploy.

### Environment variables

| Variable | Purpose |
| --- | --- |
| `ADMIN_PASSWORD` | Dashboard password. The login is disabled until this is set. |
| `SESSION_SECRET` | Optional. Signs the admin session cookie. |
| `NOTIFY_EMAIL` | Inbox that gets an email for each new inquiry. |
| `SMTP_USER` / `SMTP_PASS` | Gmail address + app password used to send those emails. |
| `SMTP_HOST` / `SMTP_PORT` | Optional. Default `smtp.gmail.com` / `465`. |
| `DATA_DIR` | Optional. Where the SQLite file lives. |

## Photos (`public/images/`)

All slots are filled with the restaurant's own photos from their Facebook page: `logo.png`, `hero.jpg`, `pho.jpg`, `banh-mi.jpg`, `bubble-tea.jpg`, `about.jpg` (storefront), plus 16 square shots in `gallery/`. To swap one, replace the file with the same name. To add a gallery photo, drop an 800x800 JPG in `gallery/` and copy one `<figure>` line in the gallery section of `index.html`.

## Before launch

- [ ] Confirm hours. Facebook lists Tue–Sat 10am–7pm, but that listing was last updated about 3 years ago.
- [ ] Set `ADMIN_PASSWORD`, `NOTIFY_EMAIL` and the SMTP variables in Render
- [ ] Once the domain is live, change the `og:image` / `twitter:image` tags in `index.html` to the full URL (e.g. `https://theirdomain.com/images/logo.png`) so Facebook and text previews pick up the logo
- [ ] Menu items come from their 2021 Facebook menu. Prices are left off on purpose and point to Clover; check with the owner for any dishes that were added or dropped.
